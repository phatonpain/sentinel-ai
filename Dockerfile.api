# Production Dockerfile — compila no build para garantir código atual
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl postgresql-client

# Copia config do workspace e instala deps
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY apps/api-proxy/package*.json ./apps/api-proxy/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o código fonte e compila
COPY apps/api-proxy/src ./apps/api-proxy/src
COPY apps/api-proxy/prisma ./apps/api-proxy/prisma
COPY apps/api-proxy/tsconfig*.json ./apps/api-proxy/
COPY apps/api-proxy/nest-cli.json ./apps/api-proxy/ 2>/dev/null || true

WORKDIR /app/apps/api-proxy

# Gera Prisma Client e builda
RUN npx prisma generate
RUN npm run build

# Verificação defensiva
RUN test -f /app/apps/api-proxy/dist/modules/inspector/dto/inspect-request.dto.js
RUN test -f /app/apps/api-proxy/dist/modules/billing/billing.controller.js
RUN test -f /app/apps/api-proxy/dist/common/rate-limit.guard.js

EXPOSE 3000
CMD sh -c "psql \"$DATABASE_URL\" -c 'CREATE SCHEMA IF NOT EXISTS tenant;' || true; npx prisma migrate deploy || true; node dist/main.js"
