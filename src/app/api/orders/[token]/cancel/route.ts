import { NextResponse } from "next/server";
import { cancelReservation } from "@/lib/order";
import type { OrderWithItems } from "@/lib/order";

function serializeOrder(order: OrderWithItems) {
  return {
    id: order.id,
    token: order.token,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.priceAtReservation),
    })),
  };
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const order = await cancelReservation(token);

    if (!order) {
      return NextResponse.json(
        { error: "Reserva no encontrada o ya finalizada" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ order: serializeOrder(order) });
    response.cookies.set("order_token", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[cancel-order]", error);
    return NextResponse.json(
      { error: "Error al cancelar la reserva" },
      { status: 500 }
    );
  }
}
