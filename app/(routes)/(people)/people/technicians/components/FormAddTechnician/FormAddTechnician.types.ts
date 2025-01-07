export type FormAddTechnicianProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddTechnician: (item: {
    id: number;
    tenantId?: string;
    name: string;
    photo: string;
    specialty: string;
    contact_info: string;
  }) => void;
};
