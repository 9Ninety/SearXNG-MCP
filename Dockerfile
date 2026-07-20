FROM oven/bun:1-alpine AS builder
WORKDIR /tmp/build

COPY package.json bun.lockb tsconfig.json ./
COPY src ./src
RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app

COPY --from=builder /tmp/build/package.json bun.lockb ./
COPY --from=builder /tmp/build/dist ./dist
RUN bun install --frozen-lockfile --production

ENTRYPOINT ["bun", "/app/dist/main.js"]
