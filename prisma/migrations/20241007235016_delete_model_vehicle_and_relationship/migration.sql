/*
  Warnings:

  - You are about to drop the column `modelVehicleId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Vehicle_Brand` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Vehicle_Line` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Vehicle_Type` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Document_Type" AS ENUM ('SOAT', 'TECNOMECANICA', 'POLIZA', 'OTRO');

-- CreateEnum
CREATE TYPE "Document_Status" AS ENUM ('VIGENTE', 'VENCIDO');

-- DropIndex
DROP INDEX "Vehicle_modelVehicleId_idx";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "modelVehicleId",
ADD COLUMN     "bodyWork" TEXT,
ADD COLUMN     "brandId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "chasisNumber" TEXT,
ADD COLUMN     "cylinder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "engineNumber" TEXT,
ADD COLUMN     "lineId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "ownerCard" TEXT,
ADD COLUMN     "typeId" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "mileage" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Vehicle_Brand" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Vehicle_Line" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Vehicle_Type" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "Document_Type" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" "Document_Status" NOT NULL DEFAULT 'VIGENTE',
    "insurance" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_vehicleId_idx" ON "Document"("vehicleId");

-- CreateIndex
CREATE INDEX "Vehicle_brandId_idx" ON "Vehicle"("brandId");

-- CreateIndex
CREATE INDEX "Vehicle_lineId_idx" ON "Vehicle"("lineId");

-- CreateIndex
CREATE INDEX "Vehicle_typeId_idx" ON "Vehicle"("typeId");
