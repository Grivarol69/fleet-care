-- AlterTable
ALTER TABLE "Model_Vehicle" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
