export type FormAddUserProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddUser: (item: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
  }) => void;
};
