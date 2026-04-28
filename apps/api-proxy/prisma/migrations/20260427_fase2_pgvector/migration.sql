-- Fase 2: AI Layer — pgvector tables
-- Isolation via tenant_id column (pragmatic for MVP; schema-per-tenant in production)

CREATE TABLE IF NOT EXISTS payload_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  payload_embedding vector(1536),
  payload_hash TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  risk_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_payload_per_identity UNIQUE (tenant_id, identity_id, payload_hash)
);

CREATE INDEX IF NOT EXISTS idx_payload_embeddings_vector
ON payload_embeddings
USING ivfflat (payload_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_payload_embeddings_identity
ON payload_embeddings (tenant_id, identity_id);

CREATE TABLE IF NOT EXISTS behavior_profiles (
  tenant_id TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  temporal_profile JSONB NOT NULL DEFAULT '{}',
  geo_profile JSONB NOT NULL DEFAULT '{}',
  payload_stats JSONB NOT NULL DEFAULT '{}',
  velocity_stats JSONB NOT NULL DEFAULT '{}',
  graph_profile JSONB NOT NULL DEFAULT '{}',
  baseline_embedding vector(1536),
  anomaly_score FLOAT DEFAULT 0,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tenant_id, identity_id)
);

CREATE INDEX IF NOT EXISTS idx_behavior_profiles_anomaly
ON behavior_profiles (tenant_id, anomaly_score DESC);

CREATE TABLE IF NOT EXISTS threat_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  threat_id TEXT,
  is_false_positive BOOLEAN NOT NULL,
  notes TEXT,
  corrected_verdict TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_feedback_per_incident UNIQUE (tenant_id, incident_id)
);

CREATE INDEX IF NOT EXISTS idx_threat_feedback_incident
ON threat_feedback (tenant_id, incident_id);
