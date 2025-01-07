export type FormEditRoleProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: string;
    tenantId: string;
    name: string;
  };
  onEditRole: (item: { id: string; tenantId: string; name: string }) => void;
};
