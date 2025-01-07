// export type FormAddMantPlanProps = {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   onAddMantPlan: (item: {
//     id: number;
//     userId: string;
//     tenantId: string;
//     description: string;
//     vehicleBrandId: number;
//     vehicleLineId: number;
//     status: string;
//   }) => void;
// };

// FormAddMantPlan.types.ts
export type FormAddMantPlanProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddMantPlan: (item: MantPlanItem) => void;
};

export type MantPlanItem = {
  id: number;
  userId: string;
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
};
