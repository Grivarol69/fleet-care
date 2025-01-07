/*
  Warnings:

  - The primary key for the `OdometerLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `vehicleId` on the `OdometerLog` table. All the data in the column will be lost.
  - The `id` column on the `OdometerLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `vehiclePlate` to the `OdometerLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OdometerLog_vehicleId_idx";

-- AlterTable
ALTER TABLE "OdometerLog" DROP CONSTRAINT "OdometerLog_pkey",
DROP COLUMN "vehicleId",
ADD COLUMN     "vehiclePlate" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OdometerLog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "OdometerLog_vehiclePlate_idx" ON "OdometerLog"("vehiclePlate");
