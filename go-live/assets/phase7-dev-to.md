# Fase 7 — Dev.to Tutorial

## Artigo

**Title:** Building Behavioral AI API Security in Node.js — No Static Rules Required

**Tags:** #security #api #nodejs #ai #nestjs #webdev

---

If you've ever deployed a WAF in front of an API, you know the pain:

- Regex rules break with every payload variation.
- IP blocklists are useless against residential proxies.
- Rate limits punish legitimate users while attackers distribute across 100 IPs.

Static rules don't understand APIs because APIs don't have "pages." They have **behaviors**.

Here's how I built Sentinel AI, a behavioral API security engine that learns your normal traffic and blocks anomalies — with zero static rules.

---

## The Attack That Started It

My previous SaaS had a standard security stack: WAF, rate limiting, Cloudflare.

Then I found this in the logs:

- 1 request every 73 seconds for 8 hours
- Same IP, rotating user agents
- Systematically mapping every endpoint

My WAF was silent. Too slow to trigger any rule.

That bot had a complete map of my API by the time I noticed.

---

## The Insight: APIs Have Behaviors

A normal `POST /api/login` has predictable characteristics:

- 2 JSON keys (`email`, `password`)
- 80-150 bytes payload
- 200-800ms between requests
- Usually preceded by `GET /api/login`

An attack looks statistically different. AI can learn that difference without anyone writing a regex.

---

## Architecture Overview

```
Client → Sentinel Proxy (NestJS) → Your API
              ↓
         4-Layer Ensemble
              ↓
         Block / Allow + Alert
```

**Layer 1 — Heuristic (<1ms):** Obvious attacks (SQLi patterns, XSS payloads) blocked instantly.

**Layer 2 — Behavioral Fingerprinting (<5ms):** Statistical baseline per endpoint per user. Flags deviations in payload size, key count, timing, sequence.

**Layer 3 — ML Anomaly Detection (<10ms):** Isolation Forest trained on your API's historical traffic. Unsupervised — no labels needed.

**Layer 4 — LLM Semantic Analysis (50-100ms):** Complex payloads that evade layers 1-3 are sent to an LLM for semantic threat classification.

**Anti-dilution rule:** Final score = `MAX(layers)`, never average. One strong signal is enough to block.

---

## Zero-Config Middleware

```bash
npm install sentinel-ai
```

```js
const sentinel = require('sentinel-ai');

app.use(sentinel({ apiKey: process.env.SENTINEL_API_KEY }));
```

That's it. The proxy intercepts every request, builds the fingerprint, and returns a verdict in <50ms.

---

## Why This Matters for Solo Founders

Most teams under 10 people don't have a security engineer. They copy-paste OWASP checklists and hope for the best.

Behavioral AI changes the equation:

- No rules to maintain
- No IP lists to update
- No security PhD required
- Blocks zero-day attacks without signatures

If you're handling sensitive data (fintech, healthtech, B2B SaaS), this is the difference between passing a security review and losing an enterprise deal.

---

## Try It

Sentinel AI is live at [https://sentinel-ai.app](https://sentinel-ai.app).

- Free tier: 1,000 requests/mo
- Pro: $49/mo for 100K requests
- Open-source SDK on GitHub

If you have an API in production, drop your URL in the comments. I'll run a free behavioral security audit and share the results.

---

*Built in 60 days by a solo founder who got tired of WAFs.*
