-- Adiciona valores no ENUM em transação própria
DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'EDITOR';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
