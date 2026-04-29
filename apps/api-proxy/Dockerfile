# Production Dockerfile — usa dist/ pré-compilado (bypass build quebrado)
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

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
CMD ["node", "dist/main.js"]
