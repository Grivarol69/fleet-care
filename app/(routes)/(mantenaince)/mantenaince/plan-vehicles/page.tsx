import React from "react";
import { PlanVehiclesList } from "./components/PlanVehiclesList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        Lista de Vehiculos y sus Planes de Mantenimento
      </h1>
      <PlanVehiclesList />
    </div>
  );
}
