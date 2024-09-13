export type FormEditTipoProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tipo: { id: number; name: string };
  onEditTipo: (tipo: { id: number; name: string }) => void;
};
