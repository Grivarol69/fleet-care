// Tipos para MantItems
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
export interface MantItemProvider {
  id: number;
  userId?: string;
  tenantId?: string;
  mantItemId: number;
  providerId: number;
  priority: number;
  status: string;
  mant_items?: {
    id: number;
    description: string;
  };
  providers?: {
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
export interface FormAddMantItemProviderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddMantItemProvider: (mantItemProvider: MantItemProvider) => void;
}

export interface FormEditMantItemProviderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mantItemProvider: MantItemProvider;
  onEditMantItemProvider: (mantItemProvider: MantItemProvider) => void;
}
