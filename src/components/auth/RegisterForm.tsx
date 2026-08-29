"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
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
          Nombre completo *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Tu nombre"
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
          Email *
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
          Contraseña *
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
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
          Teléfono <span style={{ fontWeight: 400, color: "var(--color-toast-muted)" }}>(opcional)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+54 11 1234 5678"
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
          Dirección <span style={{ fontWeight: 400, color: "var(--color-toast-muted)" }}>(opcional)</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Tu dirección para retirar"
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
            Creando cuenta...
          </>
        ) : (
          "Crear Cuenta"
        )}
      </button>
    </form>
  );
}
