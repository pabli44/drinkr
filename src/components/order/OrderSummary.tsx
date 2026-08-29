import type { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import Link from "next/link";

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

interface OrderSummaryProps {
  order: Order;
  showLink?: boolean;
}

export function OrderSummary({ order, showLink = true }: OrderSummaryProps) {
  const total = Number(order.totalAmount);
  const date = new Date(order.createdAt);

  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 1px 3px rgba(26, 22, 18, 0.06), 0 2px 8px rgba(26, 22, 18, 0.04)",
        border: "1px solid rgba(196, 127, 23, 0.06)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: order.items?.length ? "1rem" : 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--color-toast-muted)",
              textTransform: "uppercase",
            }}
          >
            Pedido #{order.id.slice(-8).toUpperCase()}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "var(--color-toast-muted)",
              marginTop: "0.125rem",
            }}
          >
            {formattedDate} · {formattedTime}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div
          style={{
            borderTop: "1px solid rgba(26, 22, 18, 0.06)",
            paddingTop: "0.875rem",
            marginTop: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  color: "var(--color-toast)",
                  fontWeight: 500,
                }}
              >
                {item.beer?.name || "Cerveza"} · {item.quantity}L
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  color: "var(--color-toast-muted)",
                }}
              >
                ${(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div
        style={{
          borderTop: "1px solid rgba(26, 22, 18, 0.06)",
          paddingTop: "0.875rem",
          marginTop: "0.875rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-toast)",
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-amber-deep)",
            letterSpacing: "-0.02em",
          }}
        >
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Link */}
      {showLink && (
        <Link
          href={`/order/${order.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            marginTop: "1rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-amber-deep)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-amber-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-amber-deep)";
          }}
        >
          Ver detalles
          <IconArrowRight />
        </Link>
      )}
    </div>
  );
}
