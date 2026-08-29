import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOrderSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth/session";
import { mercadopago } from "@/lib/mercadopago";
import { Preference } from "mercadopago";

const preference = new Preference(mercadopago);

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const where = user.role === "ADMIN" ? {} : { userId: user.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { beer: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items, notes } = parsed.data;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const beer = await tx.beer.findUnique({
          where: { id: item.beerId },
        });

        if (!beer || !beer.isActive) {
          throw new Error(`Cerveza ${item.beerId} no disponible`);
        }

        const stockActual = Number(beer.stockInLiters);
        const cantidadSolicitada = item.quantity;

        if (stockActual < cantidadSolicitada) {
          throw new Error(
            `Stock insuficiente para ${beer.name}. Disponible: ${stockActual}L, Solicitado: ${cantidadSolicitada}L`
          );
        }
      }

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const beer = await tx.beer.findUnique({
          where: { id: item.beerId },
        });

        const subtotal = Number(beer!.pricePerLiter) * item.quantity;
        total += subtotal;

        orderItems.push({
          beerId: item.beerId,
          quantity: item.quantity,
          unitPrice: Number(beer!.pricePerLiter),
        });
      }

      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: total,
          status: "PENDING",
          notes,
          items: {
            create: orderItems,
          },
        },
        include: { items: { include: { beer: true } } },
      });

      return newOrder;
    });

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

    return NextResponse.json({ url: result.init_point, orderId: order.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear pedido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
