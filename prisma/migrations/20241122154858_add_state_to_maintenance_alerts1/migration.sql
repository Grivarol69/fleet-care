/*
  Warnings:

  - Added the required column `state` to the `MaintenanceAlerts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Alerts_State" AS ENUM ('GREEN', 'YELLOW', 'RED');

-- AlterTable
ALTER TABLE "MaintenanceAlerts" ADD COLUMN     "state" "Alerts_State" NOT NULL;

-- CreateIndex
CREATE INDEX "MaintenanceAlerts_vehiclePlate_idx" ON "MaintenanceAlerts"("vehiclePlate");
