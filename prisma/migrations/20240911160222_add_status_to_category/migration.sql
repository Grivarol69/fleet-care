-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Category_Items" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
