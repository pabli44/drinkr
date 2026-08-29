import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mercadopago } from "@/lib/mercadopago";
import { Payment } from "mercadopago";
import {
  sendOrderConfirmationEmail,
  sendStockErrorEmail,
} from "@/lib/email";

const paymentClient = new Payment(mercadopago);

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.type === "payment") {
    const paymentId = body.data?.id;

    if (!paymentId) {
      return NextResponse.json({ error: "No payment id" }, { status: 400 });
    }

    try {
      const payment = await paymentClient.get({ id: paymentId });

      if (payment.status === "approved") {
        const orderId = payment.external_reference;

        if (!orderId) {
          return NextResponse.json({ ok: true });
        }

        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: { select: { email: true } } },
          });

          if (!order || order.status !== "PENDING") {
            return;
          }

          for (const item of order.items) {
            const beer = await tx.beer.findUnique({
              where: { id: item.beerId },
            });

            if (!beer) {
              throw new Error(`Cerveza ${item.beerId} no encontrada`);
            }

            const stockActual = Number(beer.stockInLiters);
            const cantidadSolicitada = Number(item.quantity);

            if (stockActual < cantidadSolicitada) {
              await tx.order.update({
                where: { id: order.id },
                data: { status: "CANCELLED" },
              });

              if (order.user.email) {
                await sendStockErrorEmail(order.user.email, order.id);
              }

              return;
            }
          }

          for (const item of order.items) {
            await tx.beer.update({
              where: { id: item.beerId },
              data: {
                stockInLiters: {
                  decrement: item.quantity,
                },
              },
            });
          }

          await tx.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              paidAt: new Date(),
            },
          });

          if (order.user.email) {
            await sendOrderConfirmationEmail(
              order.user.email,
              order.id,
              order.totalAmount.toString()
            );
          }
        });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
