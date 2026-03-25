## Purpose

This folder holds **backend decision and behavior documentation** for the NestJS API (`apps/api`): what the employees and sessions domains do today, how they interact with PostgreSQL, and how that relates to the product specs. Audience: engineers working on or integrating with the API.

## Contents

- [employees.md](employees.md) — Employees domain (create, list, get).
- [sessions.md](sessions.md) — Work sessions (start, end, list by employee, get by id).
- [schema-and-migrations.md](schema-and-migrations.md) — Prisma models and migration history for employee/session persistence.

## Source of truth and precedence

- **Implemented behavior** is defined by **`apps/api`** source (controllers, services, DTOs, `main.ts`), **`apps/api/prisma`** (`schema.prisma` and `migrations/**/*.sql`), and shared API types in **`packages/contracts`**.
- **Product vision** lives in [docs/specs/SPEC.md](../specs/SPEC.md) and [docs/specs/ITERATION_1_SPEC.md](../specs/ITERATION_1_SPEC.md). Those documents describe intent and the wider platform; they can mention endpoints or entities that are not implemented yet.
- If a narrative document (including SPEC or `apps/api/README.md`) **conflicts** with what the running code does, **controllers plus the “Implemented behavior” sections in this folder** describe what runs today.

## Keeping docs up to date

After you change the API or shared contracts for these domains, invoke the project skill **`backend-decisions-docs`** (see [.cursor/skills/backend-decisions-docs/SKILL.md](../../.cursor/skills/backend-decisions-docs/SKILL.md)) so `docs/backend/` stays aligned with `apps/api/**` and `packages/contracts/**`.
