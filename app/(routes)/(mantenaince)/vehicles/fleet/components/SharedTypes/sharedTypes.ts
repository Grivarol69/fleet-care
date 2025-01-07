// export interface MantItem {
//   id: number;
//   userId?: string;
//   tenantId?: string;
//   description: string;
//   mant_type: string;
// }

// export interface Provider {
//   id: number;
//   userId?: string;
//   tenantId?: string;
//   name: string;
//   rut_nit: string;
//   specialty: string;
//   contact_info: string;
// }

// Tipos para la relacion Mant Items Providers
export interface FleetVehicle {
  id: number;
  photo: string;
  licensePlate: string;
  brandId: number;
  lineId: number;
  typeId: number;
  brandName: string;
  lineName: string;
  typeName: string;
  typePlate: string;
  mileage: number;
  cylinder?: number;
  bodyWork?: string;
  engineNumber?: string;
  chasisNumber?: string;
  ownerCard?: string;
  color: string;
  owner: string;
  year: number;
  situation: string;
  brand?: {
    id: number;
    name: string;
  };
  line?: {
    id: number;
    name: string;
  };
  type?: {
    id: number;
    name: string;
  };
}

// Props para modal de selección
// export interface MantItemSelectModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   mantItem: MantItem[];
//   onSelectMantItem: (mantItem: MantItem) => void;
// }

// Props para modal de selección
// export interface ProviderSelectModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   provider: Provider[];
//   onSelectProvider: (provider: Provider) => void;
// }

// Props para formularios
export interface FormAddFleetVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddFleetVehicle: (fleetVehicle: FleetVehicle) => void;
}

export interface FormEditFleetVehicleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fleetVehicle: FleetVehicle;
  onEditFleetVehicle: (fleetVehicle: FleetVehicle) => void;
}
