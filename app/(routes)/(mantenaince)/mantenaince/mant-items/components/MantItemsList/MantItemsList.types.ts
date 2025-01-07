import { Decimal } from "@prisma/client/runtime/library";

export type MantItemsListProps = {
  id: number;
  description: string;
  mant_type: string;
  estimated_time: number;
  idCategory: number;
  mant_categories?: {
    id: number;
    description: string;
  };
};
