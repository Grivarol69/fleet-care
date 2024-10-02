import React from "react";
import { CategoryList } from "./components/CategoryList";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Categories</h1>
      <CategoryList />
    </div>
  );
}
