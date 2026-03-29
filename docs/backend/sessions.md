## Product context (vision)

[docs/specs/SPEC.md](../specs/SPEC.md) describes **sessions** as a period of activity for an employee and lists intended REST shapes under “Employees & Sessions” (e.g. `POST /employees/:id/sessions`, ending a session by session id). The **implemented** routes and semantics below are the source of truth for the API; SPEC may differ (see API surface).

## Implemented behavior

### API surface

| Method  | Path                              | Body / query                          | Success response                  |
| ------- | --------------------------------- | ------------------------------------- | --------------------------------- |
| `POST`  | `/employees/:employeeId/sessions` | No body; `employeeId` from path       | `SessionDto` (new active session) |
| `GET`   | `/employees/:employeeId/sessions` | Query: `page`, `limit`                | `PaginationOutputDto<SessionDto>` |
| `PATCH` | `/sessions/:id`                   | No body; `id` from path (end session) | `SessionDto`                      |
| `GET`   | `/sessions/:id`                   | Path: `id`                            | `SessionDto`                      |

**Note:** SPEC §3.2.1 lists `PATCH /sessions/:id/end` for ending a session. The implementation uses **`PATCH /sessions/:id`** (no `/end` suffix).

Swagger: employee-scoped routes are tagged `employees`; session id routes are tagged `sessions`.

### Validation and errors

- **Global pipe** (`main.ts`): same as employees module for query/body validation.
- **Start session**: Controller builds `CreateSessionDto { employeeId }` from **`@Param('employeeId')`** only. That object is **not** passed through `class-validator` as a request DTO instance; **`IsUUID()` on `CreateSessionDto` does not run** for this handler path. The service accepts any string id and resolves employee via `findUnique`.
- **List sessions**: `PaginationQueryDto` on query is validated (`page`, `limit`).
- **End session**: Controller builds `UpdateSessionDto` with `id`, `status: ENDED`, and `endedAt: new Date().toISOString()`; persistence uses **`createEndedSession`**, which sets **`endedAt` to `new Date()`** at write time—so the persisted end time is **server clock at update**, not the ISO string on the DTO.
- **Errors**:
  - Missing employee (explicit check or FK): **404** `Employee not found`.
  - Second concurrent active session (DB partial unique on active `employeeId`): **409** `Employee already has an active session`.
  - End: no row with `id` and `status === ACTIVE` — if row exists and is already **ENDED**, service **returns that row** (idempotent end). If id does not exist: **404** `Session ${id} not found`. Unexpected state after failed update: **500** `Failed to end session`.
  - Get session by id, missing: **404** `Session not found`.

### Persistence

Sessions use the `Session` table and FK to `Employee`. **At most one ACTIVE session per employee** is enforced in the database by a **partial unique index** (see [schema-and-migrations.md](schema-and-migrations.md)); not declared as `@@unique` on the Prisma model.

### Mapping and contracts

- Prisma `Session` → `SessionDto` via `sessions.mapper.ts`; Prisma `SessionStatus` enum mapped to `@repo/contracts` `SessionStatus`.
- Timestamps are ISO strings; `endedAt` is `null` while active.

### Edge cases and known limitations

- **One active session per employee**: Enforced by DB; race handling surfaces as **409** on unique violation.
- **End session idempotency**: Calling end again on an already-ended session returns the existing ended session with **200**, not an error.
- **Path params** `employeeId` and session `id` are not UUID-validated at the controller layer.
