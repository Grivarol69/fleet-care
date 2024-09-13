/*
  Warnings:

  - Added the required column `updatedAt` to the `Vehicle_Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle_Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle_Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle_Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle_Type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle_Type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle_Brand" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle_Line" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle_Type" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;
