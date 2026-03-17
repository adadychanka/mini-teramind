# API Service — Mini Teramind

NestJS backend for the Mini Teramind employee activity monitoring platform.

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma |
| Config | `@nestjs/config` / `.env` |
| API style | REST (GraphQL optional) |

## Architecture

The API is structured around domain modules. Each module owns its routes, services, and repository access via `PrismaService`.

```
src/
├── prisma/              # Global PrismaModule + PrismaService
├── employees/           # Employee CRUD
├── sessions/            # Session lifecycle
├── events/              # Activity event ingestion + rule trigger
├── rules/               # Rule management
├── alerts/              # Alert storage and status updates
├── stats/               # DailyEmployeeStats projections + analytics
└── auth/                # API key / JWT guard (upcoming)
```

### Module Dependency Flow

```
EventsModule
  └─► RuleEngineService  ──► AlertsModule
  └─► StatsModule        (via domain events)
```

## Data Model

Six entities persisted in PostgreSQL:

| Entity | Key fields |
|---|---|
| `Employee` | id, name, email, department |
| `Session` | id, employeeId, startedAt, endedAt, status |
| `ActivityEvent` | id, sessionId, type, metadata (JSON), occurredAt |
| `Rule` | id, name, type, config (JSON), severity, active |
| `Alert` | id, employeeId, sessionId, ruleId, detectedAt, status |
| `DailyEmployeeStats` | id, date, employeeId, totalActiveMinutes, totalEvents, totalAlerts, eventsByType |

Schema: [`prisma/schema.prisma`](prisma/schema.prisma)

## REST API Endpoints

### Employees & Sessions
```
POST   /employees
GET    /employees
POST   /employees/:id/sessions
GET    /employees/:id/sessions
PATCH  /sessions/:id/end
GET    /sessions/:id
```

### Activity Events
```
POST   /sessions/:id/events
GET    /sessions/:id/events
```

### Rules
```
POST   /rules
GET    /rules
PATCH  /rules/:id
```

### Alerts
```
GET    /alerts
PATCH  /alerts/:id
```

### Analytics
```
GET    /employees/:id/summary
GET    /employees/:id/daily-stats
GET    /health
```

## Prerequisites

- Node.js >= 18
- Docker (for PostgreSQL)

## Setup

### 1. Start the database

From the **monorepo root**:

```bash
docker compose up -d
```

### 2. Configure environment

```bash
cp .env.example .env
```

Defaults connect to the Docker Compose Postgres instance; no changes needed for local dev.

### 3. Run migrations and generate Prisma client

```bash
npm run db:migrate:dev
```

### 4. Start the dev server

```bash
npm run dev
# or from the monorepo root:
turbo dev --filter=api
```

The API listens on `http://localhost:3001`.

## Available Scripts

| Script | Description |
|---|---|
| `dev` | Start in watch mode |
| `build` | Compile to `dist/` (runs `prisma generate` first) |
| `start:prod` | Run compiled output |
| `db:generate` | Regenerate Prisma client after schema changes |
| `db:migrate:dev` | Create and apply a new migration (dev) |
| `db:migrate:deploy` | Apply pending migrations (production) |
| `db:push` | Push schema directly to DB without a migration file |
| `db:studio` | Open Prisma Studio GUI |
| `lint` | Run ESLint |
| `test` | Run unit tests |
| `test:e2e` | Run end-to-end tests |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://mini_teramind:mini_teramind@localhost:5432/mini_teramind` | Prisma connection string |
| `PORT` | `3001` | HTTP port |
