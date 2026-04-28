# Fase 5 — Twitter/X Thread (10 Tweets)

**Tweet 1/10**

I spent 60 days building an AI-powered API security tool.

Not because I'm a security expert.

Because I got attacked and my WAF never noticed.

Here's the story + what I learned 🧵

---

**Tweet 2/10**

My previous SaaS had a WAF, rate limiting, the basics.

One day I checked logs and found:
- 1 request every 73 seconds for 8 hours
- Same IP, rotating user agents
- Mapping every endpoint systematically

My WAF? Silent. Because it was "too slow" to trigger rules.

---

**Tweet 3/10**

That attack taught me: WAFs are cat-and-mouse.

You write regex. They encode and bypass.
You block IPs. They use residential proxies.
You rate limit. They distribute across 100 IPs.

Static rules can't win against adaptive attackers.

---

**Tweet 4/10**

The insight: APIs have BEHAVIORS, not just endpoints.

POST /api/login normally looks like:
- 2 JSON keys (email, password)
- 80-150 bytes
- 200-800ms between requests
- Always preceded by GET /api/login

An attack looks different. AI can learn the difference.

---

**Tweet 5/10**

So I built a 4-layer AI ensemble:

Layer 1: Heuristic (<1ms) — obvious attacks, instant block
Layer 2: Fingerprinting (<5ms) — statistical baseline per user
Layer 3: ML (<10ms) — Isolation Forest anomaly detection
Layer 4: LLM (50-100ms) — semantic analysis of complex payloads

Anti-dilution: final score = MAX of all layers. Never average.

---

**Tweet 6/10**

The hardest part wasn't the AI.

It was making it "zero-config."

Because devs won't use security tools that require:
- Writing regex
- Maintaining IP lists
- Reading 50-page docs
- Hiring a security engineer

So: npm install sentinel-ai. 2 lines. Done.

---

**Tweet 7/10**

What I built:
- NestJS proxy + Next.js dashboard
- PostgreSQL + Redis + OpenAI
- Self-serve Stripe billing
- Fail-closed architecture
- Open-source SDK

All by one person. In 60 days.

---

**Tweet 8/10**

Results so far:
- 99.2% precision, 0.3% false positives
- <50ms overhead per request
- Detects zero-day attacks (no signature needed)
- $49/mo for Pro, start free

Not bad for a solo founder with a laptop.

---

**Tweet 9/10**

If you have an API in production, try it:

https://sentinel-ai.app

Or read the technical deep dive:
[link do Dev.to]

I read every comment and DM. Let's talk security architecture.

---

**Tweet 10/10**

If you're building a SaaS and ignoring API security because "we're too small" — that's exactly when attackers target you.

Small team = no security engineer = easy target.

Fix it before it fixes you.

https://sentinel-ai.app

---

RT the first tweet to share the thread 🙏
