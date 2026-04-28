# Sentinel AI — Security

## Threat Model (STRIDE)
| Threat | Mitigation |
|--------|------------|
| Spoofing | mTLS between services, API key + JWT auth |
| Tampering | Request signature validation, immutable audit logs |
| Repudiation | Comprehensive audit logging per tenant |
| Information Disclosure | PII masking in logs, tokenization before AI, encrypted backups |
| Denial of Service | 3-layer rate limiting (Edge → Traefik → App), circuit breakers |
| Elevation of Privilege | Tenant schema isolation, RLS, least-privilege API keys |

## Code Security Rules
1. NEVER log sensitive data (tokens, passwords, PII). Use hash + masking.
2. NEVER use `eval()`, `new Function()`, or dynamic code parsing.
3. NEVER trust `x-forwarded-for` without whitelist of known proxies.
4. NEVER expose stack traces in production. Return `incidentId` + generic message.
5. ALWAYS use prepared statements / Prisma (never concatenate SQL).
6. ALWAYS validate and sanitize ALL input with Zod + class-validator.
7. ALWAYS use HTTPS-only cookies (`Secure`, `HttpOnly`, `SameSite=Strict`).
8. ALWAYS implement CSRF protection for non-API mutations.
9. ALWAYS use mTLS between internal services (NestJS ↔ FastAPI).
10. ALWAYS rotate secrets automatically (Vault dynamic secrets).

## Infrastructure Security
1. Network Policies: Kubernetes — default deny, explicit whitelist per pod.
2. WAF L3: Cloudflare / AWS Shield Standard (DDoS protection).
3. DDoS: Rate limiting in 3 layers: Edge (Cloudflare) → Traefik → App (Redis).
4. Backup: PostgreSQL PITR, encrypted backups in S3.
5. Encryption: AES-256 at rest, TLS 1.3 in transit.
6. Secrets: NEVER commit `.env`. Use Vault + Kubernetes secrets injection.

## AI / ML Security
1. Data Sanitization: Tokenize PII before sending to OpenAI (presidio-anonymizer).
2. Prompt Injection Defense: Validate that AI output doesn't contain malicious instructions.
3. Model Isolation: ML service runs in separate container, no access to main database (API only).
4. Adversarial Robustness: Test if small payload mutations fool the model (evasion testing).

## Incident Response Process
1. Alert triggered → Auto-remediation (block + notify + rotate)
2. Human review via dashboard forensics timeline
3. If false positive → mark in UI → feedback loop retrains model
4. If true positive → generate incident report + compliance artifact

## Bug Bounty Policy
We operate a responsible disclosure program. Reports to security@sentinel.ai.
Scope: api.sentinel.ai, dashboard, SDK packages. Exclusions: social engineering, physical attacks.
