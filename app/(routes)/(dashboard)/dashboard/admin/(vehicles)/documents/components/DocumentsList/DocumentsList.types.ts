export type DocumentsListProps = {
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
