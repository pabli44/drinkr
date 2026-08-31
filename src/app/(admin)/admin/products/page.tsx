"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, Category } from "@/types";

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
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

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
  { id: "cerveza", name: "Cerveza", icon: "🍺", order: 0, isActive: true },
  { id: "gaseosa", name: "Gaseosa", icon: "🥤", order: 1, isActive: true },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1", name: "Poker Six-Pack 330ml", categoryId: "cerveza", presentation: "SIXPACK",
    regularPrice: 22000, promoPrice: 17500, stock: 8, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "2", name: "Corona Six-Pack 355ml", categoryId: "cerveza", presentation: "SIXPACK",
    regularPrice: 32000, promoPrice: 25900, stock: 5, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "3", name: "BBC Stout 330ml", categoryId: "cerveza", presentation: "BOTTLE",
    regularPrice: 8500, promoPrice: 6200, stock: 12, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "4", name: "Club Colombia Six-Pack", categoryId: "cerveza", presentation: "SIXPACK",
    regularPrice: 28000, promoPrice: 22500, stock: 3, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "5", name: "Coca-Cola Six-Pack 355ml", categoryId: "gaseosa", presentation: "SIXPACK",
    regularPrice: 18000, promoPrice: 14200, stock: 15, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "6", name: "Pepsi 1.5L", categoryId: "gaseosa", presentation: "BOTTLE",
    regularPrice: 7500, promoPrice: 5500, stock: 20, isActive: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

const PRESENTATIONS = ["SIXPACK", "BOTTLE", "CAN", "SINGLE"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("cerveza");
  const [presentation, setPresentation] = useState<"SIXPACK" | "BOTTLE" | "CAN" | "SINGLE">("SIXPACK");
  const [regularPrice, setRegularPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function openCreateForm() {
    setEditingProduct(null);
    setName("");
    setCategoryId("cerveza");
    setPresentation("SIXPACK");
    setRegularPrice("");
    setPromoPrice("");
    setStock("");
    setImageUrl("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(product.categoryId);
    setPresentation(product.presentation);
    setRegularPrice(product.regularPrice.toString());
    setPromoPrice(product.promoPrice.toString());
    setStock(product.stock.toString());
    setImageUrl(product.imageUrl || "");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name,
                  categoryId,
                  presentation,
                  regularPrice: parseFloat(regularPrice),
                  promoPrice: parseFloat(promoPrice),
                  stock: parseInt(stock),
                  imageUrl: imageUrl || null,
                }
              : p
          )
        );
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name,
          categoryId,
          presentation,
          regularPrice: parseFloat(regularPrice),
          promoPrice: parseFloat(promoPrice),
          stock: parseInt(stock),
          imageUrl: imageUrl || null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProducts((prev) => [...prev, newProduct]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  function toggleActive(productId: string) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p
      )
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-base)", padding: "2.5rem 0" }}>
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
                color: "var(--color-text-dim)",
                marginBottom: "0.375rem",
              }}
            >
              Admin
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                letterSpacing: "-0.025em",
              }}
            >
              Productos
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              href="/admin/categories"
              className="btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
            >
              Categorías
            </Link>
            <button
              onClick={openCreateForm}
              className="btn-neon-green"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <IconPlus />
              Nuevo producto
            </button>
          </div>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
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
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              Sin productos todavía
            </p>
            <button
              onClick={openCreateForm}
              className="btn-neon-green"
              style={{ marginTop: "1rem", display: "inline-flex" }}
            >
              <IconPlus />
              Agregar primer producto
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {products.map((product) => {
              const category = categories.find((c) => c.id === product.categoryId);
              const savings = product.regularPrice > 0
                ? Math.round(((product.regularPrice - product.promoPrice) / product.regularPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: `1px solid ${product.isActive ? "var(--color-border)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    opacity: product.isActive ? 1 : 0.5,
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: "100px",
                      background: "linear-gradient(135deg, var(--color-surface-raised), var(--color-surface))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2.5rem",
                          fontWeight: 900,
                          color: "rgba(0, 230, 118, 0.06)",
                        }}
                      >
                        {product.name.charAt(0)}
                      </span>
                    )}
                    {savings > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          left: "0.5rem",
                          backgroundColor: "var(--color-neon-green)",
                          color: "var(--color-base)",
                          fontSize: "0.625rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.4rem",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        -{savings}%
                      </div>
                    )}
                    {!product.isActive && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(13,13,13,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          Inactivo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1rem" }}>
                    <p style={{ fontSize: "0.6875rem", color: "var(--color-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                      {category?.icon} {category?.name} · {product.presentation}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", marginBottom: "0.75rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.0625rem",
                          fontWeight: 800,
                          color: "var(--color-neon-green)",
                        }}
                      >
                        {formatPrice(product.promoPrice)}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", textDecoration: "line-through" }}>
                        {formatPrice(product.regularPrice)}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", marginBottom: "0.875rem" }}>
                      Stock: {product.stock}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => openEditForm(product)}
                        className="btn-ghost"
                        style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem", padding: "0.4375rem" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActive(product.id)}
                        style={{
                          flex: 1,
                          padding: "0.4375rem",
                          backgroundColor: product.isActive ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 230, 118, 0.1)",
                          border: "none",
                          borderRadius: "var(--radius-sm)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: product.isActive ? "#F87171" : "var(--color-neon-green)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {product.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "28rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {editingProduct ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-dim)",
                  padding: "0.25rem",
                }}
              >
                <IconX />
              </button>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#F87171",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-dark"
                  placeholder="Ej: Poker Six-Pack 330ml"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                    Categoría *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input-dark"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                    Presentación *
                  </label>
                  <select
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value as typeof presentation)}
                    className="input-dark"
                  >
                    {PRESENTATIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                    Precio regular ($) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    required
                    className="input-dark"
                    placeholder="22000"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                    Precio promo ($) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    required
                    className="input-dark"
                    placeholder="17500"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                  Stock (unidades) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="input-dark"
                  placeholder="10"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.375rem" }}>
                  URL imagen <span style={{ fontWeight: 400, color: "var(--color-text-dim)" }}>(opcional)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-dark"
                  placeholder="https://..."
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
                <button type="submit" disabled={saving} className="btn-neon-green" style={{ flex: 1, justifyContent: "center" }}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
