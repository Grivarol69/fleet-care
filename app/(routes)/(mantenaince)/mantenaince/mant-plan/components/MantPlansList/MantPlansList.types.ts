export type MantPlansListProps = {
  id: number;
  tenantId: string;
  description: string;
  vehicleBrandId: number;
  vehicleLineId: number;

  brand?: {
    id: number;
    name: string;
  };
  line?: {
    id: number;
    name: string;
  };

  status: string;
};
