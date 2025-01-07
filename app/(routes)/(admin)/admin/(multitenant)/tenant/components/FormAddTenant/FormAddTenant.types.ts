export type FormAddTenantProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddTenant: (item: {
    id: string;
    name: string;
    domain: string;
    photo: string;
    rut_nit: string;
  }) => void;
};
