export interface ModelVehicleListItem {
  id: number;
  brandId: number;
  brandName?: string | undefined;
  lineId: number;
  lineName?: string | undefined;
  typeId: number;
  typeName?: string | undefined;
  year: number;
  engine: string;
  wheels: number;
}
