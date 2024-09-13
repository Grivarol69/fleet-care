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
import { FormAddTipo } from "../FormAddTipo";
import { FormEditTipo } from "../FormEditLine";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { TipoListProps } from "./TipoList.types";

export function TipoList() {
  const [data, setData] = useState<TipoListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoListProps | null>(null);

  const { toast } = useToast();

  const fetchTipos = async () => {
    try {
      const response = await axios.get(`/api/vehicles/tipos`);
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
    fetchTipos();
  }, []);

  const handleEdit = (tipo: TipoListProps) => {
    setEditingTipo(tipo);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/tipos/${id}`);
      setData(data.filter((tipo) => tipo.id !== id));
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

  const columns: ColumnDef<TipoListProps>[] = [
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
      <FormAddTipo
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddTipo={(newTipo) => setData([...data, newTipo])}
      />
      {editingTipo && (
        <FormEditTipo
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          tipo={editingTipo}
          onEditTipo={(editedTipo) => {
            setData(
              data.map((cat) => (cat.id === editedTipo.id ? editedTipo : cat))
            );
          }}
        />
      )}
    </div>
  );
}
