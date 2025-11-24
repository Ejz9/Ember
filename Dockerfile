FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS runner
WORKDIR /app

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && apk update \
    && apk add --no-cache scc

COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]