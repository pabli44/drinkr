"use client";

import Link from "next/link";

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "var(--color-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "24rem" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "4rem",
            fontWeight: 900,
            color: "rgba(0, 230, 118, 0.08)",
            marginBottom: "1rem",
          }}
        >
          📦
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.025em",
            marginBottom: "0.75rem",
          }}
        >
          Tus pedidos
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.9375rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}
        >
          Los pedidos se hacen directamente por WhatsApp desde el catálogo.
          No necesitas una cuenta para comprar.
        </p>
        <Link href="/menu" className="btn-neon-green" style={{ display: "inline-flex" }}>
          Ver catálogo
          <IconArrowRight />
        </Link>
      </div>
    </div>
  );
}
