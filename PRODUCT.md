# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), Tailwind CSS v4, Prisma + PostgreSQL, MercadoPago, JWT auth, NextAuth-style session via jose

## Users

**Primary:** Adults 25-45 in urban Latin America who appreciate craft beer, value quality over quantity, want to buy by the liter without waste, and are comfortable with digital payments.

**Admin:** The brewery operator who manages inventory, fulfills orders, and needs a clean operational dashboard.

## Product Purpose

Beer Drop is a direct-to-consumer craft beer platform where users order beer by the exact liter they need, pay online, and pick up fresh from the brewery. The core mechanism: no waste, no minimum, fresh product, personal connection to the brewer.

## Positioning

"Tu cerveza artesanal, por litros, sin desperdicio." Direct from brewery to user. The opposite of a big-box liquor store and the opposite of a restaurant markup. This is for people who care about what they drink.

## Operating Context

- User discovers the brand (likely via social media, word of mouth, or search)
- Browses the beer catalog (available inventory, prices, descriptions)
- Builds a cart selecting beers and quantities (0.5L increments)
- Pays via MercadoPago checkout
- Receives confirmation and picks up at the brewery
- Tracks order status until ready

Admin workflow:
- Adds/edits beers with price, stock, description, image
- Sees incoming orders
- Updates order status as it progresses (pending → paid → preparing → ready → delivered)

## Capabilities and Constraints

- User registration and login with JWT (access + refresh tokens)
- Beer catalog with real-time stock
- Cart-based ordering (multiple beers per order)
- MercadoPago checkout integration
- Order status tracking with badge states
- Admin panel for beers, orders, users
- No delivery — pickup only
- No user profile editing (phone/address optional at registration)

## Brand Commitments

- Cerveza artesanal de calidad
- Freshness and direct-from-brewery provenance
- No waste (precise liter amounts)
- Local/independent brewery identity

## Evidence on Hand

- Beer types, pricing, stock managed via Prisma schema
- Order flow is complete (cart → checkout → status)
- MercadoPago webhook handles payment confirmation
- No real product photography yet (emoji fallback in cards)
- No brand assets, logo, or custom iconography

## Product Principles

1. **Direct over distributed** — No middlemen. Brewery to user, transparent pricing.
2. **Precision over包袱** — Order exactly what you need, no forced sizes.
3. **Freshness as feature** — The product is made fresh and delivered fresh; the UI should communicate this.
4. **Operational clarity** — Admin tools must be efficient, no ambiguity in order states.
5. **Craft without pretension** — Authentic, warm, approachable. Not corporate craft.

## Accessibility & Inclusion

Standard WCAG AA targets. The app is functional but no accessibility audit has been conducted.
