"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import { OrderSummary } from "@/components/order/OrderSummary";

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && !cancelled) {
          setOrders(await res.json());
        } else if (res.status === 401 && !cancelled) {
          router.push("/login");
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-cream)", padding: "3rem 0" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
            gap: "1rem",
            flexWrap: "wrap",
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
              Tu cuenta
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--color-toast)",
                letterSpacing: "-0.025em",
              }}
            >
              Mis Pedidos
            </h1>
          </div>
          <button
            onClick={() => router.push("/menu")}
            className="btn-craft-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <IconPlus />
            Nuevo Pedido
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner-craft" style={{ margin: "0 auto" }} />
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--color-toast-muted)",
                marginTop: "1rem",
              }}
            >
              Cargando pedidos...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty */
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(196, 127, 23, 0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                fontWeight: 900,
                color: "rgba(196, 127, 23, 0.12)",
                marginBottom: "1rem",
              }}
            >
              B
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-toast)",
              }}
            >
              Sin pedidos aún
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                color: "var(--color-toast-muted)",
                marginTop: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Hacé tu primer pedido de cerveza artesanal
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="btn-craft-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              Ver Carta
              <IconArrowRight />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order) => (
              <OrderSummary key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
