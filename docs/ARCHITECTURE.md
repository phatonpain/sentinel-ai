# Sentinel AI — Architecture

## Overview
Sentinel AI is an AI-Native Application Security Platform. It operates as:
1. SDK npm (`sentinel-ai`) — drop-in middleware for Node.js/Next.js/NestJS
2. Intelligent Reverse Proxy — deploy as Docker sidecar or standalone service
3. Edge Worker — compatible with Cloudflare Workers / Vercel Edge
4. SaaS Dashboard — analytics, forensics, compliance, threat intel

## Philosophy (Non-Negotiable)
- **Security-First**: every line assumes the attacker is already inside
- **Zero-Trust**: never trust input, timestamp, IP, header, or token without multi-layer validation
- **Defense in Depth**: 3+ protection layers per attack vector
- **Fail-Closed**: if the AI system goes down, default is BLOCK (not pass-through)
- **Observability-First**: every security event is logged, traced, and correlated
- **Privacy-by-Design**: sensitive data is tokenized/anonymized before AI processing

## Component Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Web App    │     │ Mobile App  │     │ 3rd Party   │
│  (Next.js)  │     │(React Native│     │ API Consumer│
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
              ┌─────────────────────────┐
              │ SENTINEL PROXY / SDK    │
              │ • Parse → Normalize →   │
              │   Fingerprint → Score → │
              │   Decide                │
              │ • BLOCK: 403/429 +      │
              │   incidentId            │
              │ • PASS: forward +       │
              │   security headers      │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   ANALYSIS ENGINE       │
              │ ┌─────────┐ ┌─────────┐ │
              │ │Heuristic│ │ML       │ │
              │ │Engine   │ │Ensemble │ │
              │ │(NestJS) │ │(FastAPI)│ │
              │ └─────────┘ └─────────┘ │
              │ ┌─────────┐ ┌─────────┐ │
              │ │LLM      │ │Threat   │ │
              │ │Semantic │ │Intel    │ │
              │ │Analyzer │ │Correlator│ │
              │ └─────────┘ └─────────┘ │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   DATA & MESSAGING      │
              │ PostgreSQL │ Redis │    │
              │ ClickHouse │ BullMQ│    │
              └───────────┬─────────────┘
                          ▼
              ┌─────────────────────────┐
              │   DASHBOARD (Next.js)   │
              │ • App Router            │
              │ • shadcn/ui + Tailwind  │
              │ • Realtime WebSocket    │
              │ • Stripe Self-Serve     │
              └─────────────────────────┘
```

## Architectural Pattern
**Clean Architecture + Feature-First**
Each feature is an independent module with:
- `domain/` — entities, value objects, domain services (pure TypeScript, zero external deps)
- `application/` — use cases, DTOs, repository interfaces
- `infrastructure/` — concrete implementations (Prisma, Redis, Stripe, OpenAI)
- `interface/` — controllers, presenters, middlewares

## Multi-Tenancy
Schema isolation per tenant:
- `public` — tenants metadata, billing, global configs
- `tenant_<uuid>` — requests, threats, fingerprints, rules, audit logs

Prisma `multiSchema` preview feature is used. Each tenant gets its own PostgreSQL schema cloned from the template.

## Detection Ensemble (3 Layers)
1. **Heuristic (0-2ms)**: Regex + allowlist/blocklist + known signatures (OWASP CRS adapted)
2. **ML Statistical (2-10ms)**: Isolation Forest + One-Class SVM on behavioral embeddings. Detects unsupervised anomalies.
3. **LLM Semantic (20-100ms)**: GPT-4o-mini / Claude 3.5 Haiku for deep payload analysis (nested JSON, GraphQL, encoded attacks).

## Decision Engine (InspectorEngine v2)
Final score = MAX of all layers (anti-dilution). Never average.
- **Heuristic (0-2ms)**: Regex + signatures. Direct BLOCK if score >= 85. Fast ALLOW if score <= 25 AND fingerprint < 30.
- **Fingerprint (2-5ms)**: Z-score statistical, Markov chain endpoint transitions, embedding similarity (pgvector).
- **ML Local (5-10ms)**: Isolation Forest on 13 features via FastAPI. Circuit breaker if service down.
- **LLM Semantic (50-100ms)**: GPT-4o-mini ONLY when heuristic > 70 or ML/fingerprint anomaly detected. Redis cache (SHA256, TTL 300s). Rate limit 100/min per tenant.

Verdict thresholds:
- `score >= 80` → BLOCK
- `score >= 50` → CHALLENGE
- `score < 50` → ALLOW

## Cost Control
- >90% of traffic: heuristic only → $0
- <5% of traffic: LLM called → ~$0.002/request
- Target: <$50 per 1M requests
- Cost tracking per tenant in Redis + database

## Fail-Closed Behavior
If upstream services (OpenAI, ML service, Redis) are unavailable:
- BLOCK is returned with reason "fail-closed triggered"
- Graceful degradation: heuristics + fingerprint run locally without external deps
- ML circuit breaker: after 5 failures, opens for 30s
- LLM circuit breaker: after 5 failures, opens for 60s
