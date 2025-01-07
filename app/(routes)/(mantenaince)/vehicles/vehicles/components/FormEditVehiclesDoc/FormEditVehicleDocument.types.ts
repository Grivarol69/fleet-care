// export type FormEditVehicleProps = {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   vehicle: {
//     id: number;
//     photo: string;
//     licensePlate: string;
//     brandId?: number;
//     lineId?: number;
//     typeId?: number;
//     brandName: string;
//     lineName: string;
//     typeName: string;
//     typePlate: string;
//     mileage?: number;
//     cylinder?: number;
//     bodyWork?: string;
//     engineNumber?: string;
//     chasisNumber?: string;
//     ownerCard?: string;
//     color?: string;
//     owner?: string;
//     year: number;
//     situation: string;
//   };

//   onEditVehicle: (editedVehicle: {
//     id: number;
//     photo: string;
//     licensePlate: string;
//     brandId?: number;
//     lineId?: number;
//     typeId?: number;
//     brandName?: string;
//     lineName?: string;
//     typeName?: string;
//     typePlate: string;
//     mileage?: number;
//     cylinder?: number;
//     bodyWork?: string;
//     engineNumber?: string;
//     chasisNumber?: string;
//     ownerCard?: string;
//     color?: string;
//     owner?: string;
//     year: number;
//     situation: string;
//   }) => void;
// };

import { VehicleListProps } from "../VehiclesList/VehiclesList.types";

export type FormEditVehicleProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehicle: VehicleListProps;
  onEditVehicle: (editedVehicle: VehicleListProps) => void;
};
