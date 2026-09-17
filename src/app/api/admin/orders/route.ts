import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import type { OrderWithItems } from "@/lib/order";

function serializeOrder(order: OrderWithItems) {
  const total = order.items.reduce(
    (sum, item) => sum + Number(item.priceAtReservation) * item.quantity,
    0
  );

  return {
    id: order.id,
    token: order.token,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.priceAtReservation),
    })),
    total,
  };
}

export async function GET(request: Request) {
  const payload = await getUserFromRequest(request);

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { status: "PENDING_WHATSAPP" },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      orders: orders.map((order) => serializeOrder(order as OrderWithItems)),
    });
  } catch (error) {
    console.error("[admin-orders]", error);
    return NextResponse.json(
      { error: "Error al cargar los pedidos" },
      { status: 500 }
    );
  }
}
