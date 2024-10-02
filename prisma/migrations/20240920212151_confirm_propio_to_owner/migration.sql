/*
  Warnings:

  - The values [AMARILLA,BLANCA] on the enum `Type_Owner` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Type_Owner_new" AS ENUM ('PROPIO', 'NO_PROPIO', 'TERCERO');
ALTER TABLE "Vehicle" ALTER COLUMN "owner" TYPE "Type_Owner_new" USING ("owner"::text::"Type_Owner_new");
ALTER TYPE "Type_Owner" RENAME TO "Type_Owner_old";
ALTER TYPE "Type_Owner_new" RENAME TO "Type_Owner";
DROP TYPE "Type_Owner_old";
COMMIT;
