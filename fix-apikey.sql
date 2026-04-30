-- Adiciona coluna keyHash na tabela ApiKey (se não existir)
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
