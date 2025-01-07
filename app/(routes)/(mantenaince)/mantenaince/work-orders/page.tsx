import React from "react";
import { WorkOrdersList } from "./components/WorkOrdersList";

export default function MantItemsPage() {
  return (
    <div className="container md:min-w-max mx-auto py-1">
      <h1 className="text-2xl font-bold mb-5">Lista de Ordenes de Trabajo</h1>
      <WorkOrdersList />
    </div>
  );
}
