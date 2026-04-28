# Sentinel AI — API Specification

## Base URL
```
https://proxy.sentinel.ai/v1
```

## Authentication
All endpoints require `X-Sentinel-Api-Key` header.
Admin endpoints additionally require Bearer JWT.

## Endpoints

### POST /v1/inspect
Inspect a request and return a security verdict.

**Request:**
```json
{
  "context": {
    "requestId": "uuid",
    "timestamp": "2026-04-26T20:00:00Z",
    "method": "POST",
    "path": "/api/users",
    "query": {},
    "headers": { "content-type": "application/json" },
    "body": { "name": "Alice" },
    "sourceIp": "203.0.113.1",
    "userAgent": "Mozilla/5.0..."
  },
  "options": {
    "mode": "block",
    "autoRemediate": true
  }
}
```

**Response:**
```json
{
  "decision": {
    "verdict": "ALLOW",
    "riskScore": 12.5,
    "confidence": 0.95,
    "reasons": [],
    "latencyMs": 15.2
  },
  "forensics": {
    "headersSnapshot": { "content-type": "application/json" },
    "bodyTruncated": "{\"name\":\"Alice\"}",
    "timing": {
      "parseMs": 1.2,
      "heuristicMs": 8.5,
      "mlMs": 4.1,
      "llmMs": 0,
      "totalMs": 15.2
    }
  }
}
```

### GET /v1/threats
List detected threats (paginated, filtered).

**Query params:** `page`, `limit`, `severity`, `type`, `from`, `to`

**Response:**
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

### GET /v1/threats/:id
Get forensic details of a threat.

### GET /v1/fingerprint/:id
Get behavioral profile of an identity.

### POST /v1/honeypot/deploy
Deploy custom honeypot endpoints.

### GET /v1/compliance/report
Generate compliance report (PDF/JSON).

### POST /v1/threats/:incidentId/feedback
Submit feedback on a threat (false positive / true positive).

**Request:**
```json
{
  "isFalsePositive": true,
  "notes": "This was a legitimate admin action",
  "correctedVerdict": "ALLOW"
}
```

**Response:**
```json
{
  "status": "recorded",
  "action": "model_adjusted"
}
```

### GET /v1/fingerprints/:identityId
Get behavioral profile of an identity.

### POST /v1/ml/retrain
Manual retrigger of ML model retraining for a tenant.

## WebSocket Realtime
```
ws://api.sentinel.ai/v1/stream
```
- Auth via JWT in handshake query param `?token=...`
- Heartbeat every 30s
- Automatic reconnection with exponential backoff
- Subscribe: `{"event":"subscribe","data":"tenant-id"}`
- Receive alerts: `{"event":"alert","data":{...}}`

## SDK Interface
```typescript
import { Sentinel } from 'sentinel-ai';
const sentinel = new Sentinel({
  apiKey: process.env.SENTINEL_API_KEY,
  endpoint: 'https://proxy.sentinel.ai',
  mode: 'block',
  autoRemediate: true,
});
app.use(sentinel.middleware());
```
