# Production Dockerfile — usa dist/ pré-compilado (bypass build quebrado)
# CACHE INVALIDATION: 2026-04-29T03:25:00Z
FROM node:20-alpine
ARG CACHE_BUST=202604290326
ENV CACHE_BUST=$CACHE_BUST
WORKDIR /app

RUN apk add --no-cache openssl postgresql-client

# Copia config do workspace e instala deps
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY apps/api-proxy/package*.json ./apps/api-proxy/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o dist/ pré-compilado e o schema Prisma
COPY apps/api-proxy/dist ./apps/api-proxy/dist
COPY apps/api-proxy/prisma ./apps/api-proxy/prisma

WORKDIR /app/apps/api-proxy

# Gera o Prisma Client (necessário em runtime)
RUN npx prisma generate

# Verificação defensiva — falha o build se o DTO não estiver presente
RUN test -f /app/apps/api-proxy/dist/modules/inspector/dto/inspect-request.dto.js

EXPOSE 3000
CMD sh -c "psql \"$DATABASE_URL\" -c 'CREATE SCHEMA IF NOT EXISTS tenant;' && npx prisma db push --accept-data-loss && npx prisma migrate deploy && node dist/main.js"
