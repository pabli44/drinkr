---
name: beer-nextjs
description: >
  Next.js App Router best practices for the Beer Drop project. Enforces
  consistent patterns for routes, API handlers, middleware, and server-side
  logic. Use when writing or reviewing Next.js code in this codebase.
argument-hint: ""
license: MIT
---

# Beer Drop - Next.js App Router Best Practices

Project-specific Next.js guidelines for the Beer Drop codebase.

## Project Structure

```
src/
  app/
    (auth)/          # Public auth pages (login, register)
    (protected)/     # Client-only pages (dashboard, menu, orders)
    (admin)/         # Admin-only pages (admin/*)
    api/             # API route handlers
  components/        # Shared React components
  lib/               # Utilities, DB, auth, email, validators
  types/             # Shared TypeScript types
  generated/         # Prisma generated client (do not edit)
```

## Route Groups

- `(auth)`: Login, register — no auth required.
- `(protected)`: Dashboard, menu, orders — require JWT.
- `(admin)`: Admin orders, beers, users — require ADMIN role.
- Route groups do NOT affect the URL path.

## Layouts

- `src/app/layout.tsx`: Root layout with `<html>`, `<body>`, global providers.
- Use nested layouts for shared UI within route groups.
- Keep layouts minimal — no heavy data fetching in layouts.
- Layouts are Server Components by default.

## API Routes

### File Convention
- Each route is a `route.ts` file in `src/app/api/`.
- Export named functions: `GET`, `POST`, `PATCH`, `DELETE`.
- Import `NextRequest` and `NextResponse` from `next/server`.

### Pattern
```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // ... business logic
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error message" },
      { status: 500 }
    );
  }
}
```

### Rules
- Always authenticate before business logic.
- Validate input with Zod schemas from `src/lib/validators/`.
- Return consistent error shape: `{ error: string }`.
- Use Prisma transactions for multi-step writes.
- Never expose raw Prisma errors to clients.

## Middleware (Proxy)

- `src/proxy.ts` handles route protection.
- Use `EdgeRuntime` compatible code only (no Node.js APIs).
- JWT verification uses `edge-jwt.ts`, not the main `tokens.ts`.
- Check both auth status AND role before allowing access.

## Server Components (Default)

- Fetch data directly with `async/await` — no `useEffect`.
- Access cookies/headers with `cookies()` / `headers()`.
- Can use `redirect()` and `notFound()` for navigation.
- Do NOT pass functions or non-serializable objects as props.

## Client Components

- Add `"use client"` at the top of the file.
- Use for: interactivity, forms, state, browser APIs.
- Fetch data via `fetch()` to your own API routes.
- Always handle loading, error, and empty states.

## Data Fetching Strategy

| Scenario | Approach |
|----------|----------|
| Page data (SEO) | Server Component with direct DB query |
| Page data (interactive) | Client Component with `fetch` to API |
| Form submission | Client `fetch` → API route → revalidate |
| Real-time | Polling or WebSocket (not implemented yet) |

## Authentication Flow

1. Login → POST `/api/auth/login` → receives access + refresh tokens.
2. Tokens stored as HTTP-only cookies (handled by API routes).
3. `getCurrentUser()` reads and verifies the JWT from cookies.
4. Middleware checks auth on protected routes.
5. Refresh token rotation on `/api/auth/refresh`.

### Key Files
- `src/lib/auth/tokens.ts`: JWT sign/verify (Node.js runtime).
- `src/lib/auth/edge-jwt.ts`: JWT verify for Edge runtime.
- `src/lib/auth/session.ts`: `getCurrentUser()` helper.

## Database (Prisma + Neon)

- Client singleton in `src/lib/db.ts` with PrismaPg adapter.
- Always use `prisma` from `@/lib/db`, never instantiate directly.
- Use `prisma.$transaction()` for multi-step writes.
- Convert `Decimal` types with `Number()` before returning to client.
- Migrations: `pnpm prisma migrate dev` (development), Vercel handles production.

## Environment Variables

- `DATABASE_URL`: Neon PostgreSQL connection string.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Random strings for JWT.
- `MP_ACCESS_TOKEN` / `NEXT_PUBLIC_MP_PUBLIC_KEY`: MercadoPago credentials.
- `RESEND_API_KEY`: Resend email service (optional, gracefully degrades).
- `NEXT_PUBLIC_APP_URL`: App URL for redirects and webhooks.

### Rules
- Server-only vars: NO `NEXT_PUBLIC_` prefix.
- Client-needed vars: MUST have `NEXT_PUBLIC_` prefix.
- Never log or expose secrets in client code.
- Always provide fallbacks for optional services (like Resend).

## Payments (MercadoPago)

- Checkout flow: API creates Preference → redirects to MercadoPago.
- Webhook: `/api/payments/webhook` handles payment notifications.
- Use `external_reference` to link payment to order ID.
- Verify webhook signatures in production.

## Caching

- API responses: no caching by default (dynamic content).
- Use `revalidatePath()` or `revalidateTag()` after mutations.
- Static pages: add `export const dynamic = "force-static"` if needed.

## Error Handling

- API routes: try/catch with `NextResponse.json({ error }, { status })`.
- Pages: use `error.tsx` for error boundaries.
- Not found: use `notFound()` from `next/navigation`.
- Webhook errors: log and return 200 (MercadoPago retries on 5xx).

## Do NOT

- Do not use `getServerSideProps` or `getStaticProps` (Pages Router patterns).
- Do not use `next/router` — use `next/navigation`.
- Do not fetch client-side data in Server Components.
- Do not use `useContext` for auth — use `getCurrentUser()`.
- Do not skip input validation in API routes.
- Do not store secrets in localStorage or client-side state.
- Do not use `any` type in API route handlers.
