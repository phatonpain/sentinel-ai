# Sentinel AI — Runbooks

## How to Scale Horizontally
1. Increase NestJS API Proxy replicas in Kubernetes.
2. Enable Redis Cluster for distributed rate limiting and sessions.
3. Partition RequestLog by month + tenant in PostgreSQL.
4. Offload analytics to ClickHouse for time-series queries.
5. Use CDN (Cloudflare) for edge caching of ALLOW decisions.

## How to Recover from Disaster
1. **Database failure**: Promote read replica, update DNS/connection string.
2. **Redis failure**: Fallback to in-memory LRU cache (lower precision, no downtime).
3. **ML service failure**: Heuristic engine runs locally without ML. System degrades gracefully.
4. **OpenAI failure**: Circuit breaker opens. Fallback to Claude. Final fallback: heuristics only.
5. **Complete region failure**: Activate multi-region Kubernetes cluster. Restore from S3 backups.

## How to Investigate a False Positive
1. Get `incidentId` from customer or logs.
2. Query `GET /v1/threats/:incidentId` for forensics.
3. Review timing breakdown: which layer flagged it?
4. Check behavioral fingerprint: was there a baseline shift?
5. If confirmed false positive: mark in dashboard UI → triggers feedback loop.
6. Temporarily add source IP / identity to whitelist while model recalibrates.

## How to Rotate Secrets
1. HashiCorp Vault: trigger dynamic secret rotation.
2. Kubernetes: update Secret object, pods auto-reload via restart.
3. API Keys: generate new key, update consumers, revoke old key after grace period.
4. JWT Secret: rotate with dual-validation window (accept old + new for 1 hour).

## Performance Targets
- P50 inspect latency: <10ms (heuristic) | <50ms (ML) | <150ms (LLM)
- P99 inspect latency: <100ms (heuristic) | <200ms (ML) | <500ms (LLM)
- Throughput: 10,000 req/s per instance (NestJS cluster mode)
- Availability: 99.99% (paid SLA)
