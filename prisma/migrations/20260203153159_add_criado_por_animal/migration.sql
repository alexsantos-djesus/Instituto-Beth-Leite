/*
  Warnings:

  - Added the required column `criadoPorId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "criadoPorId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Animal_criadoPorId_idx" ON "Animal"("criadoPorId");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
