import React from "react";
import { RolesList } from "./components/RolesList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Roles</h1>
      <RolesList />
    </div>
  );
}
