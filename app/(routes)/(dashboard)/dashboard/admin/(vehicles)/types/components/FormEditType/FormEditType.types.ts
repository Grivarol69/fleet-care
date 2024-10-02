export type FormEditTypeProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: { id: number; name: string };
  onEditType: (type: { id: number; name: string }) => void;
};
