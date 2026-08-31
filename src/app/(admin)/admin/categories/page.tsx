"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/types";

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

const MOCK_CATEGORIES: Category[] = [
  { id: "cerveza", name: "Cerveza", icon: "🍺", order: 0, isActive: true },
  { id: "gaseosa", name: "Gaseosa", icon: "🥤", order: 1, isActive: true },
];

const EMOJI_OPTIONS = ["🍺", "🥤", "🥃", "🍷", "🍹", "🧃", "☕", "🍵", "🥛", "🧋"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍺");
  const [saving, setSaving] = useState(false);

  function openCreateForm() {
    setEditingCategory(null);
    setName("");
    setIcon("🍺");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon || "🍺");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, name, icon } : c
          )
        );
      } else {
        const newCategory: Category = {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          icon,
          order: categories.length,
          isActive: true,
        };
        setCategories((prev) => [...prev, newCategory]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-base)", padding: "2.5rem 0" }}>
      <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "0 1.5rem" }}>
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
              Categorías
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              href="/admin/products"
              className="btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
            >
              Productos
            </Link>
            <button
              onClick={openCreateForm}
              className="btn-neon-green"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <IconPlus />
              Nueva categoría
            </button>
          </div>
        </div>

        {/* Category list */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {categories.map((category, i) => (
            <div
              key={category.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderTop: i > 0 ? "1px solid var(--color-border)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{category.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--color-text)",
                    }}
                  >
                    {category.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {category.id}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!category.isActive && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--color-text-dim)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "0.25rem 0.5rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    Inactiva
                  </span>
                )}
                <button
                  onClick={() => openEditForm(category)}
                  className="btn-ghost"
                  style={{ fontSize: "0.8125rem", padding: "0.375rem 0.75rem" }}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
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
              maxWidth: "24rem",
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
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {editingCategory ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-dim)" }}>
                <IconX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                  placeholder="Ej: Cerveza"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.5rem" }}>
                  Ícono
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "1.25rem",
                        backgroundColor: icon === e ? "rgba(0, 230, 118, 0.15)" : "var(--color-surface-raised)",
                        border: `1.5px solid ${icon === e ? "var(--color-neon-green)" : "var(--color-border)"}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
                <button type="submit" disabled={saving} className="btn-neon-green" style={{ flex: 1, justifyContent: "center" }}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
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
