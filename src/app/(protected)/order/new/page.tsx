"use client";

import { useEffect, useState } from "react";
import type { Beer } from "@/types";

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}

export default function NewOrderPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/beers")
      .then((res) => res.json())
      .then((data) => setBeers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBeer) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ beerId: selectedBeer, quantity }],
        }),
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
      setError("Error al crear el pedido");
    } finally {
      setSubmitting(false);
    }
  }

  const selected = beers.find((b) => b.id === selectedBeer);
  const total = selected ? Number(selected.pricePerLiter) * quantity : 0;

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

  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-cream)",
        padding: "3rem 0",
      }}
    >
      <div style={{ maxWidth: "32rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
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
            Nuevo pedido
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 700,
              color: "var(--color-toast)",
              letterSpacing: "-0.025em",
            }}
          >
            Hacer un pedido
          </h1>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#991B1B",
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              marginBottom: "1.25rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 2px 12px rgba(26, 22, 18, 0.08)",
            border: "1px solid rgba(196, 127, 23, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Beer select */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginBottom: "0.5rem",
              }}
            >
              Seleccioná tu cerveza
            </label>
            <select
              value={selectedBeer}
              onChange={(e) => setSelectedBeer(e.target.value)}
              className="input-craft"
              style={{ paddingLeft: "0.875rem" }}
            >
              <option value="">— Elegir cerveza —</option>
              {beers
                .filter((b) => b.isActive && Number(b.stockInLiters) > 0)
                .map((beer) => (
                  <option key={beer.id} value={beer.id}>
                    {beer.name} — ${Number(beer.pricePerLiter).toFixed(2)}/L ({beer.stockInLiters}L disponible)
                  </option>
                ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginBottom: "0.5rem",
              }}
            >
              Cantidad de litros
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max={selected ? Number(selected.stockInLiters) : 100}
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
              className="input-craft"
              style={{ paddingLeft: "0.875rem" }}
            />
          </div>

          {/* Total */}
          {selected && (
            <div
              style={{
                backgroundColor: "var(--color-cream)",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "var(--color-toast-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                <span>
                  {quantity}L × ${Number(selected.pricePerLiter).toFixed(2)}/L
                </span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: "0.625rem",
                  borderTop: "1px solid rgba(196, 127, 23, 0.15)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--color-toast)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-amber-deep)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedBeer || submitting}
            className="btn-craft-primary"
            style={{ justifyContent: "center", gap: "0.5rem", marginTop: "0.25rem" }}
          >
            {submitting ? (
              <>
                <div className="spinner-craft" style={{ width: "16px", height: "16px" }} />
                Procesando...
              </>
            ) : (
              <>
                <IconCreditCard />
                Ir a Pagar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
