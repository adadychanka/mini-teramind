## Product context (vision)

The platform treats an **employee** as a monitored person whose activity is tracked over time (sessions, events, rules, analytics). That framing is described in [docs/specs/SPEC.md](../specs/SPEC.md) (e.g. conceptual Employee entity and employees/sessions flows). This file documents **only** what the API implements for employee records today.

## Implemented behavior

### API surface

| Method | Path | Body / query | Success response |
|--------|------|--------------|------------------|
| `POST` | `/employees` | JSON body: `name`, `email`, optional `department` | Single `EmployeeDto` (`201` implied by create; controller returns body as created resource per Nest convention) |
| `GET` | `/employees` | Query: `page`, `limit` (required by `PaginationQueryDto`) | `PaginationOutputDto<EmployeeDto>`: `{ items, total, hasNextPage }` — `items` ordered by `createdAt` **descending** (newest first) |
| `GET` | `/employees/:id` | Path: `id` | Single `EmployeeDto` |

Types: `@repo/contracts` (`EmployeeDto`, `CreateEmployeeDto`, `PaginationOutputDto`, `PaginationInputDto`).

### Validation and errors

- **Global pipe** (`apps/api/src/main.ts`): `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `forbidUnknownValues`, `transform: true`.
- **Create body** (`CreateEmployeeDto`): `name` — string, not empty, max 255; `email` — email, not empty; `department` — optional string, max 255.
- **List query** (`PaginationQueryDto`): `page` ≥ 1, `limit` between 1 and `MAX_PAGINATION_LIMIT` (1000), coerced to numbers.
- **Errors**:
  - Duplicate email (unique constraint on `email`): **409** `ConflictException` — message `Employee with this email already exists` when Prisma reports a unique violation on `email`; other unique violations → **409** with `Unique constraint violation`.
  - Unknown id on get: **404** `NotFoundException` — `Employee not found`.
- **Path param `id`**: Not validated as UUID by a dedicated pipe; any string is passed to `findUnique`.

### Persistence

Employees are stored in the `Employee` table. Constraints and migration history: [schema-and-migrations.md](schema-and-migrations.md). **Email is normalized** before insert (`trim` + lowercase) so uniqueness is case-insensitive in practice.

### Mapping and contracts

- `EmployeesService` maps Prisma `Employee` rows to `EmployeeDto` via `toEmployeeDto` (`employees.mapper.ts`).
- `department` is emitted as `null` when absent (not `undefined`).
- `createdAt` and `updatedAt` are ISO 8601 strings.

### Edge cases and known limitations

- **List ordering**: `findAll` uses `orderBy: { createdAt: 'desc' }`, so pagination order is **stable** for a given dataset (newest employees first). Rows that share the same `createdAt` may still appear in database-defined order within that tie.
- **No update/delete** endpoints for employees in the current codebase.
- Service defaults: `findAll` uses `page = 1` and `limit = DEFAULT_EMPLOYEES_PER_PAGE` (100, from shared pagination limits) if fields were ever missing; HTTP layer still requires valid query DTO.
