-- Corrige schema da tabela ApiKey: remove coluna 'key' antiga, garante 'keyHash'
-- Roda no console SQL do Railway Dashboard

DO $$
BEGIN
    -- Remove a coluna 'key' antiga se existir (conflita com 'keyHash')
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'key'
    ) THEN
        ALTER TABLE public."ApiKey" DROP COLUMN "key";
    END IF;
END
$$;

-- Garante que keyHash existe
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

-- Garante que scopes existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'scopes'
    ) THEN
        ALTER TABLE public."ApiKey" ADD COLUMN scopes TEXT[] NOT NULL DEFAULT '{}';
    END IF;
END
$$;

-- Garante que outras colunas existem
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'lastUsed'
    ) THEN
        ALTER TABLE public."ApiKey" ADD COLUMN "lastUsed" TIMESTAMPTZ;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'revokedAt'
    ) THEN
        ALTER TABLE public."ApiKey" ADD COLUMN "revokedAt" TIMESTAMPTZ;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ApiKey' 
        AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE public."ApiKey" ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
END
$$;
