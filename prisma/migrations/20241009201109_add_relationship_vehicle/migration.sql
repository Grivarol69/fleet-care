/*
  Warnings:

  - You are about to drop the column `licensePlate` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `vehiclePlate` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Document_vehicleId_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "licensePlate",
DROP COLUMN "vehicleId",
ADD COLUMN     "vehiclePlate" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Document_vehiclePlate_type_idx" ON "Document"("vehiclePlate", "type");
