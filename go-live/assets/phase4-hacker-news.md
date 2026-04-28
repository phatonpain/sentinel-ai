# Fase 4 — Hacker News Show HN

## Post

**Title:** Show HN: Sentinel AI — AI-powered API security that learns your normal

**Body:**

I built Sentinel AI after my previous SaaS got attacked by a bot that my WAF never detected. The bot spent 8 hours doing slow reconnaissance — 1 request every 73 seconds — and mapped every endpoint. By the time I noticed, they had a complete API map.

That made me realize: WAFs use static rules (regex, IP blocklists) that are great for websites but terrible for APIs. APIs don't have "pages" — they have behaviors. And behaviors are what AI understands best.

So I spent 60 days building an alternative:

- Behavioral AI that learns your API's normal traffic patterns per endpoint, per user
- 4-layer detection: heuristic (<1ms) + ML (<10ms) + fingerprinting (<5ms) + LLM semantic analysis (50-100ms)
- Zero-config middleware: npm install sentinel-ai (2 lines of code)
- Fail-closed design: if our service goes down, your traffic is blocked — never open
- Self-serve: start free, upgrade to Pro at $49/mo

Tech stack: NestJS, Next.js 14, PostgreSQL 16, Redis, OpenAI, Stripe.

I'm a solo founder, so I built everything — the proxy, the dashboard, the ML microservice, the billing, the docs. Happy to answer technical questions about the architecture, the AI model, or the security design.

If you have an API in production, I'd love feedback. Drop your URL and I'll share a free behavioral security audit.

https://sentinel-ai.app
