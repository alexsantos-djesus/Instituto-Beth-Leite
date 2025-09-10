-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "adotado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adotadoEm" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Animal_adotado_adotadoEm_idx" ON "Animal"("adotado", "adotadoEm");
