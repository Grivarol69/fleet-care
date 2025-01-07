import { Decimal } from "@prisma/client/runtime/library";

export type FormEditMantItemsProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: number;
    description: string;
    mant_type: string;
    estimated_time: number;
    idCategory?: number;
    mant_categories?: {
      id: number;
      description: string;
    };
  };
  onEditMantItems: (editedItem: {
    id: number;
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
