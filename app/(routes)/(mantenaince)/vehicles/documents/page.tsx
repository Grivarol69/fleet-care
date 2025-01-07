import React from "react";
import { DocumentsList } from "./components/DocumentsList";

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Documentos</h1>
      <DocumentsList />
    </div>
  );
}
