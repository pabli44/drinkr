"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconLoader() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setOrder(data);

          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("success") === "true") {
            const retryRes = await fetch(`/api/orders/${id}`);
            if (retryRes.ok) {
              setOrder(await retryRes.json());
            }
          }
        } else if (res.status === 404 && !cancelled) {
          setError("Pedido no encontrado");
        }
      } catch {
        if (!cancelled) setError("Error al cargar el pedido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handlePay() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Error al procesar el pago");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 4rem)",
          backgroundColor: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner-craft" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 4rem)",
          backgroundColor: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "26rem",
            width: "100%",
            textAlign: "center",
            border: "1px solid #FEE2E2",
          }}
        >
          <p style={{ fontFamily: "var(--font-sans)", color: "#991B1B", fontSize: "0.9375rem" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-cream)",
        padding: "3rem 0",
      }}
    >
      <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 2px 12px rgba(26, 22, 18, 0.08)",
            border: "1px solid rgba(196, 127, 23, 0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(26, 22, 18, 0.06)",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-toast)",
                  letterSpacing: "-0.02em",
                }}
              >
                Pedido #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  color: "var(--color-toast-muted)",
                  marginTop: "0.25rem",
                }}
              >
                {formattedDate}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-toast-muted)",
                  marginBottom: "0.25rem",
                }}
              >
                Tu pedido
              </h2>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid rgba(26, 22, 18, 0.05)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--color-toast)",
                      }}
                    >
                      {item.beer?.name || "Cerveza"}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8125rem",
                        color: "var(--color-toast-muted)",
                      }}
                    >
                      {item.quantity}L × ${Number(item.unitPrice).toFixed(2)}/L
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--color-toast)",
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingTop: "1rem",
              borderTop: "2px solid rgba(26, 22, 18, 0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-toast)",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-amber-deep)",
                letterSpacing: "-0.025em",
              }}
            >
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>

          {/* Notes */}
          {order.notes && (
            <div
              style={{
                backgroundColor: "var(--color-cream)",
                padding: "0.875rem 1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "var(--color-toast-muted)",
                }}
              >
                <strong style={{ color: "var(--color-toast)" }}>Notas:</strong> {order.notes}
              </p>
            </div>
          )}

          {/* Status messages */}
          {order.status === "PENDING" && (
            <div>
              {error && (
                <div
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#991B1B",
                    padding: "0.75rem 0.875rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </div>
              )}
              <button
                onClick={handlePay}
                disabled={paying}
                className="btn-craft-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {paying ? (
                  <>
                    <div className="spinner-craft" style={{ width: "16px", height: "16px" }} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <IconCreditCard />
                    Pagar Ahora
                  </>
                )}
              </button>
            </div>
          )}

          {order.status === "PAID" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <span style={{ color: "#1D4ED8", marginTop: "2px", flexShrink: 0 }}>
                <IconCheck />
              </span>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "#1E40AF",
                  lineHeight: 1.55,
                }}
              >
                Tu pago fue confirmado. Tu pedido está en preparación y lo tendrás listo pronto.
              </p>
            </div>
          )}

          {order.status === "PREPARING" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                backgroundColor: "#FFF7ED",
                border: "1px solid #FED7AA",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <span style={{ color: "#C2410C", marginTop: "2px", flexShrink: 0 }}>
                <IconLoader />
              </span>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "#9A3412",
                  lineHeight: 1.55,
                }}
              >
                Tu pedido se está preparando. Te notificaremos cuando esté listo para retirar.
              </p>
            </div>
          )}

          {order.status === "READY" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <span style={{ color: "#059669", marginTop: "2px", flexShrink: 0 }}>
                <IconCheck />
              </span>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "#065F46",
                  fontWeight: 600,
                  lineHeight: 1.55,
                }}
              >
                ¡Tu pedido está listo para retirar!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
