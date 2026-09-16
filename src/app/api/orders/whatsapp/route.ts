import { NextResponse } from "next/server";
import { whatsappOrderSchema } from "@/lib/validators";
import {
  createWhatsAppReservation,
  InsufficientStockError,
} from "@/lib/order";
import type { OrderWithItems } from "@/lib/order";

function buildWhatsAppUrl(order: OrderWithItems): string {
  const phone = process.env.ADMIN_WHATSAPP?.replace(/\D/g, "") ?? "573001234567";
  const lines = ["¡Hola! Quiero hacer un pedido en drinkr:"];
  let total = 0;

  for (const item of order.items) {
    const unitPrice = Number(item.product.promoPrice);
    const subtotal = unitPrice * item.quantity;
    total += subtotal;
    lines.push(
      `• ${item.product.name} x${item.quantity} — ${formatPrice(unitPrice)} c/u = ${formatPrice(subtotal)}`
    );
  }

  lines.push("");
  lines.push(`Total: ${formatPrice(total)}`);
  lines.push("");
  lines.push("Quedo atento a la confirmación. ¡Gracias!");

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

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

function getReservationMinutes(): number {
  const raw = process.env.RESERVATION_MINUTES;
  if (!raw) return 60;
  const parsed = Number(raw);
  return Number.isNaN(parsed) || parsed <= 0 ? 60 : parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = whatsappOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de pedido inválidos" },
        { status: 400 }
      );
    }

    const order = await createWhatsAppReservation(parsed.data.items, {
      reservationMinutes: getReservationMinutes(),
    });

    const response = NextResponse.json({
      order: serializeOrder(order),
      whatsappUrl: buildWhatsAppUrl(order),
    });

    response.cookies.set("order_token", order.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getReservationMinutes() * 60,
    });

    return response;
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json(
        { error: "No hay stock suficiente para completar el pedido" },
        { status: 409 }
      );
    }

    console.error("[whatsapp-order]", error);
    return NextResponse.json(
      { error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}
