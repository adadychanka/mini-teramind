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

## Prerequisites

- Node.js >= 18
- npm >= 10
- Docker (for the PostgreSQL database)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

```bash
# API environment (DATABASE_URL and PORT)
cp apps/api/.env.example apps/api/.env
```

### 4. Run database migrations

```bash
cd apps/api && npm run db:migrate:dev
```

### 5. Start all apps in development mode

```bash
turbo dev
```

| App | URL |
|---|---|
| API | http://localhost:3001 |
| Web | http://localhost:3000 |

## Apps

### `apps/api` — NestJS Backend

REST API with PostgreSQL via Prisma. See [`apps/api/README.md`](apps/api/README.md) for full documentation including endpoints, module architecture, and database setup.

**Domains:** Employees, Sessions, Activity Events, Rules, Alerts, Daily Stats

### `apps/web` — Next.js Dashboard

React dashboard for viewing employees, drilling into per-employee activity, and managing alerts.

## Shared Packages

| Package | Purpose |
|---|---|
| `@repo/contracts` | Shared TypeScript interfaces for all domain entities |
| `@repo/ui` | Shared React component library |
| `@repo/eslint-config` | ESLint configurations (Next.js, React, base) |
| `@repo/typescript-config` | Shared `tsconfig` bases |

## Common Commands

```bash
# Run all apps in dev mode
turbo dev

# Build all apps and packages
turbo build

# Run all linters
turbo lint

# Type-check everything
turbo check-types

# Database (run from apps/api)
npm run db:migrate:dev      # create + apply migration
npm run db:generate         # regenerate Prisma client
npm run db:studio           # open Prisma Studio GUI
```

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + npm workspaces |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma |
| Frontend | Next.js 16, React 19 |
| Shared types | TypeScript interfaces in `packages/contracts` |
