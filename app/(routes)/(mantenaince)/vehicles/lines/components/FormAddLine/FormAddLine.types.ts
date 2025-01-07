export type FormAddLineProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddLine: (line: {
    id: number;
    name: string;
    brandId: number;
    brandName?: string;
  }) => void;
};
