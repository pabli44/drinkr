---
name: beer-react
description: >
  React best practices for the Beer Drop project. Enforces consistent patterns
  for components, hooks, state management, and data fetching. Use when writing
  or reviewing React components in this codebase.
argument-hint: ""
license: MIT
---

# Beer Drop - React Best Practices

Project-specific React guidelines for the Beer Drop codebase.

## Component Patterns

### Structure
- Components live in `src/components/{domain}/` (e.g., `beer/`, `auth/`, `order/`, `layout/`).
- One component per file. Named exports: `export function BeerCard(...)`.
- Pages live in `src/app/` and use default exports: `export default function MenuPage()`.
- Props interfaces go at the top of the file, named `{Component}Props`.

### Server vs Client Components
- Default to **Server Components**. Only add `"use client"` when the component needs:
  - `useState`, `useReducer`, `useEffect`, `useRef`, or other hooks
  - Browser APIs (`window`, `localStorage`, `navigator`)
  - Event handlers (`onClick`, `onSubmit`, etc.)
- Keep `"use client"` as the very first line of the file (before imports if possible).
- Prefer lifting client state to the lowest common ancestor, not to a global store.

### Data Fetching
- Server Components: fetch directly with `await` (no `useEffect`).
- Client Components: fetch in `useEffect` with a cleanup flag:
  ```tsx
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/beers");
        if (res.ok && !cancelled) setBeers(await res.json());
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);
  ```
- Always use relative URLs for internal API routes (`/api/beers`, not full URL).
- Handle loading, error, and empty states explicitly.

### Forms
- Use controlled components (`value` + `onChange`).
- Handle submit via `onSubmit` on `<form>`, not on button click.
- Show loading state on submit button: `disabled={loading}` + loading text.
- Display errors in a styled div above the form fields.

## State Management

- **Local state**: `useState` for UI state (loading, error, form values).
- **Shared state**: Use React Context only when prop drilling exceeds 2 levels.
- **URL state**: Use `useSearchParams` for filter/sort/pagination state.
- **No external state libraries** (Redux, Zustand, etc.) unless explicitly approved.

### State Colocation
- State lives closest to where it's used.
- Lift state up only when a sibling needs it.
- Cart state (currently in menu page) should stay local to the page, not in context.

## Hooks

- Custom hooks go in `src/hooks/` (create if needed).
- Prefix with `use`: `useAuth`, `useCart`, `useOrders`.
- One responsibility per hook. Split if it manages two unrelated concerns.
- Never call hooks conditionally.

## Types

- Shared types in `src/types/index.ts`.
- Use `interface` for object shapes, `type` for unions/intersections.
- Import types with `import type { Beer } from "@/types"`.
- Prisma types are auto-generated in `src/generated/` — do not edit manually.
- Use Prisma's generated types for API responses, convert to app types at the boundary.

## Styling

- Tailwind CSS only. No inline styles, no CSS modules, no styled-components.
- Use the project's color palette: `amber-700` (primary), `gray-*` (neutrals), `green-*` (success), `red-*` (error).
- Responsive breakpoints: `sm:`, `md:`, `lg:` — mobile-first.
- Consistent spacing: `px-4 py-2` for buttons, `p-4` for cards, `space-y-4` for forms.

## Error Handling

- API routes: wrap in `try/catch`, return `{ error: string }` with appropriate status code.
- Client components: catch fetch errors, show user-friendly messages in Spanish.
- Never expose internal error details to the client.
- Use `error instanceof Error` for typed error handling.

## Naming Conventions

- Components: PascalCase (`BeerCard`, `LoginForm`).
- Functions: camelCase (`handleSelect`, `handleSubmit`, `getTotal`).
- Files: match component name (`BeerCard.tsx`, `LoginForm.tsx`).
- API routes: lowercase (`/api/beers`, `/api/orders`).
- CSS classes: Tailwind utilities, no custom class names.

## Testing Patterns

- Component tests (if added): test render, user interactions, loading states.
- Mock `fetch` for API calls.
- Test error states and empty states, not just happy path.

## Do NOT

- Do not use `any` type. Use `unknown` and narrow.
- Do not mutate state directly. Always use setter functions.
- Do not create unnecessary wrapper components.
- Do not add dependencies without checking if a native solution exists.
- Do not use `index` as `key` for lists with dynamic items.
