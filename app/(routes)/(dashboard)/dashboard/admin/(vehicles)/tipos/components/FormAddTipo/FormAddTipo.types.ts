export type FormAddTipoProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddTipo: (tipo: { id: number; name: string }) => void;
};
