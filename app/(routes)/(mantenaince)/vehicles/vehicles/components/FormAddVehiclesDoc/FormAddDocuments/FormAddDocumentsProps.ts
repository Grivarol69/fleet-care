export type Document = {
  id: string;
  type: "SOAT" | "TECNOMECANICA" | "POLIZA" | "OTRO";
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  expiryDate: Date | string;
  status: "VIGENTE" | "VENCIDO";
  insurance: string;
};

export type FormAddDocumentProps = {
  onDocumentAdded: (document: Document) => void;
};
