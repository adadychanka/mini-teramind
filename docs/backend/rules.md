## Product context (vision)

[docs/specs/SPEC.md](../specs/SPEC.md) describes **rules** as configurable conditions (e.g. blocked sites, after-hours activity) that drive alerts and monitoring. This file documents **only** what the API implements for **creating, listing, and updating** rule records today. Rule **evaluation** (on activity events) is out of scope here until wired in the events pipeline.

## Implemented behavior

### API surface

| Method  | Path         | Body / query                                                                                                                                 | Success response                                                                                                |
| ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `POST`  | `/rules`     | JSON body: `name`, `type`, `severity`, `config`, `active`, optional `description`                                                            | `RuleDto`                                                                                                       |
| `GET`   | `/rules`     | Query: `page`, `limit` (required, `PaginationQueryDto`), optional `active` (`true` / `false`, string coerced in DTO)                         | `PaginationOutputDto<RuleDto>`: `{ items, total, hasNextPage }` — `items` ordered by `createdAt` **descending** |
| `PATCH` | `/rules/:id` | JSON body: partial fields (`name`, `description`, `severity`, `config`, `active`); **`type` is not accepted** (omitted from `UpdateRuleDto`) | `RuleDto`                                                                                                       |

Types: `@repo/contracts` (`RuleDto`, `RuleType`, `RuleSeverity`, `CreateRuleDto`, `UpdateRuleDto`, `PaginationOutputDto`).

Swagger: controller tag `rules`.

### Validation and errors

- **Global pipe** (`apps/api/src/main.ts`): `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `forbidUnknownValues`, `transform: true`.
- **Create** (`CreateRuleDto`): `name` — string, not empty; `description` — optional string; `type` / `severity` — Prisma enums; `config` — non-empty object (shape checked in service); `active` — boolean (`Transform` accepts string `"true"` / `"false"` for JSON bodies if sent as strings).
- **List** (`FindRulesInputDto`): extends `PaginationQueryDto` (`page`, `limit` required with same bounds as other list endpoints); optional `active` filter — when omitted, **no** `active` filter is applied (all rules).
- **Update** (`UpdateRuleDto`): partial of create fields except `type`; same boolean transform for `active` when present.
- **Config validation** (`rule-config-validation/*`, invoked from `RulesService`):
  - **`BLOCKED_WEBSITE`**: `pattern` required, string, trimmed length 3–255, allowed character class, label rules (`*` only as a full dot-separated label).
  - **`AFTER_HOURS`**: `workHours.start` / `workHours.end` — `@IsMilitaryTime()`, `end` after `start` (`IsDateRangeValid`); `timezone` — `@IsTimeZone()` (IANA).
- **Persistence normalization**: for `BLOCKED_WEBSITE`, `normalizeRuleConfig` trims `pattern` before write; stored JSON is the normalized object for that type.
- **Errors**:
  - Invalid config: **400** `BadRequestException` with `{ message: 'Invalid rule configuration', errors: string[] }`.
  - Missing rule on update: **404** `NotFoundException` (`Rule ${id} not found`) after `findUnique`; Prisma `P2025` on update is also mapped to **404**.
  - DTO validation: **400** (validation pipe).

### Persistence

Rules are stored in the `Rule` table (`RuleType`, `RuleSeverity`, JSON `config`). See [schema-and-migrations.md](schema-and-migrations.md). **`active`** defaults to **`false`** at the database when inserting outside the app; the create DTO requires **`active`**, so HTTP-created rules always set it explicitly.

### Mapping and contracts

- `RulesService` maps Prisma rows via `toRuleDto` (`rules.mapper.ts`).
- `description` is optional on `RuleDto`; omitted in JSON when null in DB (`?? undefined`).
- `type` / `severity` map Prisma enums to `@repo/contracts` string enums.
- `config`: if JSON is not a plain object, API maps to `{}` for the response object (defensive).

### Edge cases and known limitations

- **List filter**: omitting query param `active` returns **all** rules; passing `active=true` or `active=false` filters. Swagger may still show optional defaults that differ from “omit means no filter.”
- **Pagination**: `page` / `limit` are **required** on `GET /rules` (same as other `PaginationQueryDto` usages), even if Swagger marks them optional.
- **PATCH without `config`**: `RulesService.update` always runs `validateRuleConfig` with `updateRuleDto.config ?? {}`. Omitting `config` supplies an empty object to validators, which **fails** for both rule types (missing `pattern` / `workHours`). In practice, clients may need to **resend full `config`** on every update, or the service should validate only when `config` is present / merge with stored config before validating.
- **`type` immutability**: enforced by DTO shape (no `type` on update), not by a database trigger.
- **Path param `id`**: not UUID-validated at the controller layer.
- **No `GET /rules/:id`** in the current codebase.
