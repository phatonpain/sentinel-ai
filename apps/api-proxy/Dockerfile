FROM node:20-alpine
WORKDIR /app

# Instala dependências do monorepo (workspace root + api-proxy)
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY apps/api-proxy/package*.json ./apps/api-proxy/
COPY packages ./packages
COPY tsconfig*.json ./

# Instala pnpm e dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o restante do código
COPY apps/api-proxy ./apps/api-proxy

# Build do app
RUN cd apps/api-proxy && npm run build

# Verificação explícita — falha o build se o DTO não estiver presente
RUN ls -la /app/apps/api-proxy/dist/modules/inspector/dto/
RUN test -f /app/apps/api-proxy/dist/modules/inspector/dto/inspect-request.dto.js

EXPOSE 3000
CMD ["node", "apps/api-proxy/dist/main.js"]
