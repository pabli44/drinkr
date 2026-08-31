"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "var(--color-base)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "4rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              fontWeight: 900,
              color: "var(--color-text)",
              letterSpacing: "-0.03em",
            }}
          >
            drinkr
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--color-neon-green)",
              letterSpacing: "0.02em",
            }}
          >
            .
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/menu"
          style={{
            backgroundColor: "var(--color-neon-green)",
            color: "var(--color-base)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            textDecoration: "none",
            padding: "0.4375rem 1rem",
            borderRadius: "6px",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            boxShadow: "0 0 12px rgba(0, 230, 118, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-neon-green-dim)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-neon-green)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 230, 118, 0.3)";
          }}
        >
          Ver ofertas
        </Link>
      </div>
    </nav>
  );
}
