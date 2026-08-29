"use client";

import { useEffect, useState } from "react";
import type { Beer, CartItem } from "@/types";
import { BeerCard } from "@/components/beer/BeerCard";

function IconShoppingBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function MenuPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/beers");
        if (res.ok && !cancelled) {
          setBeers(await res.json());
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

  function handleSelect(beer: Beer) {
    const newCart = new Map(cart);
    newCart.set(beer.id, { beerId: beer.id, beer, quantity: 0.5 });
    setCart(newCart);
  }

  function handleQuantityChange(beerId: string, quantity: number) {
    if (quantity <= 0) {
      const newCart = new Map(cart);
      newCart.delete(beerId);
      setCart(newCart);
    } else {
      const newCart = new Map(cart);
      const item = newCart.get(beerId);
      if (item) {
        newCart.set(beerId, { ...item, quantity });
        setCart(newCart);
      }
    }
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += Number(item.beer.pricePerLiter) * item.quantity;
    });
    return total;
  }

  async function handleOrder() {
    if (cart.size === 0) return;
    setOrdering(true);
    setError("");
    try {
      const items = Array.from(cart.values()).map((item) => ({
        beerId: item.beerId,
        quantity: item.quantity,
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
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
      setOrdering(false);
    }
  }

  const totalItems = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-cream)" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "3rem 1.5rem 8rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
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
            Nuestra Carta
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "var(--color-toast)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Cervezas artesanales
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-toast-muted)",
              marginTop: "0.5rem",
            }}
          >
            Seleccioná tu cerveza y la cantidad de litros que necesitás.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#991B1B",
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

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
              Cargando carta...
            </p>
          </div>
        ) : beers.length === 0 ? (
          /* Empty */
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
              B
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginTop: "1rem",
              }}
            >
              Sin cervezas disponibles
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                color: "var(--color-toast-muted)",
                marginTop: "0.5rem",
              }}
            >
              Volvé pronto, estamos preparando algo especial.
            </p>
          </div>
        ) : (
          <>
            {/* Beer grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {beers.map((beer) => {
                const cartItem = cart.get(beer.id);
                return (
                  <BeerCard
                    key={beer.id}
                    beer={beer}
                    showStock
                    onSelect={() => handleSelect(beer)}
                    selected={!!cartItem}
                    quantity={cartItem?.quantity || 0}
                    onQuantityChange={(q) => handleQuantityChange(beer.id, q)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating cart bar */}
      {cart.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "var(--color-toast)",
            borderTop: "1px solid rgba(196, 127, 23, 0.25)",
            padding: "1rem 1.5rem",
            zIndex: 40,
            boxShadow: "0 -4px 20px rgba(26, 22, 18, 0.15)",
          }}
        >
          <div
            style={{
              maxWidth: "72rem",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(196, 127, 23, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-amber-light)",
                  flexShrink: 0,
                }}
              >
                <IconShoppingBag />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8125rem",
                    color: "rgba(255, 248, 231, 0.55)",
                    fontWeight: 500,
                  }}
                >
                  {cart.size} cerveza{cart.size !== 1 ? "s" : ""} · {totalItems}L
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-amber-light)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ${getTotal().toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={handleOrder}
              disabled={ordering}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: ordering ? "rgba(196, 127, 23, 0.5)" : "var(--color-amber-deep)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                padding: "0.6875rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: ordering ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(196, 127, 23, 0.3)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!ordering) {
                  e.currentTarget.style.backgroundColor = "var(--color-amber-dark)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!ordering) {
                  e.currentTarget.style.backgroundColor = "var(--color-amber-deep)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {ordering ? "Procesando..." : "Ir a Pagar"}
              {!ordering && <IconArrowRight />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
