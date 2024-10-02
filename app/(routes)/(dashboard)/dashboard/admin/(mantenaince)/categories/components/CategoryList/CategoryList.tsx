"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormAddCategory } from "../FormAddCategory";
import { FormEditCategory } from "../FormEditCategory";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

type Category = {
  id: number;
  description: string;
  status?: string;
};

export function CategoryList() {
  const [data, setData] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/category`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      toast({
        title: "Error fetching categories",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/category/${id}`);
      setData(data.filter((category) => category.id !== id));
      toast({
        title: "Category deleted!",
        description: "The category has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error deleting category",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add Category
      </Button>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormAddCategory
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddCategory={(newCategory) => setData([...data, newCategory])}
      />
      {editingCategory && (
        <FormEditCategory
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          category={editingCategory}
          onEditCategory={(editedCategory) => {
            setData(
              data.map((cat) =>
                cat.id === editedCategory.id ? editedCategory : cat
              )
            );
          }}
        />
      )}
    </div>
  );
}
