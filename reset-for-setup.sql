-- Script para resetar o banco e permitir novo setup
-- Rode isso no console SQL do Railway Dashboard

-- 1. Garante que a coluna keyHash existe na tabela ApiKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'keyHash'
    ) THEN
        ALTER TABLE public."ApiKey" ADD COLUMN "keyHash" TEXT NOT NULL DEFAULT '';
    END IF;
END
$$;

-- 2. Limpa dados existentes para permitir novo setup
DELETE FROM public."ApiKey";
DELETE FROM public."Billing";
DELETE FROM public."Tenant";

-- 3. (Opcional) Também limpa dados do schema tenant
DELETE FROM tenant."AuditLog";
DELETE FROM tenant."Fingerprint";
DELETE FROM tenant."Threat";
DELETE FROM tenant."RequestLog";
