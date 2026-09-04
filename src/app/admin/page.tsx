"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/types";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const startEdit = useCallback((product: Product) => {
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
      const updatedProduct = data.product as Product;

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

  function getCategoryName(id: string) {
    return categories.find((c) => c.id === id)?.name ?? id;
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
                {["Producto", "Categoría", "Precio promo", "Stock"].map((h) => (
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

        {/* Back to store */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "var(--color-text-dim)",
              textDecoration: "none",
            }}
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
