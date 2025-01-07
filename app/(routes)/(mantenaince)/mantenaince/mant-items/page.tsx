import React from "react";
import { MantItemsList } from "./components/MantItemsList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        Lista de Items de Mantenimiento
      </h1>
      <MantItemsList />
    </div>
  );
}
