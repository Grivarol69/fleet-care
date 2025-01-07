import React from "react";
import { MantPlansList } from "./components/MantPlansList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista Planes de Mantenimiento</h1>
      <MantPlansList />
    </div>
  );
}
