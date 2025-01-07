export type FormAddOdometerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddDocument: (odometer: {
    id: number;
    vehiclePlate: string;
    kilometers: number;
    recordedAt: Date;
  }) => void;
};

export type VehicleProps = {
  licensePlate: string;
  typePlate: string;
  brandId?: number;
  lineId?: number;
  typeId?: number;
  brandName: string;
  lineName: string;
  typeName: string;
  year: number;
};
