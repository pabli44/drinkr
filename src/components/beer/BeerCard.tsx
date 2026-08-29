import type { Beer } from "@/types";

interface BeerCardProps {
  beer: Beer;
  showStock?: boolean;
  onSelect?: (beer: Beer) => void;
  selected?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

function IconMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

export function BeerCard({
  beer,
  showStock = false,
  onSelect,
  selected = false,
  quantity = 0,
  onQuantityChange,
}: BeerCardProps) {
  const stock = Number(beer.stockInLiters);
  const price = Number(beer.pricePerLiter);

  const stockColor =
    stock > 10
      ? "var(--color-toast-muted)"
      : stock > 0
      ? "var(--color-amber-deep)"
      : "#DC2626";

  const stockLabel =
    stock > 0
      ? `${stock}L disponibles`
      : "Sin stock";

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: selected
          ? "0 0 0 2px var(--color-amber-deep), 0 8px 24px rgba(26, 22, 18, 0.12)"
          : "0 1px 3px rgba(26, 22, 18, 0.06), 0 2px 8px rgba(26, 22, 18, 0.04)",
        border: `1px solid ${selected ? "var(--color-amber-deep)" : "rgba(196, 127, 23, 0.08)"}`,
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: selected ? "translateY(-2px)" : "none",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "200px",
          background: "linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-cream) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {beer.imageUrl ? (
          <img
            src={beer.imageUrl}
            alt={beer.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "4rem",
              fontWeight: 900,
              color: "rgba(196, 127, 23, 0.15)",
              userSelect: "none",
            }}
          >
            B
          </div>
        )}

        {/* Stock badge overlay */}
        {showStock && stock > 0 && (
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              backgroundColor: stock > 5 ? "var(--color-toast)" : "var(--color-amber-deep)",
              color: "white",
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "0.25rem 0.625rem",
              borderRadius: "9999px",
            }}
          >
            {stockLabel}
          </div>
        )}

        {stock <= 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 248, 231, 0.6)",
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
                color: "var(--color-toast-muted)",
              }}
            >
              Agotada
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.125rem" }}>
        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--color-toast)",
            letterSpacing: "-0.015em",
            marginBottom: "0.25rem",
            lineHeight: 1.3,
          }}
        >
          {beer.name}
        </h3>

        {/* Description */}
        {beer.description && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "var(--color-toast-muted)",
              lineHeight: 1.55,
              marginBottom: "0.75rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {beer.description}
          </p>
        )}

        {/* Price + stock row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: showStock && stock > 0 ? "1rem" : 0,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--color-amber-deep)",
                letterSpacing: "-0.02em",
              }}
            >
              ${price.toFixed(2)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                color: "var(--color-toast-muted)",
                marginLeft: "0.25rem",
              }}
            >
              /litro
            </span>
          </div>
          {showStock && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: stockColor,
              }}
            >
              {stockLabel}
            </span>
          )}
        </div>

        {/* Selection / quantity controls */}
        {onSelect && (
          <div>
            {selected ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  padding: "0.625rem",
                  backgroundColor: "rgba(196, 127, 23, 0.06)",
                  borderRadius: "8px",
                  border: "1px solid rgba(196, 127, 23, 0.12)",
                }}
              >
                <button
                  onClick={() => onQuantityChange?.(Math.max(0.5, quantity - 0.5))}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(26, 22, 18, 0.15)",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--color-toast)",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-amber-deep)";
                    e.currentTarget.style.color = "var(--color-amber-deep)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(26, 22, 18, 0.15)";
                    e.currentTarget.style.color = "var(--color-toast)";
                  }}
                >
                  <IconMinus />
                </button>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-toast)",
                    minWidth: "3rem",
                    textAlign: "center",
                  }}
                >
                  {quantity}L
                </span>
                <button
                  onClick={() => onQuantityChange?.(Math.min(stock, quantity + 0.5))}
                  disabled={quantity >= stock}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(26, 22, 18, 0.15)",
                    background: quantity >= stock ? "rgba(26, 22, 18, 0.04)" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: quantity >= stock ? "not-allowed" : "pointer",
                    color: quantity >= stock ? "rgba(26, 22, 18, 0.2)" : "var(--color-toast)",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (quantity < stock) {
                      e.currentTarget.style.borderColor = "var(--color-amber-deep)";
                      e.currentTarget.style.color = "var(--color-amber-deep)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity < stock) {
                      e.currentTarget.style.borderColor = "rgba(26, 22, 18, 0.15)";
                      e.currentTarget.style.color = "var(--color-toast)";
                    }
                  }}
                >
                  <IconPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelect(beer)}
                disabled={stock <= 0}
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  backgroundColor: stock > 0 ? "var(--color-amber-deep)" : "rgba(26, 22, 18, 0.08)",
                  color: stock > 0 ? "white" : "var(--color-toast-muted)",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: stock > 0 ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
                onMouseEnter={(e) => {
                  if (stock > 0) {
                    e.currentTarget.style.backgroundColor = "var(--color-amber-dark)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (stock > 0) {
                    e.currentTarget.style.backgroundColor = "var(--color-amber-deep)";
                  }
                }}
              >
                {stock > 0 ? "Agregar" : "Sin stock"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
