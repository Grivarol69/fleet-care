export type VehicleListProps = {
  id: number;
  photo: string;
  modelVehicleId: number;
  licensePlate: string;
  brandName?: string | undefined;
  lineName?: string | undefined;
  typeName?: string | undefined;
  typePlate: string;
  mileage: number;
  color: string;
  owner: string;
  year: number;
  situation: string;
};
