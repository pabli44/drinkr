import { prisma } from "./db";
import type { Order, OrderItem, Product } from "@/generated/client";

export class InsufficientStockError extends Error {
  constructor(public productId: string) {
    super(`Insufficient stock for product ${productId}`);
    this.name = "InsufficientStockError";
  }
}

interface ReservationItem {
  productId: string;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export async function createWhatsAppReservation(
  items: ReservationItem[],
  options?: { reservationMinutes?: number }
): Promise<OrderWithItems> {
  const reservationMinutes = options?.reservationMinutes ?? Number(process.env.RESERVATION_MINUTES ?? 60);

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const productById = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productById.get(item.productId);
    if (!product) {
      throw new InsufficientStockError(item.productId);
    }
  }

  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new InsufficientStockError(item.productId);
      }
    }

    const order = await tx.order.create({
      data: {
        status: "PENDING_WHATSAPP",
        expiresAt: addMinutes(new Date(), reservationMinutes),
        token: cryptoRandomToken(),
        items: {
          create: items.map((item) => {
            const product = productById.get(item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              priceAtReservation: product.promoPrice,
            };
          }),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return order as OrderWithItems;
  });
}

export async function cancelReservation(token: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { token },
    include: { items: true },
  });

  if (!order || order.status !== "PENDING_WHATSAPP") {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
      include: { items: { include: { product: true } } },
    });

    return updated as OrderWithItems;
  });
}

export async function expirePendingOrders(now = new Date()): Promise<number> {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "PENDING_WHATSAPP",
      expiresAt: { lt: now },
    },
    include: { items: true },
  });

  for (const order of expiredOrders) {
    await prisma.$transaction(async (tx) => {
      const transitioned = await tx.order.updateMany({
        where: {
          id: order.id,
          status: "PENDING_WHATSAPP",
          expiresAt: { lt: now },
        },
        data: { status: "EXPIRED" },
      });

      if (transitioned.count === 0) {
        return;
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });
  }

  return expiredOrders.length;
}

export async function getActiveOrderByToken(token: string): Promise<OrderWithItems | null> {
  await expirePendingOrders();

  const order = await prisma.order.findUnique({
    where: { token },
    include: { items: { include: { product: true } } },
  });

  if (!order || (order.status !== "PENDING_WHATSAPP" && order.status !== "COMPLETED")) {
    return null;
  }

  return order as OrderWithItems;
}

function cryptoRandomToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 24;
  let result = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}
