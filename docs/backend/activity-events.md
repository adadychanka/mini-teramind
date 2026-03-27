## Product context (vision)
The platform records employee activity over time. An **activity event** is a discrete piece of activity that occurs within a session (for example: visiting a website, using an app, file operations, or keystroke summaries). This framing is described in [docs/specs/SPEC.md](../specs/SPEC.md). This file documents what the API implements today for recording and querying those events.

## Implemented behavior
### API surface

| Method | Path | Body / query | Success response |
|--------|------|--------------|------------------|
| `POST` | `/sessions/:sessionId/events` | JSON body: `type`, `occurredAt`, `metadata` | `ActivityEventDto` |
| `GET` | `/sessions/:sessionId/events` | Query: `page`, `limit`, optional `from`, `to`, `eventType` | `PaginationOutputDto<ActivityEventDto>`: `{ items, total, hasNextPage }` |

Types: `@repo/contracts` (`ActivityEventDto`, `ActivityEventType`, `PaginationOutputDto`).
Implementation uses CQRS (`CommandBus` / `QueryBus`) via `CreateActivityEventHandler` and `FindActivityEventsHandler`.

### Validation and errors

- Global pipe (`apps/api/src/main.ts`): `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `forbidUnknownValues`, `transform: true`.

- Create (`CreateActivityEventDto`)
  - `type`: required, must be a valid `ActivityEventType` enum value.
  - `occurredAt`: required, must be a date-time string (`IsDateString`).
  - `metadata`: required object (`IsObject` + `IsNotEmpty`).

- List (`FindEventsInputDto`)
  - `page` / `limit`: required pagination query params (`PaginationQueryDto`)
    - `page` >= 1
    - `limit` between 1 and `MAX_PAGINATION_LIMIT` (1000)
  - Optional filters:
    - `from`: optional date-time string
    - `to`: optional date-time string
    - `eventType`: optional `ActivityEventType`
  - Date range validation: if both `from` and `to` are provided, the API enforces `from <= to` via `IsDateRangeValid` (`isDateRangeValid` returns true when either side is missing).

- Errors (controller + handlers)
  - Create:
    - Missing session: **404** `NotFoundException('Session not found')`
      - This happens via an explicit `session.findUnique` check.
      - It also happens if the insert hits a foreign key violation (`isForeignKeyConstraintViolationError` → same 404 message).
    - Other persistence/unknown errors are re-thrown and handled by Nest’s default error behavior (typically **500**).
- List:
  - Missing session: **404** `NotFoundException('Session not found')` via explicit `session.findUnique` pre-check in `FindActivityEventsHandler`.
  - Existing session with no matching events: **200** with `{ items: [], total: 0, hasNextPage: false }`.
  - DTO validation failures return **400** (Nest validation pipe).

### Persistence

Activity events are stored in the Prisma model `ActivityEvent` (PostgreSQL table `ActivityEvent`), linked to `Session` via FK `sessionId`. Constraints and migration history: [schema-and-migrations.md](schema-and-migrations.md).

### Mapping and contracts

- `CreateActivityEventHandler` and `FindActivityEventsHandler` map Prisma rows to `ActivityEventDto` via `toActivityEventDto` (`activity-events.mapper.ts`).
- `occurredAt`, `createdAt`, `updatedAt` are returned as ISO 8601 strings (`toISOString()`).
- `metadata` normalization:
  - If `metadata` is a plain object, it is returned as-is.
  - If `metadata` is `null`, a primitive, an array, or otherwise not an object, it is normalized to `{}`.

### Edge cases and known limitations

- List pagination response:
  - `total` is computed via `prisma.activityEvent.count(...)` and represents the total number of matching events (not just the current page size).
  - `hasNextPage` is computed as `page * limit < total`.
- List query stability:
  - The Prisma `findMany` call orders results by `occurredAt` descending; rows with identical `occurredAt` are not further ordered, so pagination stability is not guaranteed for ties.
- Query defaults vs DTO validation:
  - The controller Swagger marks `page` and `limit` as having defaults, but `PaginationQueryDto` requires both fields to be present (they are not `IsOptional()`), so requests that omit them will fail validation.
- Path params: `sessionId` is not UUID-validated at the controller layer; it is used directly in Prisma queries.
- Filter propagation:
  - The controller forwards `from`, `to`, and `eventType` from `FindEventsInputDto` into `FindActivityEventsQuery` payload.
  - `FindActivityEventsHandler` applies these fields in Prisma `where` (`occurredAt` range and `type` equality), so list filters are active as documented.

