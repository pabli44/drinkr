import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_...")) return null;
  return new Resend(key);
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderId: string,
  totalAmount: string
) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend not configured, skipping order confirmation email");
    return;
  }
  await resend.emails.send({
    from: "Beer Drop <onboarding@resend.dev>",
    to,
    subject: `Pedido #${orderId.slice(-8)} confirmado`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d97706;">Beer Drop - Pedido Confirmado</h1>
        <p>Tu pago ha sido recibido y tu pedido est en preparacin.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Pedido:</strong> #${orderId.slice(-8)}</p>
          <p><strong>Total:</strong> $${totalAmount}</p>
        </div>
        <p>Te notificaremos cuando tu pedido est listo para recoger.</p>
        <p style="color: #6b7280; font-size: 12px;">Beer Drop - Cerveza Artesanal</p>
      </div>
    `,
  });
}

export async function sendOrderReadyEmail(
  to: string,
  orderId: string
) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend not configured, skipping order ready email");
    return;
  }
  await resend.emails.send({
    from: "Beer Drop <onboarding@resend.dev>",
    to,
    subject: `Pedido #${orderId.slice(-8)} listo para recoger`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Tu pedido est listo!</h1>
        <p>Tu pedido <strong>#${orderId.slice(-8)}</strong> ya est preparado.</p>
        <p>Pod pasarlo a recoger en cualquier momento.</p>
        <p style="color: #6b7280; font-size: 12px;">Beer Drop - Cerveza Artesanal</p>
      </div>
    `,
  });
}

export async function sendStockErrorEmail(
  to: string,
  orderId: string
) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend not configured, skipping stock error email");
    return;
  }
  await resend.emails.send({
    from: "Beer Drop <onboarding@resend.dev>",
    to,
    subject: `Pedido #${orderId.slice(-8)} cancelado - Sin stock`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Pedido cancelado</h1>
        <p>Lamentamos informarte que tu pedido <strong>#${orderId.slice(-8)}</strong> ha sido cancelado porque no hay suficiente stock disponible.</p>
        <p>El monto pagado ser reembolsado en los prximos das.</p>
        <p style="color: #6b7280; font-size: 12px;">Beer Drop - Cerveza Artesanal</p>
      </div>
    `,
  });
}
