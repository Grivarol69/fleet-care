export interface MantItem {
  id: number;
  userId?: string;
  tenantId?: string;
  description: string;
  mant_type: string;
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

// Tipos para la relacion Mant Items Providers
export interface WorkOrderItem {
  id: number;
  woId: number;
  mantItemId: number;
  providerId: number;
  mantItemDescription: string;
  providerName: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  actualDuration: number;
  executionMileage: number;
  notes: string;
  state: string;
}

export interface WorkOrderSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workorder: WorkOrder[];
  onSelectWorkOrder: (workorder: WorkOrder) => void;
}

// Props para modal de selección
export interface MantItemSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mantItem: MantItem[];
  onSelectMantItem: (mantItem: MantItem) => void;
}

// Props para modal de selección
export interface ProviderSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  provider: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

// Props para formularios
export interface FormAddWorkOrderItemProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrderId: number;
  onAddWorkOrderItem: (workOrderItem: WorkOrderItem) => void;
}

export interface FormEditWorkOrderItemProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrderItem: WorkOrderItem;
  onEditWorkOrderItem: (workOrderItem: WorkOrderItem) => void;
}

export interface ItemWorkOrdersListProps {
  workOrderId: number;
  onItemsChange?: () => void; // Nuevo prop para notificar cambios
}
