export type FormEditTechnicianProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: {
    id: number;
    tenantId?: string;
    name: string;
    photo: string;
    specialty: string;
    contact_info: string;
  };
  onEditTechnician: (item: {
    id: number;
    tenantId?: string;
    name: string;
    photo: string;
    specialty: string;
    contact_info: string;
  }) => void;
};
