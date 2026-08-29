import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { mercadopago } from "@/lib/mercadopago";
import { Preference } from "mercadopago";

const preference = new Preference(mercadopago);

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { orderId } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { beer: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Este pedido ya fue procesado" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const result = await preference.create({
      body: {
        items: order.items.map((item) => ({
          id: item.id,
          title: `${item.beer?.name || "Cerveza"} - ${item.quantity}L`,
          description: `${item.quantity} litros de cerveza artesanal`,
          quantity: 1,
          currency_id: "COP",
          unit_price: Number(item.unitPrice) * Number(item.quantity),
        })),
        external_reference: order.id,
        back_urls: {
          success: `${appUrl}/order/${order.id}?success=true`,
          failure: `${appUrl}/order/${order.id}?cancelled=true`,
          pending: `${appUrl}/order/${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/payments/webhook`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: result.id },
    });

    return NextResponse.json({ url: result.init_point });
  } catch {
    return NextResponse.json(
      { error: "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
