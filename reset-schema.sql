-- RESET: Dropa tudo e recria do zero (SEGURO para banco vazio)
DROP TABLE IF EXISTS tenant."AuditLog" CASCADE;
DROP TABLE IF EXISTS tenant."Fingerprint" CASCADE;
DROP TABLE IF EXISTS tenant."Threat" CASCADE;
DROP TABLE IF EXISTS tenant."RequestLog" CASCADE;
DROP TABLE IF EXISTS public."Billing" CASCADE;
DROP TABLE IF EXISTS public."ApiKey" CASCADE;
DROP TABLE IF EXISTS public."Tenant" CASCADE;
DROP TYPE IF EXISTS "Severity" CASCADE;
DROP TYPE IF EXISTS "ThreatType" CASCADE;
DROP TYPE IF EXISTS "Verdict" CASCADE;
DROP TYPE IF EXISTS "TenantStatus" CASCADE;
DROP TYPE IF EXISTS "PlanType" CASCADE;

-- Enums
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'BUSINESS', 'ENTERPRISE');
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "Verdict" AS ENUM ('ALLOW', 'BLOCK', 'CHALLENGE');
CREATE TYPE "ThreatType" AS ENUM ('SQL_INJECTION', 'NOSQL_INJECTION', 'XSS', 'COMMAND_INJECTION', 'PATH_TRAVERSAL', 'SSRF', 'DLP_EXFILTRATION', 'RATE_LIMIT_VIOLATION', 'BEHAVIORAL_ANOMALY', 'HONEYPOT_TRIGGER', 'PROMPT_INJECTION');
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Tenant
CREATE TABLE public."Tenant" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  plan "PlanType" NOT NULL DEFAULT 'FREE',
  status "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ApiKey
CREATE TABLE public."ApiKey" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL REFERENCES public."Tenant"(id),
  "keyHash" TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  "lastUsed" TIMESTAMPTZ,
  "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_apikey_tenant ON public."ApiKey"("tenantId");

-- Billing
CREATE TABLE public."Billing" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT NOT NULL UNIQUE REFERENCES public."Tenant"(id),
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "currentPeriodStart" TIMESTAMPTZ,
  "currentPeriodEnd" TIMESTAMPTZ,
  "usageInspects" INTEGER NOT NULL DEFAULT 0,
  "usageHoneypots" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RequestLog
CREATE TABLE tenant."RequestLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}',
  body JSONB,
  "sourceIp" TEXT NOT NULL,
  "userAgent" TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  "riskScore" DOUBLE PRECISION NOT NULL,
  verdict "Verdict" NOT NULL,
  "threatType" TEXT,
  "incidentId" TEXT UNIQUE,
  "latencyMs" DOUBLE PRECISION NOT NULL
);
CREATE INDEX idx_reqlog_timestamp ON tenant."RequestLog"(timestamp);
CREATE INDEX idx_reqlog_fingerprint ON tenant."RequestLog"(fingerprint);
CREATE INDEX idx_reqlog_risk ON tenant."RequestLog"("riskScore");
CREATE INDEX idx_reqlog_verdict ON tenant."RequestLog"(verdict);
CREATE INDEX idx_reqlog_incident ON tenant."RequestLog"("incidentId");

-- Threat
CREATE TABLE tenant."Threat" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "incidentId" TEXT NOT NULL UNIQUE,
  "requestId" TEXT NOT NULL,
  type "ThreatType" NOT NULL,
  severity "Severity" NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  payload JSONB,
  remediation JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "resolvedAt" TIMESTAMPTZ
);
CREATE INDEX idx_threat_created ON tenant."Threat"("createdAt");
CREATE INDEX idx_threat_type ON tenant."Threat"(type);

-- Fingerprint
CREATE TABLE tenant."Fingerprint" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "identityId" TEXT NOT NULL UNIQUE,
  baseline JSONB NOT NULL DEFAULT '{}',
  "lastSeen" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "anomalyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_fingerprint_identity ON tenant."Fingerprint"("identityId");

-- AuditLog
CREATE TABLE tenant."AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  action TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  resource TEXT NOT NULL,
  changes JSONB,
  ip TEXT NOT NULL,
  "userAgent" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_created ON tenant."AuditLog"("createdAt");
CREATE INDEX idx_audit_actor ON tenant."AuditLog"("actorId");
