import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

function IconBeer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 11h1a3 3 0 0 1 0 6h-1"/>
      <path d="M9 12v6"/>
      <path d="M13 12v6"/>
      <path d="M5 7.2A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.2v9.8A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.8V7.2Z"/>
    </svg>
  );
}

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "26rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "var(--color-toast)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "var(--color-amber-light)",
            }}
          >
            <IconBeer />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "var(--color-toast)",
              letterSpacing: "-0.025em",
              marginBottom: "0.375rem",
            }}
          >
            Crear Cuenta
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-toast-muted)",
            }}
          >
            Hacé tu primer pedido en segundos
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 2px 12px rgba(26, 22, 18, 0.08), 0 1px 3px rgba(26, 22, 18, 0.04)",
            border: "1px solid rgba(196, 127, 23, 0.08)",
          }}
        >
          <RegisterForm />
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            color: "var(--color-toast-muted)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--color-amber-deep)",
              fontWeight: 600,
              textDecoration: "none",
              textUnderlineOffset: "3px",
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
