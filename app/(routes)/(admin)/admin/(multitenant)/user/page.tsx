import React from "react";
import { UsersList } from "./components/UsersList";

export default function MantItemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Usuarios</h1>
      <UsersList />
    </div>
  );
}
