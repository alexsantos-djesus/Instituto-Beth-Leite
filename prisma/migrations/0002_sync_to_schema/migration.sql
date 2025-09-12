-- Cria o enum (ignora se já existir)
DO $$
BEGIN
  CREATE TYPE "FivFelvStatus" AS ENUM ('POSITIVO', 'NEGATIVO', 'NAO_TESTADO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Adiciona a nova coluna enum (se ainda não existir)
ALTER TABLE "Animal"
  ADD COLUMN IF NOT EXISTS "fivFelvStatus" "FivFelvStatus";

-- Migra os valores antigos (se a coluna booleana ainda existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Animal'
      AND column_name = 'fivFelvTested'
  ) THEN
    UPDATE "Animal"
    SET "fivFelvStatus" = CASE
      WHEN "fivFelvTested" = TRUE  THEN 'POSITIVO'::"FivFelvStatus"
      WHEN "fivFelvTested" = FALSE THEN 'NEGATIVO'::"FivFelvStatus"
      ELSE 'NAO_TESTADO'::"FivFelvStatus"
    END
    WHERE "fivFelvStatus" IS NULL;
  END IF;
END
$$;

-- Remove a coluna antiga se ainda existir
ALTER TABLE "Animal"
  DROP COLUMN IF EXISTS "fivFelvTested";
