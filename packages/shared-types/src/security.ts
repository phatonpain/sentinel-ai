export type Verdict = 'ALLOW' | 'BLOCK' | 'CHALLENGE';

export type ThreatType =
  | 'SQL_INJECTION'
  | 'NOSQL_INJECTION'
  | 'XSS'
  | 'COMMAND_INJECTION'
  | 'PATH_TRAVERSAL'
  | 'SSRF'
  | 'DLP_EXFILTRATION'
  | 'RATE_LIMIT_VIOLATION'
  | 'BEHAVIORAL_ANOMALY'
  | 'HONEYPOT_TRIGGER'
  | 'PROMPT_INJECTION';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityDecision {
  verdict: Verdict;
  riskScore: number;
  incidentId?: string;
  threatType?: ThreatType;
  confidence: number;
  reasons: string[];
  remediation?: RemediationAction[];
  latencyMs: number;
}

export interface RemediationAction {
  type: 'BLOCK' | 'ROTATE_SECRET' | 'INVALIDATE_TOKEN' | 'ALERT' | 'LOG';
  target?: string;
  metadata?: Record<string, unknown>;
}

export interface RequestContext {
  requestId: string;
  timestamp: string;
  method: string;
  path: string;
  query: Record<string, string | string[]>;
  headers: Record<string, string | string[]>;
  body?: unknown;
  sourceIp: string;
  userAgent: string;
  apiKey?: string;
  tenantId?: string;
  fingerprint?: string;
}

export interface BehavioralProfile {
  identityId: string;
  temporalVector: number[];
  geoVector: number[];
  payloadVector: number[];
  velocityVector: number[];
  graphVector: number[];
  baseline: Record<string, number>;
  lastSeen: string;
  anomalyScore: number;
}
