"use client";

/**
 * THESIS: Cerveza artesanal premium, directa de la cervecería. Sin intermediarios, sin desperdicio.
 * OWN-WORLD: Cream #FFF8E7 + Toast #1A1612 + Amber Deep #C47F17 + Copper #B87333. Editorial grid.
 * STORY: El usuario descubre cerveza artesanal real, entiende el modelo, y actúa.
 * FIRST VIEWPORT: Dark toast hero, display heading "Beer Drop", subline, two CTAs. Above the fold.
 * FORM: Liquid Gold / Editorial Cervecero — seed 4f3fcaac, assigned index 5
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */

import Link from "next/link";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconFlask() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v5.5l4 7.5H5l4-7.5V3z"/>
      <path d="M9 3h6"/>
      <path d="M6 16h12"/>
    </svg>
  );
}

function IconDrop() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  );
}

function IconHandOver() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// ─── Section: Hero ───────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-toast)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Amber accent line top */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, var(--color-amber-deep), var(--color-copper), var(--color-amber-deep))",
        }}
      />

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "6rem 1.5rem 5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-copper)",
            marginBottom: "1.25rem",
          }}
        >
          Cerveza artesanal · Sin intermediarios
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
            fontWeight: 900,
            color: "var(--color-cream)",
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
            maxWidth: "14ch",
            marginBottom: "1.75rem",
          }}
        >
          Tu cerveza,
          <br />
          <span style={{ color: "var(--color-amber-light)" }}>por litros.</span>
        </h1>

        {/* Subline */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255, 248, 231, 0.65)",
            maxWidth: "42ch",
            lineHeight: 1.65,
            marginBottom: "2.5rem",
          }}
        >
          Pedís exactamente los litros que necesitás. Sin desperdicio. Fresca,
          directamente de la cervecería a tu mesa. Sin道士, sin compromisos.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/menu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-amber-deep)",
              color: "white",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "1rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background-color 0.2s, transform 0.15s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(196, 127, 23, 0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-amber-dark)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(196, 127, 23, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-amber-deep)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(196, 127, 23, 0.35)";
            }}
          >
            Ver Carta
            <IconArrowRight />
          </Link>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              color: "var(--color-cream)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "1rem",
              padding: "0.6875rem 1.625rem",
              borderRadius: "8px",
              border: "1.5px solid rgba(255, 248, 231, 0.3)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 248, 231, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 248, 231, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 248, 231, 0.3)";
            }}
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Social proof strip */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 248, 231, 0.1)",
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "Litros exactos", label: "Sin desperdicio" },
            { value: "Fresca", label: "Directo de la cervecería" },
            { value: "0%", label: "Intermediarios" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-amber-light)",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  color: "rgba(255, 248, 231, 0.45)",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
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

// ─── Section: Cómo funciona ─────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: <IconFlask />,
      title: "Elegí tu cerveza",
      description:
        "Navegá nuestra carta de artesanales. Cada una con descripción, estilo y precio por litro. Sin sorpresas.",
    },
    {
      number: "02",
      icon: <IconDrop />,
      title: "Pedí por litros",
      description:
        "La cantidad exacta que necesitás. 0.5L, 1.5L, 3L — lo que vos definas. Sin mínimo, sin desperdicio.",
    },
    {
      number: "03",
      icon: <IconHandOver />,
      title: "Recibí tu pedido",
      description:
        "Pagás online, nosotros preparamos. Venís a buscar o coordinamos el retiro. Tu cerveza, fresca.",
    },
  ];

  return (
    <section style={{ padding: "5rem 0", backgroundColor: "var(--color-cream)" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem", maxWidth: "36ch" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-copper)",
              marginBottom: "0.875rem",
            }}
          >
            El proceso
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--color-toast)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Tres pasos, cero complicaciones.
          </h2>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {steps.map(({ number, icon, title, description }) => (
            <div key={number}>
              {/* Number + icon row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "rgba(196, 127, 23, 0.12)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {number}
                </span>
                <span
                  style={{
                    color: "var(--color-amber-deep)",
                    opacity: 0.7,
                    marginTop: "0.25rem",
                  }}
                >
                  {icon}
                </span>
              </div>

              {/* Content */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1875rem",
                  fontWeight: 600,
                  color: "var(--color-toast)",
                  letterSpacing: "-0.015em",
                  marginBottom: "0.625rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  color: "var(--color-toast-muted)",
                  lineHeight: 1.65,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA Banner ─────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-cream-dark)",
        borderTop: "1px solid rgba(196, 127, 23, 0.12)",
        borderBottom: "1px solid rgba(196, 127, 23, 0.12)",
        padding: "4rem 0",
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
        <div style={{ maxWidth: "40ch" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--color-toast)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            ¿Primera vez?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "var(--color-toast-muted)",
              lineHeight: 1.6,
            }}
          >
            Crear una cuenta toma 30 segundos. Después, cada pedido es aún más rápido.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-amber-deep)",
              color: "white",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              padding: "0.6875rem 1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background-color 0.2s, transform 0.15s",
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
            Crear cuenta gratis
            <IconChevronRight />
          </Link>
          <Link
            href="/menu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              color: "var(--color-toast)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              padding: "0.625rem 1.375rem",
              borderRadius: "8px",
              border: "1.5px solid rgba(26, 22, 18, 0.2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-toast)";
              e.currentTarget.style.backgroundColor = "var(--color-toast)";
              e.currentTarget.style.color = "var(--color-cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(26, 22, 18, 0.2)";
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-toast)";
            }}
          >
            Ver carta sin cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Footer ────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-toast)", padding: "2.5rem 0" }}>
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
              fontWeight: 700,
              color: "var(--color-cream)",
              letterSpacing: "-0.01em",
            }}
          >
            Beer Drop
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "rgba(255, 248, 231, 0.35)",
              marginTop: "0.25rem",
            }}
          >
            Cerveza artesanal por litros. Sin desperdicio.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["/menu", "/login", "/register"].map((href) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                color: "rgba(255, 248, 231, 0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-cream)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 248, 231, 0.4)";
              }}
            >
              {href === "/menu"
                ? "Carta"
                : href === "/login"
                ? "Iniciar Sesión"
                : "Registrarse"}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <HeroSection />
      <HowItWorksSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
