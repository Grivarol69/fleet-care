export type FormEditUserProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  onEditUser: (item: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
};
