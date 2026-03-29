## Scope

This document covers **PostgreSQL persistence** for Prisma models under `apps/api/prisma/schema.prisma` that are migrated in-repo: **`Employee`**, **`Session`**, **`ActivityEvent`**, and **`Rule`**, with their enums and indexes, and migrations under `apps/api/prisma/migrations/`.

API behavior by domain: [employees.md](employees.md), [sessions.md](sessions.md), [activity-events.md](activity-events.md), [rules.md](rules.md).

## Prisma models

Source: `apps/api/prisma/schema.prisma`.

**`Employee`**

- `id` — `String`, UUID primary key (Prisma `@default(uuid())`).
- `name` — `String`, `VarChar(255)`.
- `email` — `String`, unique, `VarChar(255)`.
- `department` — optional `String`, `VarChar(255)`.
- `createdAt`, `updatedAt` — `DateTime` (`@updatedAt` on `updatedAt`).
- Relation: `sessions Session[]`.

**`Session`**

- `id` — `String`, UUID primary key.
- `startedAt` — `DateTime`, default `now()`.
- `endedAt` — optional `DateTime` (null while active).
- `status` — `SessionStatus`, default `ACTIVE`.
- `createdAt`, `updatedAt` — `DateTime`.
- `employeeId` — required FK to `Employee.id`; relation `employee`.
- Index: `@@index([employeeId, startedAt(sort: Desc)])` for listing sessions by employee newest-first.

**`SessionStatus` enum**

- `ACTIVE`, `ENDED`.

**`ActivityEventType` enum**

- `APP`, `WEB`, `FILE`, `KEYSTROKE_SUMMARY`.

**`ActivityEvent`**

- `id` — `String`, UUID primary key.
- `type` — `ActivityEventType` enum.
- `metadata` — `Json` (`metadata` stored as JSONB).
- `occurredAt` — `DateTime`.
- `createdAt`, `updatedAt` — `DateTime` timestamps (`createdAt` defaults to now, `updatedAt` uses Prisma `@updatedAt`).
- `sessionId` — required FK to `Session.id`; relation `session`.
- Indexes:
  - `@@index([sessionId])`.
  - `@@index([sessionId, occurredAt(sort: Desc)])`.

**`RuleSeverity` enum**

- `LOW`, `MEDIUM`, `HIGH`.

**`RuleType` enum**

- `BLOCKED_WEBSITE`, `AFTER_HOURS`.

**`Rule`**

- `id` — `String`, UUID primary key.
- `name` — `String`, `VarChar(255)`.
- `description` — optional `String`, `Text`.
- `type` — `RuleType`.
- `severity` — `RuleSeverity`.
- `config` — `Json` (JSONB), type-specific shape enforced in application code.
- `active` — `Boolean`, default `false` in the database schema.
- `createdAt`, `updatedAt` — `DateTime` (`@updatedAt` on `updatedAt`).

## Migration timeline

Chronological order (folder names under `apps/api/prisma/migrations/`):

1. **`20260323085251`**
   - Creates `Employee` with columns as above.
   - Unique index `Employee_email_key` on `"email"`.

2. **`20260324190713_add_session_entity`**
   - Creates enum `SessionStatus` (`ACTIVE`, `ENDED`).
   - Creates `Session` with FK `Session_employeeId_fkey` → `Employee(id)` **`ON DELETE RESTRICT`**, **`ON UPDATE CASCADE`**.
   - Non-unique index `Session_employeeId_startedAt_idx` on `("employeeId", "startedAt" DESC)`.

3. **`20260324190909_add_session_active_partial_unique`** (manual SQL migration)
   - Partial unique index `Session_employeeId_active_partial_key` on `"Session"("employeeId")` **`WHERE "status" = 'ACTIVE'`** — enforces at most one active session per employee at the database level.

4. **`20260326101834_add_activity_event_model_and_relations`**
   - Creates enum `ActivityEventType` (`APP`, `WEB`, `FILE`, `KEYSTROKE_SUMMARY`).
   - Creates `ActivityEvent` with:
     - `"id"` primary key.
     - `"type"` enum.
     - `"metadata"` JSONB.
     - `"occurredAt"` timestamp.
     - `"createdAt"` default `CURRENT_TIMESTAMP`.
     - `"updatedAt"` timestamp.
     - `"sessionId"` FK → `Session(id)` with `ON DELETE RESTRICT` and `ON UPDATE CASCADE`.
   - Adds indexes:
     - `ActivityEvent_sessionId_idx` on `"ActivityEvent"("sessionId")`.
     - `ActivityEvent_sessionId_occurredAt_idx` on `"ActivityEvent"("sessionId", "occurredAt" DESC)`.

5. **`20260328192853_add_rules_model`**
   - Creates enums `RuleSeverity`, `RuleType`.
   - Creates `Rule` with `name`, optional `description`, `type`, `severity`, `config` JSONB, `active` default `false`, timestamps, primary key on `id`.

## Constraints and indexes

| Artifact                                 | Type                 | Notes                                                                            |
| ---------------------------------------- | -------------------- | -------------------------------------------------------------------------------- |
| `Employee_pkey`                          | Primary key          | `id`                                                                             |
| `Employee_email_key`                     | Unique               | Global unique email                                                              |
| `Session_pkey`                           | Primary key          | `id`                                                                             |
| `Session_employeeId_fkey`                | Foreign key          | `RESTRICT` on delete, `CASCADE` on update                                        |
| `Session_employeeId_startedAt_idx`       | Index                | Supports `employeeId` + `startedAt DESC` queries                                 |
| `Session_employeeId_active_partial_key`  | Partial unique index | One row per `employeeId` when `status = ACTIVE`                                  |
| `ActivityEvent_pkey`                     | Primary key          | `id`                                                                             |
| `ActivityEvent_sessionId_fkey`           | Foreign key          | `RESTRICT` on delete, `CASCADE` on update                                        |
| `ActivityEvent_sessionId_idx`            | Index                | Supports filtering by `sessionId`                                                |
| `ActivityEvent_sessionId_occurredAt_idx` | Index                | Supports filtering by `sessionId` and range queries ordered by `occurredAt` DESC |
| `Rule_pkey`                              | Primary key          | `id`                                                                             |

**Prisma vs database:** The partial unique index on sessions exists **only in SQL**; it does **not** appear as `@@unique` on `model Session` in `schema.prisma`. Operators should treat migrations + Postgres as authoritative for that invariant.

## Operational notes

- **Deleting an employee** with existing sessions will fail at the database while FK is `ON DELETE RESTRICT`, unless sessions are removed or the schema changes. The API does not expose employee delete today; this still matters for manual data maintenance.
- **Deleting a session** with existing activity events will fail at the database while FK is `ON DELETE RESTRICT`, unless activity events are removed or the schema changes. The API does not expose session delete today; this still matters for manual data maintenance.
- **`updatedAt`** is maintained by Prisma (`@updatedAt`); direct SQL writes bypassing the client could leave it inconsistent.
- **`Rule`** has no foreign keys to employees or sessions; rules are global configuration until a future schema ties them to tenants or users.
