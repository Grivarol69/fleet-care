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
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import {
  MantItemProvider,
  Provider,
  MantItem,
  FormAddMantItemProviderProps,
  FormEditMantItemProviderProps,
} from "../SharedTypes/SharedTypes";
import { FormAddMantItemProvider } from "../FormAddMantItemProvider";
import { FormEditMantItemProvider } from "../FormEditMantItemProvider";

export function MantItemProvidersList() {
  const [data, setData] = useState<MantItemProvider[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMantItemProvider, setEditingMantItemProvider] =
    useState<MantItemProvider | null>(null);

  const { toast } = useToast();

  const fetchMantItemProvider = async () => {
    try {
      const response = await axios.get(`/api/people/mant-item-provider`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Mant-Item Provider: ", error);
      toast({
        title: "Error fetching Mant-Item Provider",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMantItemProvider();
  }, []);

  const handleEdit = (item: MantItemProvider) => {
    setEditingMantItemProvider(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/mant-items/${id}`);
      setData(data.filter((item) => item.id !== id));
      toast({
        title: "Mant-Item Provider deleted!",
        description: "The Mant-Item Provider has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Mant-Item Provider:", error);
      toast({
        title: "Error deleting Mant-Item Provider",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<MantItemProvider>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "mant_items.description",
      header: "Item Manten.",
      cell: ({ row }) => row.original.mant_items?.description || "N/A",
    },
    {
      accessorKey: "providers.name",
      header: "Proveedor",
      cell: ({ row }) => row.original.providers?.name || "N/A",
    },
    {
      accessorKey: "priority",
      header: "Prioridad",
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* <h2 className="text-2xl font-bold">
          Planes de Mantenimiento por Vehículo
        </h2> */}
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Asignar Proveedor
        </Button>
      </div>

      <div className="rounded-md border">
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
      </div>

      <FormAddMantItemProvider
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddMantItemProvider={(newItem) => {
          setData([...data, newItem]);
          setIsAddDialogOpen(false);
        }}
      />

      {editingMantItemProvider && (
        <FormEditMantItemProvider
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          mantItemProvider={editingMantItemProvider}
          onEditMantItemProvider={(editedItem) => {
            setData(
              data.map((item) =>
                item.id === editedItem.id ? editedItem : item
              )
            );
            setIsEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
