import React from "react";
import { VehicleList } from "./components/VehiclesList";

export default function CategoriesPage() {
  return (
    <div className="container md:min-w-max mx-auto py-1">
      {/* <h1 className="text-2xl font-bold mb-5">Lista Modelos de Vehículos</h1> */}
      <VehicleList />
    </div>
  );
}
