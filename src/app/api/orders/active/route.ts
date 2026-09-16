import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getActiveOrderByToken } from "@/lib/order";
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

export async function GET() {
  try {
    const token = (await cookies()).get("order_token")?.value;

    if (!token) {
      return NextResponse.json({ order: null });
    }

    const order = await getActiveOrderByToken(token);

    if (!order) {
      const response = NextResponse.json({ order: null });
      response.cookies.set("order_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error) {
    console.error("[active-order]", error);
    return NextResponse.json(
      { error: "Error al recuperar la reserva" },
      { status: 500 }
    );
  }
}
