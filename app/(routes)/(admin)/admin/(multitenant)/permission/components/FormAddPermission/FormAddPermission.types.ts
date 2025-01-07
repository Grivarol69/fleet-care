export type FormAddPermissionProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddPermission: (item: {
    id: string;
    tenantId: string;
    name: string;
    description: string;
  }) => void;
};
