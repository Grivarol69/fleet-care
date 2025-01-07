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

// Tipos para la relacion Mant Items Providers
export interface VehicleMantPlanItem {
  id: number;
  vehicleMantPlanId: number;
  mantItemId: number;
  providerId: number;
  startDate: Date;
  endDate: Date;
  cost: number;
  actualDuration: number;
  executionMileage: number;
  notes: string;
  state: string;
  mantItem?: {
    id: number;
    description: string;
  };
  provider?: {
    id: number;
    name: string;
  };
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
export interface FormAddItemPlanVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddItemPlanVehicle: (itemPlanVehicle: VehicleMantPlanItem) => void;
}

export interface FormEditItemPlanVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  itemPlanVehicle: VehicleMantPlanItem;
  onEditItemPlanVehicle: (itemPlanVehicle: VehicleMantPlanItem) => void;
}
