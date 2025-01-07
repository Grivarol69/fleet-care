// Tipos para la relacion Vehicles Documents
export interface DocumentProps {
  id: string;
  type: "SOAT" | "TECNOMECANICA" | "POLIZA" | "OTRO";
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  expiryDate: Date;
  status: "VIGENTE" | "VENCIDO";
  insurance: string;
  vehiclePlate: string;
}

// Props para formularios
export interface FormAddDocumentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehiclePlate: string;
  onAddDocument: (document: DocumentProps) => void;
}

export interface FormEditDocumentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehiclePlate: string;
  document: DocumentProps;
  onEditDocument: (document: DocumentProps) => void;
}
