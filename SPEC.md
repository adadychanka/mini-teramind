# Mini Teramind Platform – PRD + TRD (Monorepo)

## 1. Overview

### 1.1 Product Vision

Build a small but realistic employee activity monitoring & analytics platform inspired by Teramind's domain: employees, work sessions, activity events, rules, alerts, and workforce analytics dashboards.

Scope is intentionally narrow so it can be implemented in 1–2 weeks but still demonstrates:

- End‑to‑end full‑stack skills (NestJS + PostgreSQL + Next.js).
- Understanding of event‑driven thinking, rules/alerts, and analytics.
- Familiarity with REST + GraphQL APIs and production‑oriented concerns.
- Ability to structure a monorepo with shared contracts between backend and frontend.

### 1.2 High‑Level Features

**Monorepo with:**

- `apps/api`: NestJS backend (REST + optional GraphQL).
- `apps/web`: Next.js dashboard.
- `packages/contracts`: shared TypeScript types / schemas (`Employee`, `Session`, `ActivityEvent`, `Rule`, `Alert`, `DailyEmployeeStats`).

**Backend (NestJS + PostgreSQL):**

- Employee & Session management.
- Activity event ingestion (`APP`/`WEB`/`FILE`/`KEYSTROKE_SUMMARY`).
- Rule engine (simple Smart Rules‑like model).
- Alert generation and storage.
- Derived daily stats for workforce analytics.
- REST API (CRUD + analytics endpoints).
- Optional GraphQL read API for dashboards.

**Frontend (Next.js):**

- Employee list and per‑employee dashboard (sessions, stats, alerts).
- Global alerts view with filtering.
- Basic charts for daily stats.

---

## 2. Product Requirements (PRD)

### 2.1 User Personas

**Security / Risk Analyst (primary):**

- Sees which employees triggered alerts and why.
- Reviews activity and risk patterns over time.

**Manager / Team Lead (secondary):**

- Sees who is working, how much, and where alerts are concentrated.

**Engineer / Candidate (you):**

- Needs a clear technical surface to discuss architecture, design trade‑offs, and implementation details.

### 2.2 Use Cases

- Track employee work sessions (create employees, start/end sessions).
- Ingest activity events per session (apps, websites, file ops, keystroke summaries).
- Define monitoring rules (blocked websites, after‑hours activity).
- Generate alerts when rules are violated.
- Analyze workforce behavior (per‑employee stats, daily trends, alerts by severity).
- View dashboards (employee overview, drill‑down, global alerts list).

---

## 3. Functional Requirements

### 3.1 Entities & Data Model (Conceptual)

**Employee**

- `id` (UUID), `name`, `email`, `department`, `createdAt`, `updatedAt`.

**Session**

- `id` (UUID), `employeeId` (FK → Employee), `startedAt`, `endedAt` (nullable), `status` (`ACTIVE`, `ENDED`), `createdAt`, `updatedAt`.

**ActivityEvent**

- `id` (UUID), `sessionId` (FK → Session), `type` (`APP`, `WEB`, `FILE`, `KEYSTROKE_SUMMARY`), `metadata` (JSON), `occurredAt`, `createdAt`.

**Rule**

- `id` (UUID), `name`, `description`, `type` (`BLOCKED_WEBSITE`, `AFTER_HOURS`), `config` (JSON), `severity` (`LOW`, `MEDIUM`, `HIGH`), `active` (boolean), `createdAt`, `updatedAt`.

**Alert**

- `id` (UUID), `employeeId` (FK → Employee), `sessionId` (FK → Session, nullable), `ruleId` (FK → Rule), `detectedAt`, `status` (`OPEN`, `CLOSED`), `details` (JSON), `createdAt`, `updatedAt`.

**DailyEmployeeStats**

- `id` (UUID), `date`, `employeeId` (FK → Employee), `totalActiveMinutes`, `totalEvents`, `totalAlerts`, `eventsByType` (JSON), `createdAt`, `updatedAt`.

### 3.2 User Flows (API Level)

#### 3.2.1 Employees & Sessions

- `POST /employees` – create employee.
- `GET /employees` – list employees.
- `POST /employees/:id/sessions` – start session for employee.
- `GET /employees/:id/sessions` – list sessions for employee.
- `PATCH /sessions/:id/end` – end session.
- `GET /sessions/:id` – get session details.

#### 3.2.2 Activity Events

- `POST /sessions/:id/events` – create event.
- `GET /sessions/:id/events` – list events (type, from/to, pagination).
- Event creation triggers rule evaluation and stats update.

#### 3.2.3 Rules

- `POST /rules` – create a rule.
- `GET /rules` – list rules (optional active filter).
- `PATCH /rules/:id` – update rule (config, severity, active).

Config examples:

```json
// BLOCKED_WEBSITE
{ "pattern": "facebook.com" }

// AFTER_HOURS
{ "workHours": { "start": "09:00", "end": "18:00" }, "timezone": "Europe/Belgrade" }
```

#### 3.2.4 Alerts

- `GET /alerts` – list alerts (filters: `employeeId`, `severity`, `status`, `from`, `to`).
- `PATCH /alerts/:id` – update status (`OPEN`/`CLOSED`).
- Alerts are created automatically when events violate rules.

#### 3.2.5 Analytics & Stats

- `GET /employees/:id/summary` – overall metrics: `totalSessions`, `totalActiveMinutes`, `eventsByType`, `alertsCountBySeverity`.
- `GET /employees/:id/daily-stats?from=&to=` – time‑series data based on `DailyEmployeeStats`.

---

## 4. Monorepo Design

### 4.1 Repo Layout

Use npm workspaces or similar monorepo tooling.

```
mini-teramind/
  package.json          # workspace root
  tsconfig.base.json    # optional shared TS config
  docker-compose.yml    # Postgres, maybe API
  README.md
  apps/
    api/                # NestJS backend
    web/                # Next.js dashboard
  packages/
    contracts/          # shared types / schemas
```

Root `package.json` (conceptual):

- `"private": true`
- `"workspaces": ["apps/*", "packages/*"]`

### 4.2 `packages/contracts`

**Purpose:** share domain contracts between backend and frontend (type safety and consistency).

**Structure:**

```
packages/contracts/
  package.json
  src/
    index.ts
    types/
      employee.ts
      session.ts
      activity-event.ts
      rule.ts
      alert.ts
      daily-stats.ts
    api/
      rest.ts          # shared REST response shapes (optional)
      graphql.ts       # shared GQL fragments/types (optional)
```

**Example content (simplified):**

```typescript
// src/types/employee.ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}
```

The NestJS API uses these interfaces for DTOs/responses; Next.js uses them for client types.

---

## 5. Technical Requirements (TRD)

### 5.1 Backend (`apps/api`)

- **Language:** TypeScript.
- **Framework:** NestJS.
- **Database:** PostgreSQL (Docker).
- **ORM:** TypeORM or Prisma.
- **APIs:** REST + optional GraphQL.
- **Auth:** Simple API key or JWT.
- **Structure:** NestJS modules aligned with domains.

#### 5.1.1 Modules

- `EmployeesModule`
- `SessionsModule`
- `EventsModule`
- `RulesModule`
- `AlertsModule`
- `StatsModule`
- `AuthModule`
- `GraphqlModule` (optional)

Each module uses shared contracts (`@mini-teramind/contracts`) where appropriate.

#### 5.1.2 REST Endpoints (summary)

- `POST /employees`, `GET /employees`
- `POST /employees/:id/sessions`, `GET /employees/:id/sessions`
- `PATCH /sessions/:id/end`, `GET /sessions/:id`
- `POST /sessions/:id/events`, `GET /sessions/:id/events`
- `POST /rules`, `GET /rules`, `PATCH /rules/:id`
- `GET /alerts`, `PATCH /alerts/:id`
- `GET /employees/:id/summary`
- `GET /employees/:id/daily-stats`
- `GET /health`

DTOs and response types should reuse contracts where possible.

#### 5.1.3 Rule Engine

**`RuleEngineService`:**

- Input: `ActivityEvent` + `Employee` + `Session`.
- Loads active rules.
- Evaluates rule types:
  - `BLOCKED_WEBSITE` – check `type=WEB` and URL pattern match.
  - `AFTER_HOURS` – compare `occurredAt` with configured work hours.
- Returns a list of `RuleViolation`s.

**`AlertService`:**

- Consumes `RuleViolation`, persists `Alert` with details.

**Integration** – in `EventsService.createEvent()`:

> Save event → run `RuleEngineService` → create alerts → emit domain events.

#### 5.1.4 Event‑Driven Stats Projection

Use NestJS event emitter or similar.

**`EventCreated` event** → Listener updates `DailyEmployeeStats`:

- Increment `totalEvents` and `eventsByType[type]`.
- If event implies session end, add to `totalActiveMinutes`.

**`AlertCreated` event** → Listener increments `totalAlerts`.

Stats endpoints read from `DailyEmployeeStats` instead of raw data for performance.

### 5.2 GraphQL Layer (Optional, `apps/api`)

- Use NestJS GraphQL module.
- Schema includes types for `Employee`, `Session`, `ActivityEvent`, `Rule`, `Alert`, `DailyEmployeeStats`.

**Queries:**

```graphql
employee(id: ID!): Employee
employees(filter: EmployeeFilterInput): [Employee!]!
alerts(filter: AlertFilterInput): [Alert!]!
```

- Resolvers delegate to services.
- Shared type definitions can live in `packages/contracts/api/graphql.ts` (optional).
- Authentication and basic pagination/limits apply.

### 5.3 Frontend (`apps/web`)

- **Framework:** Next.js (App Router).
- **Language:** TypeScript.
- **Data fetching:** React Query or SWR.
- **UI:** Any library (e.g., MUI, shadcn/ui).
- **Charts:** Recharts / Chart.js / ECharts.

#### 5.3.1 Pages

**`/employees`**

- Uses `GET /employees` (+ summary information).
- Table with: `name`, `department`, `totalSessions`, `totalAlerts`.

**`/employees/[id]`**

- Uses `GET /employees/:id/summary`, `GET /employees/:id/daily-stats`, `GET /alerts?employeeId=...`.
- Sections:
  - Employee header.
  - Sessions list.
  - Daily stats chart.
  - Alerts table.

**`/alerts`**

- Uses `GET /alerts` with query params.
- Filters by severity, status, date range, employee.
- Types imported from `@mini-teramind/contracts`.

---

## 6. Non‑Functional Requirements

**Performance:**

- DB indexes on `session.employeeId`, `event.sessionId`, `alert.employeeId`, `(dailyStats.date, employeeId)`.
- Pagination on list endpoints.

**Security:**

- Auth (API key/JWT) on non‑public endpoints.
- Minimal PII.

**Code Quality:**

- Shared ESLint/Prettier config at root.
- Tests for rule engine and stats.
- 1–2 e2e tests.

**CI** – Root GitHub Actions workflow:

- Install dependencies (workspace).
- Run backend tests.
- Build backend + frontend (optional).

---

## 7. Implementation Phases (Timeline)

Assuming ~2–3h / day:

| Phase               | Days  | Tasks                                                                                  |
| ------------------- | ----- | -------------------------------------------------------------------------------------- |
| Core                | 1–5   | Monorepo setup, backend core (Employees, Sessions, Events, Rules, Alerts, Stats, REST) |
| Polish              | 6–7   | Rule engine, projections, auth, tests                                                  |
| GraphQL (optional)  | 8–9   | GraphQL layer                                                                          |
| Frontend (optional) | 10–12 | Next.js dashboard (employees, detail page, alerts page)                                |
