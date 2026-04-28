# Sentinel AI

> Your API's Immune System

Sentinel AI is an AI-Native Application Security Platform that learns what normal looks like — so it can spot the abnormal before it becomes a breach.

## Monorepo Structure

```
sentinel-ai/
├── apps/
│   ├── dashboard/      # Next.js 14 SaaS dashboard
│   ├── api-proxy/      # NestJS core engine (inspection, shield, ensemble)
│   └── ml-service/     # FastAPI ML ensemble (anomaly detection, embeddings)
├── packages/
│   ├── sdk-node/       # npm: sentinel-ai (Express/Fastify/NestJS middleware)
│   ├── sdk-edge/       # Edge runtime (Cloudflare Workers, Vercel Edge)
│   ├── shared-types/   # Shared TypeScript types & domain models
│   ├── eslint-config/  # Unified ESLint configuration
│   └── ts-config/      # Unified TypeScript configurations
├── infrastructure/
│   ├── docker/         # Dockerfiles + docker-compose.yml
│   ├── k8s/            # Kubernetes manifests (future)
│   ├── terraform/      # IaC AWS/GCP (future)
│   └── traefik/        # Dynamic Traefik config (future)
└── docs/
    ├── ARCHITECTURE.md
    ├── SECURITY.md
    ├── API.md
    └── RUNBOOKS.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Python 3.11 (for ML service)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Start infrastructure
```bash
pnpm docker:up
```
This starts PostgreSQL 16 and Redis 7.

### 3. Configure environment
```bash
cp apps/api-proxy/.env.example apps/api-proxy/.env
# Edit apps/api-proxy/.env with your keys
```

### 4. Run database migrations
```bash
pnpm db:migrate:dev
```

### 5. Start development
```bash
pnpm dev
```
- API Proxy: http://localhost:3001
- Dashboard: http://localhost:3000
- ML Service: http://localhost:8000
- API Docs: http://localhost:3001/api/docs

## SDK Usage

```typescript
import { Sentinel } from 'sentinel-ai';

const sentinel = new Sentinel({
  apiKey: process.env.SENTINEL_API_KEY,
  endpoint: 'https://proxy.sentinel.ai',
  mode: 'block',
  autoRemediate: true,
});

// Express
app.use(sentinel.middleware());

// NestJS
app.useGlobalGuards(sentinel.createGuard());
```

## Philosophy
- **Security-First**: every line assumes the attacker is already inside
- **Zero-Trust**: never trust input, timestamp, IP, header, or token without multi-layer validation
- **Defense in Depth**: 3+ protection layers per attack vector
- **Fail-Closed**: if the AI system goes down, default is BLOCK
- **Observability-First**: every security event is logged, traced, correlated
- **Privacy-by-Design**: sensitive data is tokenized before AI processing

## License
Proprietary — Sentinel AI Inc.
