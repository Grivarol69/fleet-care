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
import { FormAddMantItems } from "../FormAddMantItems/FormAddMantItems";
import { FormEditMantItems } from "../FormEditMantItems";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { MantItemsListProps } from "./MantItemsList.types";

export function MantItemsList() {
  const [data, setData] = useState<MantItemsListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMantItems, setEditingMantItems] =
    useState<MantItemsListProps | null>(null);

  const { toast } = useToast();

  const fetchMantItems = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/mant-items`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Mantenaince Items: ", error);
      toast({
        title: "Error fetching Mantenaince Items",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMantItems();
  }, []);

  const handleEdit = (item: MantItemsListProps) => {
    setEditingMantItems(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/mant-items/${id}`);
      setData(data.filter((item) => item.id !== id));
      toast({
        title: "Mantenaince Items deleted!",
        description: "The Mantenaince Items has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Mantenaince Items:", error);
      toast({
        title: "Error deleting Mantenaince Items",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<MantItemsListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "mant_type",
      header: "Tipo",
    },
    {
      accessorKey: "estimated_time",
      header: "Tiempo Estimado",
    },
    {
      accessorKey: "mant_categories.description", // Accedemos directamente al nombre de la marca
      header: "Categoría",
      cell: ({ row }) => row.original.mant_categories?.description || "N/A",
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
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            Eliminar
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
        Agregar Item Mantenimiento
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
      <FormAddMantItems
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddMantItem={(newLine) => setData([...data, newLine])}
      />
      {editingMantItems && (
        <FormEditMantItems
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingMantItems}
          onEditMantItems={(editedItem: MantItemsListProps) => {
            setData(
              data.map((item) =>
                item.id === editedItem.id ? editedItem : item
              )
            );
          }}
        />
      )}
    </div>
  );
}
