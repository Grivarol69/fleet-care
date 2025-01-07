import React from "react";
import { TenantsList } from "./components/TenantsList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Tenants</h1>
      <TenantsList />
    </div>
  );
}
