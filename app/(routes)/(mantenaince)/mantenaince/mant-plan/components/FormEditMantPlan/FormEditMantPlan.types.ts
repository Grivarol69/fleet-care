// export type FormEditMantPlanProps = {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   item: {
//     id: number;
//     tenantId: string;
//     description: string;
//     vehicleBrandId: number;
//     vehicleLineId: number;
//     status: string;
//   };
//   onEditMantPlan: (item: {
//     id: number;
//     tenantId: string;
//     description: string;
//     vehicleBrandId: number;
//     vehicleLineId: number;
//     status: string;
//   }) => void;
// };

export interface MantPlan {
  id: number;
  tenantId: string;
  description: string;
  vehicleBrandId: number;
  vehicleLineId: number;
  status: string;
  brand?: {
    id: number;
    name: string;
  };
  line?: {
    id: number;
    name: string;
  };
}

export type FormEditMantPlanProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: MantPlan;
  onEditMantPlan: (editedMantPlan: MantPlan) => void;
};
