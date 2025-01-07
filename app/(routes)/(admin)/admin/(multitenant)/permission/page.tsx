import React from "react";
import { PermissionsList } from "./components/PermissionsList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Permisos</h1>
      <PermissionsList />
    </div>
  );
}
