# Monorepo Template

A source-only pnpm workspace with three independently runnable applications:

- `apps/api`: Hono API on Node.js, with Better Auth and Drizzle.
- `apps/web`: React, Vite, TanStack Router, and TanStack Query.
- `apps/worker`: BullMQ processors and worker lifecycle.

Use Node.js 24 or newer and the pnpm version declared in `package.json`.

## Ownership and boundaries

| Package            | Owns                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `@repo/contracts`  | Browser-safe request, response, error, and job schemas; types inferred from those schemas |
| `@repo/api-client` | Hono RPC client, inferred request/session types, and response handling                    |
| `@repo/config`     | Shared environment parsing primitives and database URL defaults                           |
| `@repo/db`         | Drizzle database factory, persistence schema, and committed migrations                    |
| `@repo/queue`      | Queue producers and connection factories; configuration comes from callers                |
| `@repo/storage`    | S3-compatible storage factories accepting explicit configuration                          |
| `@repo/ui`         | Visual components, styles, and presentation controls                                      |

Packages expose source files through their `exports` maps and have no build step. Declare workspace dependencies in each consumer's `package.json`; there are no global TypeScript aliases bypassing package resolution. Repeated third-party dependency versions live in the catalog in `pnpm-workspace.yaml`.

Applications own environment schemas and startup. Library imports do not read environment variables or start application services. The API's `main.ts` parses configuration and starts the server, which creates resources and passes dependencies to `createApp`, auth, and feature services. The worker follows the same pattern. Shutdown handlers drain the HTTP server/database pool or worker. Startup and failure messages use the standard console. The frontend uses plain English text and a theme selector.

`pnpm check:boundaries` uses Oxlint to reject undeclared workspace imports, application imports, and server dependencies in browser packages. The API client has one explicit exception: a type-only import of `@repo/api/types` for Hono RPC inference. Schema foundations cannot depend on other workspace packages. Always use public exports for cross-package dependencies.

## Schema-first feature development

1. Define the public request and response schemas under `packages/contracts/src/<feature>.ts`.
2. Infer types from the schema. Distinguish raw schema input from normalized output when transformations are involved.
3. Validate requests in the API router and pass parsed values to the feature service.
4. Select public fields explicitly and serialize database dates to ISO strings in responses. Keep database records and auth session users separate from public DTOs.
5. Reuse request validation in the frontend feature; show validation messages.
6. Use Hono RPC inference in the client instead of copying request interfaces. Validate custom response payloads at the client boundary.

The profile feature demonstrates the full flow. Omitting `image` preserves the stored image; an empty string or `null` clears it. Profile responses and user-list responses preserve nullable roles. Better Auth remains the owner of auth session types and sign-in/sign-up behavior.

API features live in `apps/api/src/modules`. Frontend features live in `apps/web/src/features`; route files compose them. Authentication owns session queries and sign-in/sign-out. Profile owns profile mutations. Cache keys live in `query-keys.ts`; `schema.ts` names are reserved for schemas.

## Setup and development

```sh
pnpm install
cp .env.example .env
docker compose -f docker-compose.dev.yaml up -d
pnpm db:migrate
pnpm dev
```

`pnpm dev` starts API, web, and worker. Run an individual application with:

```sh
pnpm --filter @repo/api dev
pnpm --filter @repo/web dev
pnpm --filter @repo/worker dev
```

Local services:

- Web: `http://localhost:3000`
- API health: `http://localhost:8000/health`
- PostgreSQL: `localhost:15432`
- Redis: `localhost:16379`

Application configuration lives in each application's `src/config.ts`. The root `.env` is loaded by API/worker scripts and Vite. `pnpm check:env` checks `.env.example` against the application schemas and Compose variable names. Add new environment variables to both the owning schema and the example file.

## Validation

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

`check` runs package boundary validation, environment documentation validation, Oxlint, and Oxfmt. `check:fix` applies lint fixes and formatting. `build` produces the web bundle; the API and worker execute TypeScript directly with `tsx` and are validated through `typecheck`.

Tests cover shared contracts/configuration, API routing, database/auth integration, web configuration, and worker payload validation. Database integration tests apply committed migrations to PGlite and inject that database into auth and services; no configured PostgreSQL connection is required.

Generated route files and database migration artifacts are excluded from formatting. Existing third-party UI components retain their regular lint exclusion, but package boundary checks include them.

## Database

Persistence tables are defined in `packages/db/src/schema.ts`. SQL migrations and schema snapshots are committed in `packages/db/drizzle`.

```sh
pnpm db:generate  # Generate a migration after changing the persistence schema
pnpm db:migrate   # Apply committed migrations
pnpm db:studio
```

Review generated SQL before applying it. `pnpm db:deploy` applies migrations during container startup; `pnpm db:push` synchronizes a disposable local database directly. Prefer migrations for a database you intend to keep.

`createDatabase(connectionString)` returns `{ db, pool }`. Runtime composition owns the instance and closes the pool. Import persistence tables from `@repo/db/schema`; public API schemas belong in `@repo/contracts`.

## Authentication and API client

Better Auth is mounted at `/api/auth/*`; custom routes include `/session`, `/profile`, and `/users`. Session loading runs only for routes that need it; `/health` does not perform an auth lookup.

Use Better Auth client methods for sign-in, sign-up, and sign-out, and `createApiClient()` from `@repo/api-client` for custom routes. The web app configures both clients in `src/api.ts` using validated `VITE_API_URL`.

Configure `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CLIENT_ORIGINS`. Production rejects the development secret and secrets shorter than 32 characters. Allowed origins must be comma-separated HTTP(S) origins without paths.

```sh
pnpm createsuperuser
```

## Queue jobs

Queue names, payload schemas, and result schemas live in `@repo/contracts/jobs`. The producer validates payloads before enqueueing, and the worker validates Redis job data before processing it.

```ts
import { createExampleQueue, createQueueConnection } from "@repo/queue";

const queue = createExampleQueue(createQueueConnection(redisUrl));
try {
  await queue.add({ message: "hello" });
} finally {
  await queue.close();
}
```

Processors live in `apps/worker/src/processors`. The worker owns logging, event handlers, and shutdown; queue factories do not parse environment variables or start workers.

## Storage

`@repo/storage` provides S3-compatible primitives. It is not wired into an application by default. When adding uploads, define storage environment fields in that application and pass its validated configuration to `createStorage`.

```ts
import { createStorage } from "@repo/storage";

const storage = createStorage({
  accessKeyId: "access-key",
  bucket: "uploads",
  forcePathStyle: false,
  region: "ap-southeast-1",
  secretAccessKey: "secret-key",
});
await storage.putObject({ key: "uploads/example.txt", body: "hello", contentType: "text/plain" });
```

## Docker

```sh
cp .env.example .env
# Put a unique BETTER_AUTH_SECRET in .env, for example from:
openssl rand -base64 32
docker compose up --build
```

Production Compose runs the API and PostgreSQL, applies committed migrations, and exposes the API on port 8000. Override `API_HOST_PORT` to change the host port. The worker runs separately; development Compose supplies Redis.

## Cloudflare web deployment

The web application deploys as a Cloudflare Worker with static assets and SPA fallback.

```sh
pnpm --filter @repo/web exec wrangler login
pnpm --filter @repo/web preview:cloudflare
VITE_API_URL="https://api.example.com" pnpm deploy:web
```

The Worker name is `monorepo-template-web`. Configure its custom domain in Cloudflare, then set `BETTER_AUTH_URL=https://api.example.com` and `CLIENT_ORIGINS=https://app.example.com` in the API environment.
