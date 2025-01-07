-- CreateEnum
CREATE TYPE "Mant_Type" AS ENUM ('PREVENTIVO', 'PREDICTIVO', 'CORRECTIVO', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "OT_Priority" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'MUY_ALTA');

-- CreateEnum
CREATE TYPE "OT_Status" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Document_Type" AS ENUM ('SOAT', 'TECNOMECANICA', 'POLIZA', 'OTRO');

-- CreateEnum
CREATE TYPE "Document_Status" AS ENUM ('VIGENTE', 'VENCIDO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Type_Plate" AS ENUM ('PARTICULAR', 'PUBLICO');

-- CreateEnum
CREATE TYPE "Type_Situation" AS ENUM ('DISPONIBLE', 'RENTADO', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "Type_Owner" AS ENUM ('PROPIO', 'NO_PROPIO', 'TERCERO');

-- CreateEnum
CREATE TYPE "Engine" AS ENUM ('GASOLINA', 'DIESEL', 'ACPM', 'GNV', 'ELECTRICO');

-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('MECANICA', 'ELECTRICIDAD', 'FRENOS', 'NIVELES');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "photo" TEXT,
    "templateId" TEXT,
    "rut_nit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "TenantTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenantTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissionTemplate" (
    "roleTemplateId" TEXT NOT NULL,
    "permissionTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermissionTemplate_pkey" PRIMARY KEY ("roleTemplateId","permissionTemplateId")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "specialty" "Specialty" NOT NULL,
    "contact_info" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rut_nit" TEXT NOT NULL,
    "specialty" "Specialty" NOT NULL,
    "contact_info" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Categories" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mant_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Items" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mant_type" "Mant_Type" NOT NULL,
    "estimated_time" DECIMAL(5,2) NOT NULL,
    "idCategory" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Mant_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mant_Plan" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicleBrandId" INTEGER NOT NULL,
    "vehicleLineId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Mant_Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan_Tasks" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    "mantItemId" INTEGER NOT NULL,
    "triggerKm" INTEGER NOT NULL,

    CONSTRAINT "Plan_Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleMantPlan" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "mantPlanId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedKm" INTEGER,
    "status" "Status" NOT NULL,
    "state" "OT_Status" NOT NULL,
    "lastKmCheck" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleMantPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleMantPlanItem" (
    "id" SERIAL NOT NULL,
    "vehicleMantPlanId" INTEGER NOT NULL,
    "mantItemId" INTEGER NOT NULL,
    "providerId" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "cost" DECIMAL(10,2),
    "actualDuration" INTEGER NOT NULL,
    "executionMileage" INTEGER NOT NULL,
    "notes" TEXT,
    "state" "OT_Status" NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleMantPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MantItemsProvider" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "mantItemId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "MantItemsProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "maintenanceType" "Mant_Type" NOT NULL,
    "priority" "OT_Priority" NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "plannedAmount" DECIMAL(10,2),
    "realAmount" DECIMAL(10,2),
    "otstatus" "OT_Status" NOT NULL,
    "creationMileage" INTEGER NOT NULL,
    "technicianId" INTEGER,
    "providerId" INTEGER,
    "remarks" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderItem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "woId" INTEGER NOT NULL,
    "mantItemId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "cost" DOUBLE PRECISION NOT NULL,
    "actualDuration" INTEGER NOT NULL,
    "executionMileage" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "WorkOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OdometerLog" (
    "id" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "kilometers" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OdometerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoPart" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "AutoPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderPart" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "woId" INTEGER NOT NULL,
    "partId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "WorkOrderPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Brand" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Line" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Type" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model_Vehicle" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "engine" "Engine" NOT NULL,
    "wheels" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" "Document_Type" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" "Document_Status" NOT NULL DEFAULT 'VIGENTE',
    "insurance" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "typePlate" "Type_Plate" NOT NULL,
    "brandId" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "cylinder" INTEGER NOT NULL,
    "bodyWork" TEXT,
    "engineNumber" TEXT,
    "chasisNumber" TEXT,
    "ownerCard" TEXT,
    "color" TEXT NOT NULL,
    "owner" "Type_Owner" NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "situation" "Type_Situation" NOT NULL,
    "lastKilometers" INTEGER,
    "lastRecorder" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE INDEX "Tenant_templateId_idx" ON "Tenant"("templateId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Permission_name_idx" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantTemplate_name_key" ON "TenantTemplate"("name");

-- CreateIndex
CREATE INDEX "RoleTemplate_tenantTemplateId_idx" ON "RoleTemplate"("tenantTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTemplate_tenantTemplateId_name_key" ON "RoleTemplate"("tenantTemplateId", "name");

-- CreateIndex
CREATE INDEX "PermissionTemplate_tenantTemplateId_idx" ON "PermissionTemplate"("tenantTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionTemplate_tenantTemplateId_name_key" ON "PermissionTemplate"("tenantTemplateId", "name");

-- CreateIndex
CREATE INDEX "RolePermissionTemplate_roleTemplateId_idx" ON "RolePermissionTemplate"("roleTemplateId");

-- CreateIndex
CREATE INDEX "RolePermissionTemplate_permissionTemplateId_idx" ON "RolePermissionTemplate"("permissionTemplateId");

-- CreateIndex
CREATE INDEX "Technician_tenantId_idx" ON "Technician"("tenantId");

-- CreateIndex
CREATE INDEX "Provider_tenantId_idx" ON "Provider"("tenantId");

-- CreateIndex
CREATE INDEX "Mant_Items_tenantId_idx" ON "Mant_Items"("tenantId");

-- CreateIndex
CREATE INDEX "Mant_Items_idCategory_idx" ON "Mant_Items"("idCategory");

-- CreateIndex
CREATE INDEX "Mant_Plan_tenantId_idx" ON "Mant_Plan"("tenantId");

-- CreateIndex
CREATE INDEX "Mant_Plan_vehicleBrandId_idx" ON "Mant_Plan"("vehicleBrandId");

-- CreateIndex
CREATE INDEX "Mant_Plan_vehicleLineId_idx" ON "Mant_Plan"("vehicleLineId");

-- CreateIndex
CREATE INDEX "Plan_Tasks_planId_idx" ON "Plan_Tasks"("planId");

-- CreateIndex
CREATE INDEX "Plan_Tasks_mantItemId_idx" ON "Plan_Tasks"("mantItemId");

-- CreateIndex
CREATE INDEX "Plan_Tasks_planId_triggerKm_idx" ON "Plan_Tasks"("planId", "triggerKm");

-- CreateIndex
CREATE INDEX "VehicleMantPlan_vehiclePlate_idx" ON "VehicleMantPlan"("vehiclePlate");

-- CreateIndex
CREATE INDEX "VehicleMantPlan_mantPlanId_idx" ON "VehicleMantPlan"("mantPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleMantPlan_vehiclePlate_mantPlanId_key" ON "VehicleMantPlan"("vehiclePlate", "mantPlanId");

-- CreateIndex
CREATE INDEX "VehicleMantPlanItem_vehicleMantPlanId_idx" ON "VehicleMantPlanItem"("vehicleMantPlanId");

-- CreateIndex
CREATE INDEX "VehicleMantPlanItem_mantItemId_idx" ON "VehicleMantPlanItem"("mantItemId");

-- CreateIndex
CREATE INDEX "VehicleMantPlanItem_providerId_idx" ON "VehicleMantPlanItem"("providerId");

-- CreateIndex
CREATE INDEX "MantItemsProvider_mantItemId_idx" ON "MantItemsProvider"("mantItemId");

-- CreateIndex
CREATE INDEX "MantItemsProvider_providerId_idx" ON "MantItemsProvider"("providerId");

-- CreateIndex
CREATE INDEX "WorkOrder_tenantId_idx" ON "WorkOrder"("tenantId");

-- CreateIndex
CREATE INDEX "WorkOrder_technicianId_idx" ON "WorkOrder"("technicianId");

-- CreateIndex
CREATE INDEX "WorkOrder_providerId_idx" ON "WorkOrder"("providerId");

-- CreateIndex
CREATE INDEX "WorkOrder_vehiclePlate_idx" ON "WorkOrder"("vehiclePlate");

-- CreateIndex
CREATE INDEX "WorkOrderItem_woId_idx" ON "WorkOrderItem"("woId");

-- CreateIndex
CREATE INDEX "WorkOrderItem_mantItemId_idx" ON "WorkOrderItem"("mantItemId");

-- CreateIndex
CREATE INDEX "WorkOrderItem_providerId_idx" ON "WorkOrderItem"("providerId");

-- CreateIndex
CREATE INDEX "OdometerLog_vehicleId_idx" ON "OdometerLog"("vehicleId");

-- CreateIndex
CREATE INDEX "AutoPart_tenantId_idx" ON "AutoPart"("tenantId");

-- CreateIndex
CREATE INDEX "WorkOrderPart_tenantId_idx" ON "WorkOrderPart"("tenantId");

-- CreateIndex
CREATE INDEX "WorkOrderPart_woId_idx" ON "WorkOrderPart"("woId");

-- CreateIndex
CREATE INDEX "WorkOrderPart_partId_idx" ON "WorkOrderPart"("partId");

-- CreateIndex
CREATE INDEX "Vehicle_Line_brandId_idx" ON "Vehicle_Line"("brandId");

-- CreateIndex
CREATE INDEX "Model_Vehicle_id_idx" ON "Model_Vehicle"("id");

-- CreateIndex
CREATE INDEX "Model_Vehicle_brandId_idx" ON "Model_Vehicle"("brandId");

-- CreateIndex
CREATE INDEX "Model_Vehicle_lineId_idx" ON "Model_Vehicle"("lineId");

-- CreateIndex
CREATE INDEX "Model_Vehicle_typeId_idx" ON "Model_Vehicle"("typeId");

-- CreateIndex
CREATE INDEX "Document_vehiclePlate_type_idx" ON "Document"("vehiclePlate", "type");

-- CreateIndex
CREATE INDEX "Document_tenantId_idx" ON "Document"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

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
