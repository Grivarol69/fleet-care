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
import { FormAddProvider } from "../FormAddProvider";
import { FormEditProvider } from "../FormEditProvider";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { ProvidersListProps } from "./ProvidersList.types";

export function ProvidersList() {
  const [data, setData] = useState<ProvidersListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] =
    useState<ProvidersListProps | null>(null);

  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`/api/people/provider`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Providers: ", error);
      toast({
        title: "Error fetching Providers",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleEdit = (prov: ProvidersListProps) => {
    setEditingProvider(prov);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/people/provider/${id}`);
      setData(data.filter((prov) => prov.id !== id));
      toast({
        title: "Provider deleted!",
        description: "The Provider has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast({
        title: "Error deleting Provider",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ProvidersListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "rut_nit",
      header: "RUT-NIT",
    },
    {
      accessorKey: "specialty",
      header: "Especialidad",
    },
    {
      accessorKey: "contact_info",
      header: "Contacto",
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
        Agregar Proveedor
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
      <FormAddProvider
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddProvider={(newProv) => setData([...data, newProv])}
      />
      {editingProvider && (
        <FormEditProvider
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingProvider}
          onEditProvider={(editedProv) => {
            setData(
              data.map((tech) =>
                tech.id === editedProv.id ? editedProv : tech
              )
            );
          }}
        />
      )}
    </div>
  );
}
