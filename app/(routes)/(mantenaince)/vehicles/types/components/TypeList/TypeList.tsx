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
import { FormAddType } from "../FormAddType";
import { FormEditType } from "../FormEditType";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { TypeListProps } from "./TypeList.types";

export function TypeList() {
  const [data, setData] = useState<TypeListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeListProps | null>(null);

  const { toast } = useToast();

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`/api/vehicles/types`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Types: ", error);
      toast({
        title: "Error fetching Types",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleEdit = (type: TypeListProps) => {
    setEditingType(type);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/types/${id}`);
      setData(data.filter((type) => type.id !== id));
      toast({
        title: "Type deleted!",
        description: "The type has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting type:", error);
      toast({
        title: "Error deleting type",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<TypeListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nombre",
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
        Agregar Tipo
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
      <FormAddType
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddType={(newType) => setData([...data, newType])}
      />
      {editingType && (
        <FormEditType
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          type={editingType}
          onEditType={(editedType) => {
            setData(
              data.map((type) =>
                type.id === editedType.id ? editedType : type
              )
            );
          }}
        />
      )}
    </div>
  );
}
