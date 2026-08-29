"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
] as const;

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && !cancelled) {
          setOrders(await res.json());
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const listRes = await fetch("/api/orders");
        if (listRes.ok) setOrders(await listRes.json());
      }
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-cream)", padding: "3rem 0" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-copper)",
                marginBottom: "0.5rem",
              }}
            >
              Panel de control
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "var(--color-toast)",
                letterSpacing: "-0.025em",
              }}
            >
              Gestionar Pedidos
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href="/admin/beers"
              style={{
                backgroundColor: "white",
                border: "1px solid rgba(26, 22, 18, 0.12)",
                color: "var(--color-toast)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                padding: "0.5rem 0.875rem",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Cervezas
            </a>
            <a
              href="/admin/users"
              style={{
                backgroundColor: "white",
                border: "1px solid rgba(26, 22, 18, 0.12)",
                color: "var(--color-toast)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                padding: "0.5rem 0.875rem",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Usuarios
            </a>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner-craft" style={{ margin: "0 auto" }} />
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "12px",
              border: "1px solid rgba(196, 127, 23, 0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                fontWeight: 900,
                color: "rgba(196, 127, 23, 0.12)",
              }}
            >
              —
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginTop: "1rem",
              }}
            >
              Sin pedidos aún
            </h2>
          </div>
        ) : (
          /* Table */
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(26, 22, 18, 0.06)",
              border: "1px solid rgba(196, 127, 23, 0.06)",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-cream-dark)" }}>
                  {["Pedido", "Cliente", "Items", "Total", "Estado", "Acción"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-toast-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    style={{
                      borderTop: i > 0 ? "1px solid rgba(26, 22, 18, 0.05)" : undefined,
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--color-toast)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          color: "var(--color-toast-muted)",
                          marginTop: "0.125rem",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("es-ES")}
                      </p>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--color-toast)",
                        }}
                      >
                        {order.user?.name || "N/A"}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          color: "var(--color-toast-muted)",
                        }}
                      >
                        {order.user?.email}
                      </p>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {order.items?.map((item) => (
                          <span
                            key={item.id}
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "0.8125rem",
                              color: "var(--color-toast-muted)",
                            }}
                          >
                            {item.beer?.name} · {item.quantity}L
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "var(--color-amber-deep)",
                        }}
                      >
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          padding: "0.375rem 0.625rem",
                          borderRadius: "6px",
                          border: "1.5px solid rgba(26, 22, 18, 0.12)",
                          backgroundColor: "white",
                          color: "var(--color-toast)",
                          cursor: updating === order.id ? "not-allowed" : "pointer",
                          opacity: updating === order.id ? 0.6 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
