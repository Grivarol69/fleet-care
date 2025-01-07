export type FormAddRoleProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddRole: (item: { id: string; tenantId: string; name: string }) => void;
};
