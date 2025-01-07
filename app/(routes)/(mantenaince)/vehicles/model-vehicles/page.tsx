import React from "react";
import { ModelList } from "./components/ModelList";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-1">
      {/* <h1 className="text-2xl font-bold mb-5">Lista Modelos de Vehículos</h1> */}
      <ModelList />
    </div>
  );
}
