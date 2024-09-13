import React from "react";
import { TipoList } from "./components/TipoList";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Tipos de Vehículos</h1>
      <TipoList />
    </div>
  );
}
