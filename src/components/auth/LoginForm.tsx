"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
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
        router.push("/admin/products");
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
  );
}
