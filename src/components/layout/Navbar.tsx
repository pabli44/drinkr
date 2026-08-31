"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="));
      if (cookie) {
        const token = cookie.split("=")[1];
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.userId,
          role: payload.role,
          name: "",
          email: "",
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then(() => fetchCurrentUser())
      .catch(() => setLoading(false));
  }, [fetchCurrentUser]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

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

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "6px",
                      transition: "color 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-text)";
                      e.currentTarget.style.backgroundColor = "var(--color-surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Mis Pedidos
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/products"
                      style={{
                        color: "var(--color-neon-orange)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid var(--color-neon-orange)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-neon-orange)";
                        e.currentTarget.style.color = "var(--color-base)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--color-neon-orange)";
                      }}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-text-dim)",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      padding: "0.375rem 0.875rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-text)";
                      e.currentTarget.style.borderColor = "var(--color-border-bright)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-dim)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "6px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/login"
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
                    Admin
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
