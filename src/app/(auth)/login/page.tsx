"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function IconBeer() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 11h1a3 3 0 0 1 0 6h-1"/>
      <path d="M9 12v6"/>
      <path d="M13 12v6"/>
      <path d="M5 7.2A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.2v9.8A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.8V7.2Z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      if (data.user.role === "ADMIN") {
        router.push("/admin/products");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "26rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "var(--color-neon-green)",
            }}
          >
            <IconBeer />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.875rem",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.025em",
              marginBottom: "0.375rem",
            }}
          >
            drinkr
            <span style={{ color: "var(--color-neon-green)" }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-text-muted)",
            }}
          >
            Acceso para administradores
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#F87171",
                  padding: "0.75rem 0.875rem",
                  borderRadius: "8px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: "0.375rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="input-dark"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: "0.375rem",
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
                className="input-dark"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon-green"
              style={{ marginTop: "0.25rem", width: "100%", justifyContent: "center" }}
            >
              {loading ? (
                <>
                  <div className="spinner-neon" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>

        {/* Back to catalog */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            color: "var(--color-text-dim)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          <a
            href="/menu"
            style={{
              color: "var(--color-neon-green)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Ver catálogo →
          </a>
        </p>
      </div>
    </div>
  );
}
