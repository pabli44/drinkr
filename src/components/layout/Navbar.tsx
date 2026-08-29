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
        backgroundColor: "var(--color-toast)",
        borderBottom: "1px solid rgba(196, 127, 23, 0.2)",
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
            alignItems: "baseline",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "var(--color-cream)",
              letterSpacing: "-0.02em",
            }}
          >
            Beer Drop
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-copper)",
            }}
          >
            Craft Beer
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    style={{
                      color: "rgba(255, 248, 231, 0.7)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "6px",
                      transition: "color 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-cream)";
                      e.currentTarget.style.backgroundColor = "rgba(255,248,231,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 248, 231, 0.7)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Mis Pedidos
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/orders"
                      style={{
                        color: "var(--color-copper)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid var(--color-copper)",
                        transition: "background-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--color-copper)";
                        e.currentTarget.style.color = "var(--color-toast)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--color-copper)";
                      }}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "transparent",
                      color: "rgba(255, 248, 231, 0.55)",
                      border: "1px solid rgba(255, 248, 231, 0.15)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      padding: "0.375rem 0.875rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-cream)";
                      e.currentTarget.style.borderColor = "rgba(255, 248, 231, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 248, 231, 0.55)";
                      e.currentTarget.style.borderColor = "rgba(255, 248, 231, 0.15)";
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
                      color: "rgba(255, 248, 231, 0.7)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "6px",
                      transition: "color 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-cream)";
                      e.currentTarget.style.backgroundColor = "rgba(255,248,231,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 248, 231, 0.7)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    style={{
                      backgroundColor: "var(--color-amber-deep)",
                      color: "white",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: "0.4375rem 1rem",
                      borderRadius: "6px",
                      transition: "background-color 0.2s, transform 0.15s",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-amber-dark)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-amber-deep)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Registrarse
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
