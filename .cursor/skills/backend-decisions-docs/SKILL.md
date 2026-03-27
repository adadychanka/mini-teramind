---
name: backend-decisions-docs
description: >-
  Sync docs/backend decision docs with the API and contracts. Use when asked to
  update backend decision documentation, refresh docs/backend, or reconcile after
  employees/sessions/prisma/contracts changes. Trigger examples: "update backend
  decision docs", "sync docs/backend with API changes".
---

# Maintain `docs/backend` decision documentation

## Scope (mandatory)

**In scope** — read and use as implementation sources when updating `docs/backend/**/*.md`:

- `apps/api/**` (including `apps/api/src`, `apps/api/prisma`)
- `packages/contracts/**`

**Out of scope** — do **not** infer API behavior from, or expand documentation responsibility to:

- `apps/web/**` or other apps
- `packages/ui/**`, `packages/eslint-config/**`, `packages/typescript-config/**`
- Root tooling (`turbo.json`, etc.) except linking to [docs/local-development.md](../../../docs/local-development.md) when needed
- Frontend-only or design docs

If the user only changed out-of-scope paths, say the skill does not apply unless they provide `apps/api` / `packages/contracts` / `docs/backend` edits—or they explicitly widen scope.

**Product vision only:** You may read [docs/specs/SPEC.md](../../../docs/specs/SPEC.md) and [docs/specs/ITERATION_1_SPEC.md](../../../docs/specs/ITERATION_1_SPEC.md) for wording in **`## Product context (vision)`**. Never treat them as proof something is implemented.

## Source-of-truth order

1. Controllers and services under `apps/api/src/` (routes, status codes, validation wiring).
2. `apps/api/src/main.ts` — global `ValidationPipe`.
3. `apps/api/prisma/schema.prisma` and `apps/api/prisma/migrations/**/*.sql` (read SQL bodies for constraints).
4. `packages/contracts/**` for DTOs, enums, pagination.
5. Specs — vision framing only.

**Do not** trust `git commit` messages or diffs alone: open the files.

## Doc map

| Code / artifacts touched | Update |
|--------------------------|--------|
| `apps/api/src/employees/**` | [docs/backend/employees.md](../../../docs/backend/employees.md) |
| `apps/api/src/sessions/**` | [docs/backend/sessions.md](../../../docs/backend/sessions.md) |
| `apps/api/src/activity-events/**` | [docs/backend/activity-events.md](../../../docs/backend/activity-events.md) |
| `apps/api/prisma/**` | [docs/backend/schema-and-migrations.md](../../../docs/backend/schema-and-migrations.md) + cross-links from domain docs |
| `packages/contracts/**` (employee, session, activity-events, pagination) | Relevant sections in `employees.md` / `sessions.md` / `activity-events.md` |

Do **not** add new domain files under `docs/backend/` for modules that have no doc yet (e.g. `activity-events`) unless the user explicitly asks to expand scope or the file already exists.

## Procedure

1. Read [.cursor/rules/backend-docs-structure.mdc](../../rules/backend-docs-structure.mdc) — preserve required `##` / `###` headings and order.
2. Identify which `docs/backend/*.md` files are affected from the user’s changed paths or from a full rescan of employees + sessions + prisma + contracts.
3. Re-read current implementation; update **only** sections that are wrong or incomplete. Prefer cross-links over duplicating SQL or long SPEC excerpts.
4. Follow [.cursor/rules/docs.mdc](../../rules/docs.mdc): no bloating root `README.md`; keep docs factual.

## Limitations

- **Manual invocation** — this skill does not run on save or git commit by itself.
- **Nx / monorepo graph** is optional context only; API truth is `apps/api` + prisma + contracts.
