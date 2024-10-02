export type FormAddModelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddModel: (model: {
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
  }) => void;
};
