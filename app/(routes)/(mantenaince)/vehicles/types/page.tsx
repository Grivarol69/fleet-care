import React from "react";
import { TypeList } from "./components/TypeList";

export default function TypesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Tipos de Vehículos</h1>
      <TypeList />
    </div>
  );
}
