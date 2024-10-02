export type FormAddVehicleProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddVehicle: (vehicle: {
    id: number;
    modelVehicleId: number;
    photo: string;
    licensePlate: string;
    /* brandName?: string | undefined;
    lineName?: string | undefined;
    typeName?: string | undefined; */
    typePlate: string;
    mileage: number;
    color: string;
    owner: string;
    year: number;
    situation: string;
  }) => void;
};

export interface ModelVehicle {
  id: number;
  brandName: string;
  lineName: string;
  typeName: string;
  year: number;
  engine: string;
  wheels: number;
}
