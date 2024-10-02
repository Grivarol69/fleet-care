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
import { FormAddModel } from "../FormAddModel";
import { FormEditModel } from "../FormEditModel";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { ModelVehicleListItem } from "./ModelList.types";

export function ModelList() {
  const [data, setData] = useState<ModelVehicleListItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelVehicleListItem | null>(
    null
  );

  const { toast } = useToast();

  const fetchModels = async () => {
    try {
      const response = await axios.get(`/api/vehicles/model-vehicles`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Brands: ", error);
      toast({
        title: "Error fetching Brands",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleEdit = (model: ModelVehicleListItem) => {
    setEditingModel(model);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/model-vehicles/${id}`);
      setData(data.filter((model) => model.id !== id));
      toast({
        title: "Model deleted!",
        description: "The Model has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Model:", error);
      toast({
        title: "Error deleting model",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ModelVehicleListItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "brandId",
      header: "Id",
      cell: ({ row }) => <div>{row.getValue("brandId")}</div>,
    },
    {
      accessorKey: "brandName",
      header: "Marca",
      cell: ({ row }) => <div>{row.getValue("brandName")}</div>,
    },
    {
      accessorKey: "lineId",
      header: "Id",
      cell: ({ row }) => <div>{row.getValue("lineId")}</div>,
    },
    {
      accessorKey: "lineName",
      header: "Línea",
      cell: ({ row }) => <div>{row.getValue("lineName")}</div>,
    },
    {
      accessorKey: "typeId",
      header: "Id",
      cell: ({ row }) => <div>{row.getValue("typeId")}</div>,
    },
    {
      accessorKey: "typeName",
      header: "Tipo",
      cell: ({ row }) => <div>{row.getValue("typeName")}</div>,
    },
    {
      accessorKey: "year",
      header: "Año",
      cell: ({ row }) => <div>{row.getValue("year")}</div>,
    },
    {
      accessorKey: "engine",
      header: "Motor",
      cell: ({ row }) => <div>{row.getValue("engine")}</div>,
    },
    {
      accessorKey: "wheels",
      header: "Ruedas",
      cell: ({ row }) => <div>{row.getValue("wheels")}</div>,
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
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4 inline">
        Agregar Modelo
      </Button>
      <h1>Modelo de Vehículos</h1>
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
      <FormAddModel
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddModel={(newModel) => {
          setData([...data, newModel]);
          fetchModels();
        }}
      />
      {editingModel && (
        <FormEditModel
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          model={editingModel}
          onEditModel={(editedModel) => {
            setData(
              data.map((mod) => (mod.id === editedModel.id ? editedModel : mod))
            );
            fetchModels();
          }}
        />
      )}
    </div>
  );
}
