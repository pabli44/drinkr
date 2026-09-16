"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, Category } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";

interface ActiveOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface ActiveOrder {
  id: string;
  token: string;
  status: "PENDING_WHATSAPP";
  expiresAt: string;
  items: ActiveOrderItem[];
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function MenuContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("cat") ?? null
  );
  const [cart, setCart] = useState<
    Map<string, { product: Product; quantity: number }>
  >(new Map());
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [reserving, setReserving] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0);
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "573001234567";

  const restoreCartFromOrder = useCallback(
    (order: ActiveOrder, availableProducts: Product[]) => {
      const restored = new Map<string, { product: Product; quantity: number }>();
      for (const item of order.items) {
        const product = availableProducts.find((p) => p.id === item.productId);
        if (product) {
          restored.set(item.productId, { product, quantity: item.quantity });
        }
      }
      setCart(restored);
    },
    []
  );

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [categoriesRes, productsRes, activeRes] = await Promise.all([
          fetch("/api/categories", { credentials: "same-origin" }),
          fetch("/api/products", { credentials: "same-origin" }),
          fetch("/api/orders/active", { credentials: "same-origin" }),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const fetchedCategories = (categoriesData.categories ?? []).filter(
            (c: Category) => c.isActive
          );
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        }

        let availableProducts: Product[] = [];
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          availableProducts = (productsData.products ?? []).filter(
            (p: Product) => p.isActive
          );
          if (availableProducts.length > 0) {
            setProducts(availableProducts);
          }
        }

        if (activeRes.ok) {
          const activeData = await activeRes.json();
          const order = activeData.order as ActiveOrder | null;
          if (order) {
            setActiveOrder(order);
            restoreCartFromOrder(order, availableProducts);
          }
        }
      } catch {
        // Fall back to mock data already in state
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [restoreCartFromOrder]);

  useEffect(() => {
    if (!activeOrder) {
      setRemainingMinutes(0);
      return;
    }

    function updateRemaining() {
      const expiresAt = activeOrder?.expiresAt;
      if (!expiresAt) return;
      const diff = new Date(expiresAt).getTime() - Date.now();
      setRemainingMinutes(Math.max(0, Math.ceil(diff / 60_000)));
    }

    updateRemaining();
    const interval = setInterval(updateRemaining, 60_000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  useEffect(() => {
    if (activeCategory) return;
    const first = categories.find((c) => c.isActive);
    if (first) setActiveCategory(first.id);
  }, [categories, activeCategory]);

  const filteredProducts = products.filter(
    (p) => p.isActive && p.categoryId === activeCategory
  );

  const totalItems = Array.from(cart.values()).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = Array.from(cart.values()).reduce(
    (sum, item) => sum + Number(item.product.promoPrice) * item.quantity,
    0
  );

  function handleAddToCart(product: Product) {
    const newCart = new Map(cart);
    newCart.set(product.id, { product, quantity: 1 });
    setCart(newCart);
  }

  function handleQuantityChange(productId: string, quantity: number) {
    if (quantity <= 0) {
      const newCart = new Map(cart);
      newCart.delete(productId);
      setCart(newCart);
    } else {
      const newCart = new Map(cart);
      const item = newCart.get(productId);
      if (item) {
        newCart.set(productId, { ...item, quantity });
        setCart(newCart);
      }
    }
  }

  async function handleWhatsAppOrder() {
    if (cart.size === 0 || activeOrder) return;
    setReserving(true);
    setOrderError(null);

    try {
      const items = Array.from(cart.values()).map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      const res = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ??
            (res.status === 409
              ? "No hay stock suficiente para completar el pedido"
              : "Error al crear la reserva")
        );
      }

      const data = await res.json();
      setActiveOrder(data.order as ActiveOrder);
      window.open(data.whatsappUrl as string, "_blank");
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setReserving(false);
    }
  }

  async function handleCancelOrder() {
    if (!activeOrder) return;

    try {
      const res = await fetch(`/api/orders/${activeOrder.token}/cancel`, {
        method: "POST",
        credentials: "same-origin",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al cancelar la reserva");
      }

      setActiveOrder(null);
      setCart(new Map());
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Error de conexión");
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 4rem)",
          backgroundColor: "var(--color-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner-neon" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-base)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 10rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.03em",
              marginBottom: "0.25rem",
            }}
          >
            Catálogo
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-text-muted)",
            }}
          >
            Precios de promoción. Stock limitado.
          </p>
        </div>

        {orderError && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.875rem 1rem",
              backgroundColor: "rgba(255, 82, 82, 0.08)",
              border: "1px solid rgba(255, 82, 82, 0.25)",
              borderRadius: "var(--radius-md)",
              color: "#FF5252",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            }}
          >
            {orderError}
          </div>
        )}

        {activeOrder && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem 1.25rem",
              backgroundColor: "rgba(0, 230, 118, 0.06)",
              border: "1px solid rgba(0, 230, 118, 0.2)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--color-neon-green)",
                }}
              >
                Reserva activa
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                Tu carrito está reservado. Quedan{" "}
                <strong>{remainingMinutes} min</strong> para completar el pago.
              </p>
            </div>
            <button
              onClick={handleCancelOrder}
              style={{
                backgroundColor: "transparent",
                color: "var(--color-text-dim)",
                border: "1px solid var(--color-border)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Cancelar reserva
            </button>
          </div>
        )}

        {/* Category tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor:
                  activeCategory === cat.id
                    ? "rgba(0, 230, 118, 0.1)"
                    : "var(--color-surface)",
                border: `1px solid ${
                  activeCategory === cat.id
                    ? "var(--color-neon-green)"
                    : "var(--color-border)"
                }`,
                borderRadius: "var(--radius-md)",
                color:
                  activeCategory === cat.id
                    ? "var(--color-neon-green)"
                    : "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 900,
                color: "rgba(0, 230, 118, 0.08)",
              }}
            >
              {categories.find((c) => c.id === activeCategory)?.icon ?? "?"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--color-text)",
                marginTop: "0.75rem",
              }}
            >
              No hay productos en esta categoría
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                marginTop: "0.375rem",
              }}
            >
              Volvé pronto, siempre estamos sumando ofertas.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredProducts.map((product) => {
              const cartItem = cart.get(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToOrder={handleAddToCart}
                  selected={!!cartItem}
                  quantity={cartItem?.quantity ?? 0}
                  onQuantityChange={(q) => handleQuantityChange(product.id, q)}
                />
              );
            })}
          </div>
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
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-neon-green)",
            padding: "1rem 1.5rem",
            zIndex: 40,
            boxShadow: "0 -4px 24px rgba(0, 230, 118, 0.15)",
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
            <div
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 230, 118, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-neon-green)",
                  flexShrink: 0,
                  fontSize: "1.25rem",
                }}
              >
                🛒
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-dim)",
                    fontWeight: 500,
                  }}
                >
                  {cart.size} producto{cart.size !== 1 ? "s" : ""} ·{" "}
                  {totalItems} unidad{totalItems !== 1 ? "es" : ""}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    color: "var(--color-neon-green)",
                    letterSpacing: "-0.02em",
                    textShadow: "0 0 12px rgba(0, 230, 118, 0.4)",
                  }}
                >
                  {formatPrice(totalPrice)}
                </p>
              </div>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              disabled={reserving || activeOrder !== null}
              className="btn-neon-green"
              style={{
                flexShrink: 0,
                opacity: reserving || activeOrder !== null ? 0.6 : 1,
                cursor:
                  reserving || activeOrder !== null ? "not-allowed" : "pointer",
              }}
            >
              <IconWhatsApp />
              {reserving
                ? "Reservando..."
                : activeOrder
                ? "Reserva activa"
                : "Pedir por WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "calc(100vh - 4rem)",
            backgroundColor: "var(--color-base)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner-neon" />
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
