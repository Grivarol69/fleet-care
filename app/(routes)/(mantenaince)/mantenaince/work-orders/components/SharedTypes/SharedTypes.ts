// Interfaces base

// Tipos para Vehículos
export interface Vehicle {
  id: number;
  tenantId: string;
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

export interface Provider {
  id: number;
  userId?: string;
  tenantId?: string;
  name: string;
  rut_nit: string;
  specialty: string;
  contact_info: string;
}

export interface Technician {
  id: number;
  userId?: string;
  tenantId?: string;
  name: string;
  specialty: string;
  contact_info: string;
}

// Tipos para la relación Plan-Vehículo
export interface WorkOrder {
  id: number;
  tenantId: string;
  vehiclePlate: string;
  maintenanceType: string;
  brandName: string;
  lineName: string;
  priority: string;
  creationDate: Date;
  startDate: Date;
  endDate: Date;
  plannedAmount: number;
  realAmount: number;
  otstatus: string; //PENDIENTE-EN_PROCESO-COMPLETADO-ATRASADO-CANCELADO
  creationMileage: number;
  technicianId: number;
  providerId: number;
  providerName?: string;
  technicianName?: string;
  remarks?: string;
  status: string; //Active/Inactive
}

// Props para modales de selección
export interface VehicleSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

// Props para modal de selección
export interface ProviderSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  provider: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

// Props para modal de selección
export interface TechnicianSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  technician: Technician[];
  onSelectTechnician: (technician: Technician) => void;
}

// Props para formularios
export interface FormAddWorkOrderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddWorkOrder: (workorder: WorkOrder) => void;
}

export interface FormEditWorkOrderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: WorkOrder;
  onEditWorkOrder: (workorder: WorkOrder) => void;
}
