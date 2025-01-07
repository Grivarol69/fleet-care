// Interfaces base
interface BaseEntity {
  id: number;
  tenantId: string;
}

// Tipos para Vehículos
export interface Vehicle extends BaseEntity {
  licensePlate: string;
  typePlate: string;
  brandId?: number;
  lineId?: number;
  typeId?: number;
  brandName: string;
  lineName: string;
  typeName: string;
  year: number;
}

// Tipos para Planes de Mantenimiento
export interface MantPlan extends BaseEntity {
  description: string;
  vehicleBrandId: number;
  vehicleLineId: number;
  vehicleBrandName: string;
  vehicleLineName: string;
  status: string;
}

// Tipos para la relación Plan-Vehículo
export interface PlanVehicle extends BaseEntity {
  vehiclePlate: string;
  mantPlanId: number;
  assignedAt: Date;
  completedKm: number;
  status: PlanVehicleStatus;
  lastKmCheck: number;
  brandName?: string;
  lineName?: string;
  planDescription?: string;
}

// Enums
export enum PlanVehicleStatus {
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  CORRECTIVO = "CORRECTIVO",
  COMPLETADO = "COMPLETADO",
  ATRASADO = "ATRASADO",
  CANCELADO = "CANCELADO",
}

// Props para modales de selección
export interface VehicleSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export interface MantPlanSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mantplans: MantPlan[];
  onSelectMantPlan: (mantPlan: MantPlan) => void;
}

// Props para formularios
export interface FormAddPlanVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddPlanVehicle: (planVehicle: PlanVehicle) => void;
}

export interface FormEditPlanVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: PlanVehicle;
  onEditPlanVehicle: (planVehicle: PlanVehicle) => void;
}
