export type FormAddProviderProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddProvider: (item: {
    id: number;
    userId: string;
    tenantId: string;
    name: string;
    rut_nit: string;
    specialty: string;
    contact_info: string;
  }) => void;
};
