/*
  Warnings:

  - You are about to alter the column `cost` on the `WorkOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "WorkOrderItem" ALTER COLUMN "cost" DROP NOT NULL,
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(10,2);
