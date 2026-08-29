import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:    { label: "Pendiente",   bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  PAID:       { label: "Pagado",       bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  PREPARING:  { label: "Preparando",   bg: "#FED7AA", text: "#9A3412", dot: "#F97316" },
  READY:      { label: "Listo",        bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  DELIVERED:  { label: "Entregado",    bg: "#F3F4F6", text: "#374151", dot: "#6B7280" },
  CANCELLED:  { label: "Cancelado",    bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.25rem 0.625rem",
        borderRadius: "9999px",
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
