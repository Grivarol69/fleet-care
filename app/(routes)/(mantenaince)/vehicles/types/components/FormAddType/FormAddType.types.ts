export type FormAddTypeProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddType: (type: { id: number; name: string }) => void;
};
