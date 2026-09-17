"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product as BaseProduct, Category } from "@/types";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

type AdminProduct = BaseProduct & { reserved?: number };

interface PendingOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface PendingOrder {
  id: string;
  token: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  items: PendingOrderItem[];
  total: number;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/admin/products", {
          credentials: "same-origin",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (!res.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        const data = await res.json();
        setProducts(data.products ?? []);
        setCategories(data.categories ?? MOCK_CATEGORIES);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [router]);

  useEffect(() => {
    async function loadPendingOrders() {
      setPendingLoading(true);
      setPendingError(null);

      try {
        const res = await fetch("/api/admin/orders", {
          credentials: "same-origin",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (!res.ok) {
          throw new Error("No se pudieron cargar los pedidos pendientes");
        }

        const data = await res.json();
        setPendingOrders(data.orders ?? []);
      } catch (err) {
        setPendingError(
          err instanceof Error ? err.message : "Error de conexión"
        );
      } finally {
        setPendingLoading(false);
      }
    }

    loadPendingOrders();
  }, [router, refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const startEdit = useCallback((product: AdminProduct) => {
    setEditingId(product.id);
    setEditStock(product.stock);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditStock(0);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${editingId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ stock: editStock }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al actualizar el stock");
      }

      const data = await res.json();
      const updatedProduct = data.product as AdminProduct;

      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? updatedProduct : p))
      );
      setEditingId(null);
      setEditStock(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setSaving(false);
    }
  }, [editingId, editStock, router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleConfirmOrder(order: PendingOrder) {
    setProcessingOrderId(order.id);

    try {
      const res = await fetch(`/api/orders/${order.token}/complete`, {
        method: "PATCH",
        credentials: "same-origin",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al confirmar el pedido");
      }

      setRefreshKey((k) => k + 1);
    } catch (err) {
      setPendingError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setProcessingOrderId(null);
    }
  }

  async function handleCancelOrder(order: PendingOrder) {
    setProcessingOrderId(order.id);

    try {
      const res = await fetch(`/api/orders/${order.token}/cancel`, {
        method: "POST",
        credentials: "same-origin",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al cancelar el pedido");
      }

      setRefreshKey((k) => k + 1);
    } catch (err) {
      setPendingError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setProcessingOrderId(null);
    }
  }

  function getCategoryName(id: string) {
    return categories.find((c) => c.id === id)?.name ?? id;
  }

  function getRemainingMinutes(expiresAt: string): number {
    const diff = new Date(expiresAt).getTime() - now;
    return Math.max(0, Math.ceil(diff / 60_000));
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
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "var(--color-text)",
                letterSpacing: "-0.025em",
              }}
            >
              Administración
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--color-text-dim)",
                marginTop: "0.25rem",
              }}
            >
              Actualizá el stock después de cada pedido
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "var(--color-text-dim)",
              border: "1px solid var(--color-border)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.375rem 0.875rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            Salir
          </button>
        </div>

        {error && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              color: "#FF5252",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.categoryId === cat.id);
            const totalStock = catProducts.reduce((s, p) => s + p.stock, 0);
            return (
              <div
                key={cat.id}
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-dim)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {cat.icon} {cat.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "var(--color-text)",
                  }}
                >
                  {totalStock}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-dim)",
                  }}
                >
                  {catProducts.length} productos
                </p>
              </div>
            );
          })}
        </div>

        {/* Product table */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-text)",
              }}
            >
              Stock de productos
            </h2>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--color-surface-raised)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {[
                  "Producto",
                  "Categoría",
                  "Precio promo",
                  "Stock",
                  "Reservado",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.625rem 1.5rem",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-dim)",
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th
                  style={{
                    padding: "0.625rem 1.5rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-dim)",
                    textAlign: "right",
                  }}
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom:
                      i < products.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                    backgroundColor:
                      editingId === product.id
                        ? "rgba(0, 230, 118, 0.04)"
                        : "transparent",
                  }}
                >
                  <td style={{ padding: "0.875rem 1.5rem" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--color-text)",
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        color: "var(--color-text-dim)",
                      }}
                    >
                      {product.presentation}
                    </p>
                  </td>
                  <td style={{ padding: "0.875rem 1.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        backgroundColor: "var(--color-surface-raised)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--color-neon-green)",
                      }}
                    >
                      {formatPrice(product.promoPrice)}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1.5rem" }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        min={0}
                        value={editStock}
                        onChange={(e) =>
                          setEditStock(parseInt(e.target.value) || 0)
                        }
                        className="input-dark"
                        style={{ width: "80px" }}
                        autoFocus
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.9375rem",
                          fontWeight: 700,
                          color:
                            product.stock === 0
                              ? "#FF5252"
                              : product.stock <= 3
                              ? "#FFAB40"
                              : "var(--color-text)",
                        }}
                      >
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.875rem 1.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color:
                          (product.reserved ?? 0) === 0
                            ? "var(--color-text-dim)"
                            : "#FFAB40",
                      }}
                    >
                      {product.reserved ?? 0}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.875rem 1.5rem",
                      textAlign: "right",
                    }}
                  >
                    {editingId === product.id ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          style={{
                            backgroundColor: "var(--color-neon-green)",
                            color: "var(--color-base)",
                            border: "none",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.3rem 0.75rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {saving ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            backgroundColor: "transparent",
                            color: "var(--color-text-dim)",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            padding: "0.3rem 0.75rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        style={{
                          backgroundColor: "transparent",
                          color: "var(--color-neon-orange)",
                          border: "1px solid var(--color-neon-orange)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.3rem 0.75rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        Editar stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending orders */}
        <div
          style={{
            marginTop: "2.5rem",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-text)",
              }}
            >
              Pedidos pendientes
            </h2>
          </div>

          {pendingLoading ? (
            <div
              style={{
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="spinner-neon" />
            </div>
          ) : pendingError ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "#FF5252",
                padding: "1rem 1.5rem",
              }}
            >
              {pendingError}
            </p>
          ) : pendingOrders.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--color-text-dim)",
                padding: "1.5rem",
              }}
            >
              No hay pedidos pendientes.
            </p>
          ) : (
            <div style={{ padding: "1rem 1.5rem" }}>
              {pendingOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    padding: "1rem 0",
                    borderBottom:
                      index < pendingOrders.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.9375rem",
                          fontWeight: 800,
                          color: "var(--color-text)",
                        }}
                      >
                        Pedido{" "}
                        <span
                          style={{ color: "var(--color-text-dim)" }}
                        >
                          #{order.token.slice(0, 8)}
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          color: "var(--color-text-dim)",
                          marginTop: "0.25rem",
                        }}
                      >
                        Quedan{" "}
                        <strong style={{ color: "var(--color-neon-orange)" }}>
                          {getRemainingMinutes(order.expiresAt)} min
                        </strong>{" "}
                        · Total:{" "}
                        <strong style={{ color: "var(--color-neon-green)" }}>
                          {formatPrice(order.total)}
                        </strong>
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => handleConfirmOrder(order)}
                        disabled={processingOrderId === order.id}
                        className="btn-neon-green"
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.4rem 0.75rem",
                        }}
                      >
                        {processingOrderId === order.id
                          ? "Procesando..."
                          : "Confirmar venta"}
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order)}
                        disabled={processingOrderId === order.id}
                        style={{
                          backgroundColor: "transparent",
                          color: "var(--color-text-dim)",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "0.4rem 0.75rem",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        Cancelar pedido
                      </button>
                    </div>
                  </div>

                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.375rem",
                    }}
                  >
                    {order.items.map((item) => (
                      <li
                        key={item.productId}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          color: "var(--color-text-muted)",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {item.name}{" "}
                          <span style={{ color: "var(--color-text-dim)" }}>
                            x{item.quantity}
                          </span>
                        </span>
                        <span>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to store */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "var(--color-text-dim)",
              textDecoration: "none",
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
