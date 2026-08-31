"use client";

/**
 * THESIS: drinkr es un marketplace de ahorro en bebidas. El usuario siente que encontró algo bueno, que el precio vale la pena.
 * OWN-WORLD: Base #0D0D0D + Neon green #00E676 + Neon orange #FF6D00. Syne display + DM Sans UI. Deal hunter aesthetic.
 * STORY: El usuario descubre que drinkr tiene las mismas bebidas más barato. Navega, encuentra lo que quiere, pide por WhatsApp.
 * FIRST VIEWPORT: Dark hero, headline "Ahorrá en tus bebidas favoritas", savings ticker, category pills.
 * FORM: Neon Discount / Deal Hunter — energia de cazador de ofertas
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */

import Link from "next/link";

// ─── Icons ─────────────────────────────────────────────────────────────────

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-base)",
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(var(--color-neon-green) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-neon-green) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0, 230, 118, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.3rem 0.75rem",
            background: "rgba(0, 230, 118, 0.1)",
            border: "1px solid rgba(0, 230, 118, 0.2)",
            borderRadius: "var(--radius-full)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--color-neon-green)",
              boxShadow: "0 0 6px var(--color-neon-green)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-neon-green)",
            }}
          >
            Ofertas en bebidas
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 5.5rem)",
            fontWeight: 900,
            color: "var(--color-text)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            maxWidth: "12ch",
            marginBottom: "1.5rem",
          }}
        >
          Ahorrá en{" "}
          <span
            style={{
              color: "var(--color-neon-green)",
              textShadow: "0 0 40px rgba(0, 230, 118, 0.5)",
            }}
          >
            tus bebidas
          </span>{" "}
          favoritas
        </h1>

        {/* Subline */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
            color: "var(--color-text-muted)",
            maxWidth: "44ch",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}
        >
          Las mismas marcas que en el supermercado, pero a precio de promoción.
          Sin intermediarios. Sin trámites.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <Link
            href="#categorias"
            className="btn-neon-green"
          >
            Ver productos
            <IconArrowRight />
          </Link>
        </div>

        {/* Trust strip */}
        <div
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "Sin registro", label: "Pedí por WhatsApp" },
            { value: "Precios promo", label: "Que no encontrás en otro lado" },
            { value: "Stock real", label: "Actualizado al momento" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  color: "var(--color-text-dim)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: "0.125rem",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories ─────────────────────────────────────────────────────────────

function CategoriesSection() {
  const categories = [
    { id: "cerveza", name: "Cerveza", emoji: "🍺", href: "/menu?cat=cerveza" },
    { id: "gaseosa", name: "Gaseosa", emoji: "🥤", href: "/menu?cat=gaseosa" },
  ];

  return (
    <section
      id="categorias"
      style={{
        padding: "4rem 0",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-text-dim)",
              marginBottom: "0.5rem",
            }}
          >
            Categorías
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.025em",
            }}
          >
            ¿Qué andas buscando?
          </h2>
        </div>

        {/* Category cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {categories.map(({ id, name, emoji, href }) => (
            <Link
              key={id}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                backgroundColor: "var(--color-surface-raised)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-neon-green)";
                e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor = "var(--color-surface-raised)";
              }}
            >
              <span style={{ fontSize: "2rem" }}>{emoji}</span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-dim)",
                    marginTop: "0.125rem",
                  }}
                >
                  Ver ofertas
                </p>
              </div>
              <span style={{ marginLeft: "auto", color: "var(--color-text-dim)" }}>
                <IconChevronRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Recorre el catálogo",
      desc: "Entrá, elegí la categoría, buscá lo que necesites.",
    },
    {
      num: "02",
      title: "Elegí tus productos",
      desc: "Agregá al carrito la cantidad que quieras. Verás el ahorro siempre.",
    },
    {
      num: "03",
      title: "Pedí por WhatsApp",
      desc: "Tocás 'Pedir' y se abre WhatsApp con tu pedido listo.",
    },
  ];

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--color-base)" }}>
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-text-dim)",
              marginBottom: "0.5rem",
            }}
          >
            Así funciona
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.025em",
            }}
          >
            Tres pasos, cero dramas.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {steps.map(({ num, title, desc }) => (
            <div key={num}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "rgba(0, 230, 118, 0.12)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: "0.75rem",
                }}
              >
                {num}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ─────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section
      style={{
        padding: "4rem 0",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "36ch" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            ¿Ves algo que te sirve?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
            }}
          >
            No te quedes con el precio lleno. Mándanos un pedido y lo tienes.
          </p>
        </div>
        <Link
          href="#categorias"
          className="btn-neon-orange"
          style={{ flexShrink: 0 }}
        >
          <IconWhatsApp />
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-base)",
        borderTop: "1px solid var(--color-border)",
        padding: "2.5rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 900,
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            drinkr
            <span style={{ color: "var(--color-neon-green)" }}>.</span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--color-text-dim)",
              marginTop: "0.25rem",
            }}
          >
            Ahorrá en tus bebidas favoritas.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["#categorias"].map((href) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                color: "var(--color-text-dim)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-dim)";
              }}
            >
              Categorías
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ minHeight: "calc(100vh - 4rem)" }}>
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
