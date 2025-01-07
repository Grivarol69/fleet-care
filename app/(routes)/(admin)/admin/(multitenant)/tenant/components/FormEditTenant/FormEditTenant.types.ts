export type FormEditTenantProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: string;
    name: string;
    domain: string;
    photo: string;
    rut_nit: string;
  };
  onEditTenant: (item: {
    id: string;
    photo: string;
    name: string;
    domain: string;
    rut_nit: string;
  }) => void;
};
