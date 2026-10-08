# Architecture — Admin Dashboard

## Intent

A React + Vite admin dashboard for day-to-day business operations: sales, purchases, accounts, summary KPIs, and settings. Table-heavy UI with TanStack Table and React Hook Form workflows.

## System shape

Client SPA with page-level modules under `src/pages` and shared UI under `src/components`.

## Stack decisions

- React
- Vite
- TypeScript
- TanStack Table
- React Router
- Tailwind CSS
- React Hook Form

## Boundaries

- Secrets stay in environment variables / secret managers — never in git.
- Client bundles only receive public configuration (`NEXT_PUBLIC_*` / `VITE_*`).
- Tenant or role checks belong in middleware / server layers, not UI-only gates.
- Heavy or long-running work should not run inside short-lived serverless handlers unless designed for it.

## Quality bar

- Prefer typed contracts at API and domain boundaries.
- Ship a vertical slice (auth → persisted outcome) before a broad feature surface.
- Document trade-offs in PRs when changing data models or auth.

