import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToOrder?: (product: Product) => void;
  selected?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

function IconMinus() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M5 12h14"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({
  product,
  onAddToOrder,
  selected = false,
  quantity = 0,
  onQuantityChange,
}: ProductCardProps) {
  const stock = product.stock ?? 0;
  const promoPrice = Number(product.promoPrice);
  const regularPrice = Number(product.regularPrice);
  const savings = regularPrice > 0
    ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100)
    : 0;
  const outOfStock = stock <= 0;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${selected ? "var(--color-neon-green)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        opacity: outOfStock ? 0.5 : 1,
        boxShadow: selected ? "var(--glow-green)" : "none",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "160px",
          background: "linear-gradient(135deg, var(--color-surface-raised) 0%, var(--color-surface) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3.5rem",
              fontWeight: 900,
              color: "rgba(0, 230, 118, 0.08)",
              userSelect: "none",
            }}
          >
            {product.name?.charAt(0) ?? "?"}
          </span>
        )}

        {/* Savings badge */}
        {!outOfStock && savings > 0 && (
          <div
            style={{
              position: "absolute",
              top: "0.625rem",
              left: "0.625rem",
              backgroundColor: "var(--color-neon-green)",
              color: "var(--color-base)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              padding: "0.25rem 0.5rem",
              borderRadius: "var(--radius-full)",
              boxShadow: "0 0 10px rgba(0, 230, 118, 0.4)",
            }}
          >
            -{savings}%
          </div>
        )}

        {/* Presentation badge */}
        <div
          style={{
            position: "absolute",
            top: "0.625rem",
            right: "0.625rem",
          }}
        >
          <span className="badge-presentation">
            {product.presentation}
          </span>
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(13, 13, 13, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-dim)",
                border: "1px solid var(--color-border)",
                padding: "0.3rem 0.75rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1rem" }}>
        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            marginBottom: "0.5rem",
          }}
        >
          {product.name}
        </h3>

        {/* Presentation */}
        {product.presentation && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--color-text-dim)",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {product.presentation}
          </p>
        )}

        {/* Price comparison */}
        {!outOfStock && (
          <div style={{ marginBottom: "0.875rem" }}>
            {/* Regular price */}
            {regularPrice > 0 && (
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  color: "var(--color-text-dim)",
                  textDecoration: "line-through",
                  marginBottom: "0.125rem",
                }}
              >
                {formatPrice(regularPrice)}
              </p>
            )}
            {/* Promo price */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "var(--color-neon-green)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                textShadow: "0 0 16px rgba(0, 230, 118, 0.4)",
              }}
            >
              {formatPrice(promoPrice)}
            </p>
          </div>
        )}

        {/* Stock info */}
        {!outOfStock && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--color-text-dim)",
              marginBottom: "0.875rem",
            }}
          >
            {stock} unidad{stock !== 1 ? "es" : ""} disponible{stock !== 1 ? "s" : ""}
          </p>
        )}

        {/* CTA */}
        {onAddToOrder && (
          <div>
            {selected ? (
              /* Quantity controls */
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "rgba(0, 230, 118, 0.06)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(0, 230, 118, 0.15)",
                }}
              >
                <button
                  onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-border-bright)",
                    background: "var(--color-surface-raised)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--color-text)",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-neon-green)";
                    e.currentTarget.style.color = "var(--color-neon-green)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-bright)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                >
                  <IconMinus />
                </button>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    minWidth: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => onQuantityChange?.(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1.5px solid var(--color-border-bright)",
                    background: quantity >= stock ? "var(--color-surface)" : "var(--color-surface-raised)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: quantity >= stock ? "not-allowed" : "pointer",
                    color: quantity >= stock ? "var(--color-text-dim)" : "var(--color-text)",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (quantity < stock) {
                      e.currentTarget.style.borderColor = "var(--color-neon-green)";
                      e.currentTarget.style.color = "var(--color-neon-green)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity < stock) {
                      e.currentTarget.style.borderColor = "var(--color-border-bright)";
                      e.currentTarget.style.color = "var(--color-text)";
                    }
                  }}
                >
                  <IconPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToOrder(product)}
                disabled={outOfStock}
                className="btn-neon-green"
                style={{
                  width: "100%",
                  padding: "0.5625rem",
                  fontSize: "0.875rem",
                }}
              >
                {outOfStock ? "Agotado" : "Agregar"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
