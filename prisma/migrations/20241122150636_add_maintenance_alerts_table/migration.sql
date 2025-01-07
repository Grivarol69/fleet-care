-- CreateTable
CREATE TABLE "MaintenanceAlerts" (
    "id" SERIAL NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "mantItemDescription" TEXT NOT NULL,
    "currentKm" INTEGER NOT NULL,
    "executionKm" INTEGER NOT NULL,
    "kmToMaintenance" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "MaintenanceAlerts_pkey" PRIMARY KEY ("id")
);
