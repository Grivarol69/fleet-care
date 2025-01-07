import { Decimal } from "@prisma/client/runtime/library";

export interface MantItem {
  id: number;
  description: string;
  mant_type: "PREVENTIVO" | "PREDICTIVO" | "CORRECTIVO" | "ON_DEMAND";
  estimated_time: Decimal;
  idCategory: number;
  mant_categories?: {
    id: number;
    description: string;
  };
}

export interface PlanTask {
  id: number;
  planId: number;
  mantItemId: number;
  triggerKm: number;
  mant_items?: {
    id: number;
    description: string;
  };
}

export type FormAddPlanTaskProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  planId: number;
  onAddPlanTask: (item: PlanTask) => void;
};

export type FormEditPlanTaskProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: PlanTask;
  onEditPlanTask: (item: PlanTask) => void;
};

export interface MantItemsSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mantItem: MantItem[];
  onSelectMantItems: (mantItems: MantItem) => void;
}
