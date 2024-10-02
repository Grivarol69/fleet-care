export type FormEditModelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  model: {
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
  };
  onEditModel: (model: {
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
