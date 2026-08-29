"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
}

function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export function LoginForm({ onSuccess }: LoginFormProps) {
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
        router.push("/admin/orders");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
      onSuccess?.();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && (
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
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
            color: "var(--color-toast)",
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
          className="input-craft"
          style={{ paddingLeft: "0.875rem" }}
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-toast)",
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
          className="input-craft"
          style={{ paddingLeft: "0.875rem" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-craft-primary"
        style={{ marginTop: "0.25rem", width: "100%", justifyContent: "center" }}
      >
        {loading ? (
          <>
            <div className="spinner-craft" style={{ width: "16px", height: "16px" }} />
            Ingresando...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>
    </form>
  );
}
