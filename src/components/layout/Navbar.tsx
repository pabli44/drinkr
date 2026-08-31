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
      </div>
    </nav>
  );
}
