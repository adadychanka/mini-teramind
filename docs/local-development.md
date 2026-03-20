# Local Development Guide

This guide summarizes how to run the **Mini Teramind** platform locally: database, API, and web app.

## 1. Prerequisites

- Node.js **>= 18**
- npm **>= 10**
- Docker (for PostgreSQL)

From the repo root:

```bash
cd path/to/mini-teramind
```

## 2. Start PostgreSQL (Docker)

The database is defined in `docker-compose.yml`:

- Image: `postgres:16-alpine`
- Default credentials:
  - `POSTGRES_USER=mini_teramind`
  - `POSTGRES_PASSWORD=mini_teramind`
  - `POSTGRES_DB=mini_teramind`

Start it:

```bash
docker compose up -d
```

In case of errors around blocked docker progress on MacOS, check this: https://github.com/docker/for-mac/issues/7520

Optional: check container status:

```bash
docker ps
```

## 3. Install dependencies

Install workspace dependencies once at the repo root:

```bash
npm install
```

This will install all app and package dependencies via npm workspaces and Turborepo.

## 4. Configure environment

### API (`apps/api`)

Create the API `.env` file from the example:

```bash
cp apps/api/.env.example apps/api/.env
```

Defaults:

- `DATABASE_URL=postgresql://mini_teramind:mini_teramind@localhost:5432/mini_teramind`
- `PORT=3001`

You normally do not need to change these for local development.

## 5. Prisma (API)

Prisma is configured in `apps/api/prisma/schema.prisma` and `apps/api/prisma.config.ts`.
Since the schema is intentionally empty while you design entities, you can still
generate the client safely (it will just be empty).

From `apps/api`:

```bash
cd apps/api
npm run db:generate
```

When you add models later:

- `npm run db:migrate:dev` — create + apply dev migrations
- `npm run db:migrate:deploy` — apply migrations in production

## 6. Run the API service

From `apps/api`:

```bash
cd apps/api
npm run dev
```

Or via Turborepo from the root:

```bash
turbo dev --filter=api
```

API endpoints:

- Root: `http://localhost:3001/`
- Health check: `http://localhost:3001/health`
- Swagger UI: `http://localhost:3001/docs`

## 7. Run the web app

From `apps/web`:

```bash
cd apps/web
npm run dev
```

Or via Turborepo:

```bash
turbo dev --filter=web
```

Web UI:

- `http://localhost:3000`

## 8. Common dev workflows

### Linting

From the repo root:

```bash
turbo lint
```

### Type-checking

```bash
turbo check-types
```

### Formatting

```bash
npm run format
```

## 9. Troubleshooting

- **Database connection errors**
  - Ensure Docker is running and `docker compose up -d` succeeded.
  - Check `DATABASE_URL` in `apps/api/.env`.

- **Health check failing** (`/health`)
  - Confirms database and memory indicators; use the JSON response to see which indicator is down.

- **Swagger not loading** (`/docs`)
  - Check API logs for bootstrap errors.
  - Ensure `@nestjs/swagger` is installed and the app started without TypeScript build errors.
