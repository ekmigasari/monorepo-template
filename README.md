# Monorepo Template

A source-only pnpm workspace with a Hono API, React web app, and BullMQ worker.

```text
apps/       api, web, worker
packages/   contracts, api-client, config, db, queue, storage, ui
docs/       working guides and decision records
```

Requires Node.js 24+ and the pnpm version declared in `package.json`.

## Quick start

```sh
pnpm install
cp .env.example .env
docker compose -f docker-compose.dev.yaml up -d
pnpm db:migrate
pnpm dev
```

`pnpm dev` starts all three applications. Open the web app at `http://localhost:3000`; the API health endpoint is `http://localhost:8000/health`. Development PostgreSQL and Redis use ports `15432` and `16379`.

To run one application, use `pnpm --filter @repo/api dev`, `pnpm --filter @repo/web dev`, or `pnpm --filter @repo/worker dev`.

## Common commands

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm check`           | Check package boundaries, environment docs, lint, and formatting |
| `pnpm typecheck`       | Check all workspace types                                        |
| `pnpm test`            | Run test suites                                                  |
| `pnpm build`           | Build the web app                                                |
| `pnpm format`          | Apply formatting                                                 |
| `pnpm db:generate`     | Generate a database migration                                    |
| `pnpm db:migrate`      | Apply committed migrations                                       |
| `pnpm createsuperuser` | Create or promote an admin user                                  |

## Working guides

Start with [repository rules](docs/README.md), then read the guide for your change:

- [Backend](docs/backend.md)
- [Frontend](docs/frontend.md)
- [Database](docs/database.md)
- [Contracts](docs/contracts.md)
- [Worker](docs/worker.md)
- [Storage](docs/storage.md)
- [Deployment](docs/deployment.md)

Record architectural choices in [decision records](docs/decision/README.md) using the [template](docs/decision/0000-template.md).
