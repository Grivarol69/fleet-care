// export type FormAddVehicleProps = {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   onAddVehicle: (vehicle: {
//     id: number;
//     modelVehicleId: number;
//     photo: string;
//     licensePlate: string;
//     brandId: number;
//     lineId: number;
//     typeId: number;
//     typePlate: string;
//     mileage: number;
//     cylinder?: number;
//     bodyWork?: string;
//     engineNumber?: string;
//     chasisNumber?: string;
//     ownerCard?: string;
//     color: string;
//     owner: string;
//     year: number;
//     situation: string;
//   }) => void;
// };

import { VehicleListProps } from "../VehiclesList/VehiclesList.types";
import { Document } from "@prisma/client";

export type FormAddVehicleProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // vehicle: VehicleListProps;
  onAddVehicle: (newVehicle: VehicleListProps) => void;
};

export type DocumentsProps = {
  documents: Document[];
};
