-- Script idempotente para sincronizar schema do PostgreSQL com Prisma
-- Roda no console SQL do Railway Dashboard

-- ============================================================
-- PUBLIC SCHEMA
-- ============================================================

-- Tenant table
DO $$ BEGIN
  ALTER TABLE public."Tenant" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- ApiKey table
DO $$ BEGIN
  ALTER TABLE public."ApiKey" ADD COLUMN IF NOT EXISTS "keyHash" TEXT NOT NULL DEFAULT '';
END $$;

DO $$ BEGIN
  ALTER TABLE public."ApiKey" ADD COLUMN IF NOT EXISTS scopes TEXT[] NOT NULL DEFAULT '{}';
END $$;

DO $$ BEGIN
  ALTER TABLE public."ApiKey" ADD COLUMN IF NOT EXISTS "lastUsed" TIMESTAMPTZ;
END $$;

DO $$ BEGIN
  ALTER TABLE public."ApiKey" ADD COLUMN IF NOT EXISTS "revokedAt" TIMESTAMPTZ;
END $$;

DO $$ BEGIN
  ALTER TABLE public."ApiKey" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- Billing table
DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "currentPeriodStart" TIMESTAMPTZ;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMPTZ;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "usageInspects" INTEGER NOT NULL DEFAULT 0;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "usageHoneypots" INTEGER NOT NULL DEFAULT 0;
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

DO $$ BEGIN
  ALTER TABLE public."Billing" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- ============================================================
-- TENANT SCHEMA
-- ============================================================

-- RequestLog table
DO $$ BEGIN
  ALTER TABLE tenant."RequestLog" ADD COLUMN IF NOT EXISTS "threatType" TEXT;
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."RequestLog" ADD COLUMN IF NOT EXISTS "incidentId" TEXT;
END $$;

-- Threat table
DO $$ BEGIN
  ALTER TABLE tenant."Threat" ADD COLUMN IF NOT EXISTS payload JSONB;
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Threat" ADD COLUMN IF NOT EXISTS remediation JSONB;
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Threat" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Threat" ADD COLUMN IF NOT EXISTS "resolvedAt" TIMESTAMPTZ;
END $$;

-- Fingerprint table
DO $$ BEGIN
  ALTER TABLE tenant."Fingerprint" ADD COLUMN IF NOT EXISTS baseline JSONB NOT NULL DEFAULT '{}';
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Fingerprint" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Fingerprint" ADD COLUMN IF NOT EXISTS "anomalyScore" FLOAT NOT NULL DEFAULT 0;
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Fingerprint" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."Fingerprint" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- AuditLog table
DO $$ BEGIN
  ALTER TABLE tenant."AuditLog" ADD COLUMN IF NOT EXISTS changes JSONB;
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."AuditLog" ADD COLUMN IF NOT EXISTS ip TEXT NOT NULL DEFAULT '';
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."AuditLog" ADD COLUMN IF NOT EXISTS "userAgent" TEXT NOT NULL DEFAULT '';
END $$;

DO $$ BEGIN
  ALTER TABLE tenant."AuditLog" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_apikey_tenant ON public."ApiKey"("tenantId");
CREATE INDEX IF NOT EXISTS idx_reqlog_timestamp ON tenant."RequestLog"(timestamp);
CREATE INDEX IF NOT EXISTS idx_reqlog_fingerprint ON tenant."RequestLog"(fingerprint);
CREATE INDEX IF NOT EXISTS idx_reqlog_risk ON tenant."RequestLog"("riskScore");
CREATE INDEX IF NOT EXISTS idx_reqlog_verdict ON tenant."RequestLog"(verdict);
CREATE INDEX IF NOT EXISTS idx_reqlog_incident ON tenant."RequestLog"("incidentId");
CREATE INDEX IF NOT EXISTS idx_threat_created ON tenant."Threat"("createdAt");
CREATE INDEX IF NOT EXISTS idx_threat_type ON tenant."Threat"(type);
CREATE INDEX IF NOT EXISTS idx_fingerprint_identity ON tenant."Fingerprint"("identityId");
CREATE INDEX IF NOT EXISTS idx_audit_created ON tenant."AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS idx_audit_actor ON tenant."AuditLog"("actorId");
