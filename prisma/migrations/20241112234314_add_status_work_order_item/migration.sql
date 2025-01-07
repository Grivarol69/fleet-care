/*
  Warnings:

  - Added the required column `state` to the `WorkOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkOrderItem" ADD COLUMN     "state" "OT_Status" NOT NULL;
