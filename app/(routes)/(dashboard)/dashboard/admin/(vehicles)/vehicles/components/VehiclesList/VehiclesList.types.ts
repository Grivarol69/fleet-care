// export type VehicleListProps = {
//   id: number;
//   photo: string;
//   licensePlate: string;
//   brandId?: number;
//   lineId?: number;
//   typeId?: number;
//   brandName: string;
//   lineName: string;
//   typeName: string;
//   typePlate: string;
//   mileage?: number;
//   cylinder?: number;
//   bodyWork?: string;
//   engineNumber?: string;
//   chasisNumber?: string;
//   ownerCard?: string;
//   color?: string;
//   owner?: string;
//   year: number;
//   situation: string;
// };

// export type VehicleEditProps = {
//   id: number;
//   photo: string;
//   licensePlate: string;
//   brandId: number;
//   lineId: number;
//   typeId: number;
//   typePlate: string;
//   mileage: number;
//   cylinder?: number;
//   bodyWork?: string;
//   engineNumber?: string;
//   chasisNumber?: string;
//   ownerCard?: string;
//   color: string;
//   owner: string;
//   year: number;
//   situation: string;
// };

export type VehicleListProps = {
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
};

export type VehicleEditProps = VehicleListProps;
