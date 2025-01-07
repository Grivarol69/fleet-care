export type FormEditProviderProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: number;
    userId?: string;
    tenantId?: string;
    name: string;
    rut_nit: string;
    specialty: string;
    contact_info: string;
  };
  onEditProvider: (item: {
    id: number;
    userId?: string;
    tenantId?: string;
    name: string;
    rut_nit: string;
    specialty: string;
    contact_info: string;
  }) => void;
};
