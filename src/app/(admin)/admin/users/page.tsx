"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && !cancelled) {
          const orders = await res.json();
          const uniqueUsers = new Map<string, User>();
          orders.forEach((order: { user?: User }) => {
            if (order.user) {
              uniqueUsers.set(order.user.id, order.user);
            }
          });
          setUsers(Array.from(uniqueUsers.values()));
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", backgroundColor: "var(--color-cream)", padding: "3rem 0" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-copper)",
                marginBottom: "0.5rem",
              }}
            >
              Panel de control
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "var(--color-toast)",
                letterSpacing: "-0.025em",
              }}
            >
              Usuarios
            </h1>
          </div>
          <a
            href="/admin/orders"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(26, 22, 18, 0.12)",
              color: "var(--color-toast)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.5rem 0.875rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-cream-dark)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            Pedidos
          </a>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner-craft" style={{ margin: "0 auto" }} />
          </div>
        ) : users.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "12px",
              border: "1px solid rgba(196, 127, 23, 0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                fontWeight: 900,
                color: "rgba(196, 127, 23, 0.12)",
              }}
            >
              —
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 600,
                color: "var(--color-toast)",
                marginTop: "1rem",
              }}
            >
              Sin usuarios aún
            </h2>
          </div>
        ) : (
          /* Table */
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(26, 22, 18, 0.06)",
              border: "1px solid rgba(196, 127, 23, 0.06)",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-cream-dark)" }}>
                  {["Nombre", "Email", "Rol", "Teléfono", "Dirección"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-toast-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{
                      borderTop: i > 0 ? "1px solid rgba(26, 22, 18, 0.05)" : undefined,
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--color-toast)",
                        }}
                      >
                        {user.name}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          color: "var(--color-toast-muted)",
                        }}
                      >
                        {user.email}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.2rem 0.625rem",
                          borderRadius: "9999px",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          backgroundColor:
                            user.role === "ADMIN" ? "var(--color-toast)" : "var(--color-cream-dark)",
                          color:
                            user.role === "ADMIN" ? "var(--color-cream)" : "var(--color-toast-muted)",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          color: user.phone ? "var(--color-toast)" : "var(--color-toast-muted)",
                        }}
                      >
                        {user.phone || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                          color: user.address ? "var(--color-toast)" : "var(--color-toast-muted)",
                        }}
                      >
                        {user.address || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
