/*
  Warnings:

  - You are about to drop the column `brandId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `engine` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `lineId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modelVehicleId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licensePlate]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mileage` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelVehicleId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situation` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typePlate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type_Plate" AS ENUM ('AMARILLA', 'BLANCA');

-- CreateEnum
CREATE TYPE "Type_Situation" AS ENUM ('DISPONIBLE', 'RENTADO', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "Type_Owner" AS ENUM ('AMARILLA', 'BLANCA');

-- DropIndex
DROP INDEX "Vehicle_brandId_idx";

-- DropIndex
DROP INDEX "Vehicle_lineId_idx";

-- DropIndex
DROP INDEX "Vehicle_typeId_idx";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "brandId",
DROP COLUMN "engine",
DROP COLUMN "lineId",
DROP COLUMN "typeId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "licensePlate" TEXT NOT NULL,
ADD COLUMN     "mileage" INTEGER NOT NULL,
ADD COLUMN     "modelVehicleId" INTEGER NOT NULL,
ADD COLUMN     "owner" "Type_Owner" NOT NULL,
ADD COLUMN     "situation" "Type_Situation" NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "typePlate" "Type_Plate" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Model_Vehicle" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "engine" "Engine" NOT NULL,
    "wheels" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Model_Vehicle_brandId_idx" ON "Model_Vehicle"("brandId");

-- CreateIndex
CREATE INDEX "Model_Vehicle_lineId_idx" ON "Model_Vehicle"("lineId");

-- CreateIndex
CREATE INDEX "Model_Vehicle_typeId_idx" ON "Model_Vehicle"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_modelVehicleId_key" ON "Vehicle"("modelVehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");
