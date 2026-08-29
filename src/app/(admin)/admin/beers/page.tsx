"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Beer } from "@/types";

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function AdminBeersPage() {
  const router = useRouter();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [stockInLiters, setStockInLiters] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBeers();
  }, []);

  async function fetchBeers() {
    try {
      const res = await fetch("/api/beers");
      if (res.ok) {
        const data = await res.json();
        setBeers(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingBeer(null);
    setName("");
    setDescription("");
    setPricePerLiter("");
    setStockInLiters("");
    setImageUrl("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(beer: Beer) {
    setEditingBeer(beer);
    setName(beer.name);
    setDescription(beer.description || "");
    setPricePerLiter(beer.pricePerLiter.toString());
    setStockInLiters(beer.stockInLiters.toString());
    setImageUrl(beer.imageUrl || "");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      name,
      description: description || undefined,
      pricePerLiter: parseFloat(pricePerLiter),
      stockInLiters: parseFloat(stockInLiters),
      imageUrl: imageUrl || undefined,
    };

    try {
      const url = editingBeer ? `/api/beers/${editingBeer.id}` : "/api/beers";
      const method = editingBeer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      setShowForm(false);
      fetchBeers();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Desactivar esta cerveza?")) return;
    try {
      await fetch(`/api/beers/${id}`, { method: "DELETE" });
      fetchBeers();
    } catch {
      // ignore
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
              Gestionar Cervezas
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={openCreateForm}
              className="btn-craft-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              + Nueva Cerveza
            </button>
            <a
              href="/admin/orders"
              style={{
                backgroundColor: "white",
                border: "1px solid rgba(26, 22, 18, 0.12)",
                color: "var(--color-toast)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                padding: "0.5625rem 0.875rem",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Pedidos
            </a>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(26, 22, 18, 0.5)",
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
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                width: "100%",
                maxWidth: "28rem",
                boxShadow: "0 20px 60px rgba(26, 22, 18, 0.25)",
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
                    color: "var(--color-toast)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {editingBeer ? "Editar Cerveza" : "Nueva Cerveza"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-toast-muted)",
                    padding: "0.25rem",
                    borderRadius: "6px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-toast)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-toast-muted)";
                  }}
                >
                  <IconX />
                </button>
              </div>

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

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-toast)", marginBottom: "0.375rem" }}>
                    Nombre *
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-craft" style={{ paddingLeft: "0.875rem" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-toast)", marginBottom: "0.375rem" }}>
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="input-craft"
                    style={{ paddingLeft: "0.875rem", resize: "vertical" }}
                    placeholder="Estilo, características, amargor, etc."
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-toast)", marginBottom: "0.375rem" }}>
                      Precio/L ($)
                    </label>
                    <input type="number" step="0.01" min="0.01" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} required className="input-craft" style={{ paddingLeft: "0.875rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-toast)", marginBottom: "0.375rem" }}>
                      Stock (L)
                    </label>
                    <input type="number" step="0.5" min="0" value={stockInLiters} onChange={(e) => setStockInLiters(e.target.value)} required className="input-craft" style={{ paddingLeft: "0.875rem" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-toast)", marginBottom: "0.375rem" }}>
                    URL imagen <span style={{ fontWeight: 400, color: "var(--color-toast-muted)" }}>(opcional)</span>
                  </label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-craft" style={{ paddingLeft: "0.875rem" }} placeholder="https://..." />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
                  <button type="submit" disabled={saving} className="btn-craft-primary" style={{ flex: 1, justifyContent: "center" }}>
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1,
                      padding: "0.625rem",
                      backgroundColor: "var(--color-cream-dark)",
                      color: "var(--color-toast)",
                      border: "1px solid rgba(26, 22, 18, 0.1)",
                      borderRadius: "8px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(26, 22, 18, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner-craft" style={{ margin: "0 auto" }} />
          </div>
        ) : beers.length === 0 ? (
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
                fontSize: "1.375rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginTop: "1rem",
              }}
            >
              Sin cervezas registradas
            </h2>
            <button
              onClick={openCreateForm}
              className="btn-craft-primary"
              style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              + Agregar primera cerveza
            </button>
          </div>
        ) : (
          /* Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {beers.map((beer) => (
              <div
                key={beer.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(26, 22, 18, 0.06)",
                  border: "1px solid rgba(196, 127, 23, 0.06)",
                  opacity: beer.isActive ? 1 : 0.55,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: "120px",
                    background: "linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-cream) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {beer.imageUrl ? (
                    <img src={beer.imageUrl} alt={beer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "3rem",
                        fontWeight: 900,
                        color: "rgba(196, 127, 23, 0.15)",
                      }}
                    >
                      B
                    </span>
                  )}
                  {!beer.isActive && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        backgroundColor: "#EF4444",
                        color: "white",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "9999px",
                      }}
                    >
                      Inactivo
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--color-toast)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {beer.name}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--color-amber-deep)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    ${Number(beer.pricePerLiter).toFixed(2)}
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 400, color: "var(--color-toast-muted)", marginLeft: "0.25rem" }}>
                      /L
                    </span>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.8125rem",
                      color: "var(--color-toast-muted)",
                    }}
                  >
                    Stock: {beer.stockInLiters}L
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem" }}>
                    <button
                      onClick={() => openEditForm(beer)}
                      style={{
                        flex: 1,
                        padding: "0.4375rem",
                        backgroundColor: "var(--color-cream-dark)",
                        border: "none",
                        borderRadius: "6px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--color-toast)",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(26, 22, 18, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(beer.id)}
                      style={{
                        flex: 1,
                        padding: "0.4375rem",
                        backgroundColor: "#FEF2F2",
                        border: "none",
                        borderRadius: "6px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#991B1B",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FEE2E2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FEF2F2";
                      }}
                    >
                      {beer.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
