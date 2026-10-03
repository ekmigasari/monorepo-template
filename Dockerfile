FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/contracts packages/contracts
COPY packages/config packages/config

RUN pnpm --filter @repo/api typecheck

ENV NODE_ENV=production

EXPOSE 8000

CMD ["pnpm", "--filter", "@repo/api", "start"]
