export type FormEditDocumentProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  document: {
    id: string;
    type: string;
    fileName?: string;
    fileUrl: string;
    uploadDate: Date;
    expiryDate: Date;
    status: string;
    insurance?: string;
    vehiclePlate: string;
  };
  onEditDocument: (editedDocument: {
    id: string;
    type: string;
    fileName?: string;
    fileUrl: string;
    uploadDate: Date;
    expiryDate: Date;
    status: string;
    insurance?: string;
    vehiclePlate: string;
  }) => void;
};

export type VehicleProps = {
  licensePlate: string;
  typePlate: string;
  brandId?: number;
  lineId?: number;
  typeId?: number;
  brandName: string;
  lineName: string;
  typeName: string;
  year: number;
};
