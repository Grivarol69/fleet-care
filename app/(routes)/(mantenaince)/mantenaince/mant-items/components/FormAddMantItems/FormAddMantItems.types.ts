import { Decimal } from "@prisma/client/runtime/library";

export type FormAddMantItemsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddMantItem: (item: {
    id: number;
    tenantId: string;
    description: string;
    mant_type: string;
    estimated_time: number;
    idCategory: number;
    mant_categories?: {
      id: number;
      description: string;
    };
  }) => void;
};
