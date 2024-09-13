-- CreateEnum
CREATE TYPE "Mant_Type" AS ENUM ('PREVENTIVO', 'CORRECTIVO', 'INSPECCION');

-- CreateEnum
CREATE TYPE "Engine" AS ENUM ('GASOLINA', 'DIESEL', 'ACPM', 'GNV', 'ELECTRICO');

-- CreateTable
CREATE TABLE "Category_Items" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Items" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "mant_type" "Mant_Type" NOT NULL,
    "idCategory" INTEGER NOT NULL,

    CONSTRAINT "Mant_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Routines" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "km_activate" INTEGER NOT NULL,

    CONSTRAINT "Mant_Routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items_Routine" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Items_Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Plan" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Mant_Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items_Plan" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Items_Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vehicle_Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Line" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vehicle_Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vehicle_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "engine" "Engine" NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cv" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "people" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "priceDay" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPublish" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "carName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderEndDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "totalAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mant_Items_idCategory_idx" ON "Mant_Items"("idCategory");

-- CreateIndex
CREATE INDEX "Items_Routine_itemId_idx" ON "Items_Routine"("itemId");

-- CreateIndex
CREATE INDEX "Items_Routine_routineId_idx" ON "Items_Routine"("routineId");

-- CreateIndex
CREATE INDEX "Vehicle_brandId_idx" ON "Vehicle"("brandId");

-- CreateIndex
CREATE INDEX "Vehicle_lineId_idx" ON "Vehicle"("lineId");

-- CreateIndex
CREATE INDEX "Vehicle_typeId_idx" ON "Vehicle"("typeId");

-- CreateIndex
CREATE INDEX "Order_carId_idx" ON "Order"("carId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
