export type FormEditPermissionProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: string;
    tenantId: string;
    name: string;
    description: string;
  };
  onEditPermission: (item: {
    id: string;
    tenantId: string;
    name: string;
    description: string;
  }) => void;
};
