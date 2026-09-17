import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const payload = await getUserFromRequest(request);

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { token } = await params;

    const order = await prisma.order.findUnique({
      where: { token },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (order.status !== "PENDING_WHATSAPP") {
      return NextResponse.json(
        { error: "El pedido no puede ser completado" },
        { status: 409 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ order: serializeOrder(updated as OrderWithItems) });
  } catch (error) {
    console.error("[complete-order]", error);
    return NextResponse.json(
      { error: "Error al confirmar el pedido" },
      { status: 500 }
    );
  }
}
