# Mini Teramind

A small but realistic employee activity monitoring and analytics platform inspired by Teramind. Demonstrates end-to-end full-stack skills with NestJS, PostgreSQL, and Next.js in a Turborepo monorepo.

## What it does

- Track employee work sessions and activity events (apps, websites, file ops, keystrokes)
- Evaluate monitoring rules (blocked websites, after-hours activity) and generate alerts
- Provide per-employee analytics dashboards with daily stats and alert histories

## Monorepo Structure

```
mini-teramind/
├── apps/
│   ├── api/              # NestJS backend — REST API + PostgreSQL + Prisma
│   └── web/              # Next.js dashboard (employees, alerts, charts)
├── packages/
│   ├── contracts/        # Shared TypeScript types (Employee, Session, Alert, …)
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/# Shared tsconfig bases
│   └── ui/               # Shared React component library
├── docker-compose.yml    # PostgreSQL 16 for local development
├── turbo.json
└── package.json
```

## Local development

See the local development guide for step-by-step instructions to run the full stack (Docker, Prisma, API, and web app):

- `docs/local-development.md`

Backend decisions and implemented behavior (employees, sessions, schema): `docs/backend/README.md`

## Apps

### `apps/api` — NestJS Backend

REST API with PostgreSQL via Prisma. See [`apps/api/README.md`](apps/api/README.md) for full documentation including endpoints, module architecture, and database setup.

**Domains:** Employees, Sessions, Activity Events, Rules, Alerts, Daily Stats

### `apps/web` — Next.js Dashboard

React dashboard for viewing employees, drilling into per-employee activity, and managing alerts.

## Shared Packages

| Package                   | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `@repo/contracts`         | Shared TypeScript interfaces for all domain entities |
| `@repo/ui`                | Shared React component library                       |
| `@repo/eslint-config`     | ESLint configurations (Next.js, React, base)         |
| `@repo/typescript-config` | Shared `tsconfig` bases                              |

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Monorepo     | Turborepo + npm workspaces                    |
| Backend      | NestJS 11, TypeScript                         |
| Database     | PostgreSQL 16 (Docker)                        |
| ORM          | Prisma                                        |
| Frontend     | Next.js 16, React 19                          |
| Shared types | TypeScript interfaces in `packages/contracts` |
