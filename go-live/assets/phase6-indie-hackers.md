# Fase 6 — Indie Hackers Post

## Post

**Title:** How I stopped worrying about API attacks after building a behavioral AI sentinel

**Body:**

Hey IH,

I'm [Seu Nome], solo founder of Sentinel AI. I built this because my previous SaaS got attacked by a bot that spent 8 hours mapping my API — and my WAF never noticed.

**The problem:** WAFs use static rules. APIs have behaviors. Static rules can't detect behavioral anomalies.

**The solution:** AI that learns what "normal" looks like for your API, then flags deviations.

**What I built in 60 days:**
- NestJS proxy + Next.js dashboard + PostgreSQL + Redis
- 4-layer AI ensemble (heuristic + ML + fingerprinting + LLM)
- Self-serve billing with Stripe
- Open-source SDK (npm install sentinel-ai)

**Stack:** Node.js, TypeScript, Prisma, Tailwind, shadcn/ui, OpenAI, Stripe.

**Pricing:** Free (1K requests/mo), Pro ($49/mo), Business ($199/mo), Enterprise ($499/mo).

**What I learned:**
- Devs won't use security tools that require configuration
- "Zero-config" is the only way to get adoption
- Behavioral AI beats static rules for API security
- Solo founders can build enterprise-grade security tools

**Current status:**
- Product launched today
- 0 paying customers (yet)
- Looking for first 10 users to validate

If you have an API in production and want a free security audit, drop your URL. I'll run a behavioral analysis and share the report.

https://sentinel-ai.app

Questions? Ask me anything — technical, pricing, GTM, solo founder life.
