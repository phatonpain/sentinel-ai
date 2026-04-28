# Fase 3 — Product Hunt Launch

## Postagem

**Title:** Sentinel AI

**Tagline:** Your API's immune system — AI-powered security that learns your normal to block the abnormal

**Category:** Developer Tools

**Topics:** API, Security, AI, DevTools, SaaS

**Descrição:**

APIs are the new perimeter. But WAFs use static rules that break with every deploy, generate false positives that frustrate users, and miss attacks they've never seen before.

Sentinel AI is different. It's an AI-native API security platform that learns what "normal" looks like for your API — so it can spot the abnormal before it becomes a breach.

**How it works:**
1. Install: npm install sentinel-ai (2 lines of code)
2. Learn: Our behavioral AI builds a fingerprint of your API's normal traffic patterns
3. Detect: 4-layer ensemble scores every request in <50ms
4. Block: Zero-day attacks, SQL injection, XSS, SSRF, data exfiltration
5. Remediate: Auto-actions (IP ban, secret rotation, Slack alerts)

**What you get:**
- Real-time threat dashboard with forensics
- DLP engine for sensitive data (PII, health records, API keys)
- Honeypot auto-deployment
- Compliance reports (SOC2, GDPR, HIPAA) in 1 click
- Self-serve pricing: Start free, Pro at $49/mo

**Security-first:**
- Fail-closed: if our service goes down, traffic is blocked
- Multi-tenant isolation with PostgreSQL RLS
- Zero data retention of sensitive payloads

Built by a solo founder who got tired of configuring WAFs that didn't understand APIs.

Perfect for:
- SaaS startups with APIs in production
- Fintech/healthtech handling sensitive data
- Indie hackers who need SOC2 for enterprise customers
- Teams without a dedicated security engineer

Ask me anything — I built the entire stack and I'm here to answer technical questions, pricing feedback, or security architecture debates.

---

## Maker Comment (primeiro comentário)

Hey Product Hunt!

I'm [Seu Nome], solo founder and developer of Sentinel AI. I built this because I was running a SaaS and got attacked by something my WAF never detected — a bot doing slow reconnaissance over 8 hours, mapping every endpoint. By the time I noticed, they had a complete map of my API.

That made me realize: WAFs are great for websites, but terrible for APIs. APIs don't have "pages" — they have behaviors. And behaviors are what AI understands best.

So I spent 60 days building Sentinel AI:
- NestJS proxy + Next.js dashboard + PostgreSQL + Redis
- 4-layer AI ensemble (heuristic + ML + behavioral + LLM)
- Self-serve billing with Stripe
- Open-source SDK

The hardest part? Making it "zero-config" — because devs won't use security tools that require a PhD to set up. Just npm install and you're protected.

Happy to answer any questions about:
- The AI architecture (how we avoid false positives)
- The security model (fail-closed design)
- Pricing feedback (what's missing?)
- Technical implementation (NestJS, Prisma, OpenAI integration)

Also: if you have an API in production and want a free security audit (behavioral analysis), drop your URL in the comments. I'll run a quick scan and share the results.

---

## Upvote Strategy

- **Hora 0** (00:01 PST / 04:00 BRT): Postar. Compartilhar no Twitter pessoal.
- **Hora 1-2**: Responder TODOS os comentários em <10 minutos.
- **Hora 3**: Compartilhar no LinkedIn pessoal.
- **Hora 4**: Mandar link para 5 amigos devs pedindo upvote honesto.
- **Hora 6**: Compartilhar no Indie Hackers, r/SaaS.
- **Dia 2**: Compartilhar no Discord Reactiflux, Node.js Discord.
