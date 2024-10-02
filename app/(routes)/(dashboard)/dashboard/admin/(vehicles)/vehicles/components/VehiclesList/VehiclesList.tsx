"use client";

import { useState, useEffect, useMemo, forwardRef } from "react";
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

import { FormAddVehicle } from "../FormAddVehicles";
import { FormEditVehicle } from "../FormEditVehicles";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { VehicleListProps } from "./VehiclesList.types";
import Image from "next/image";

export function VehicleList() {
  const [data, setData] = useState<VehicleListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleListProps | null>(
    null
  );
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`/api/vehicles/vehicles`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Vehicles: ", error);
      toast({
        title: "Error fetching Vehicles",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle: VehicleListProps) => {
    console.log(vehicle);
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/vehicles/${id}`);
      setData(data.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Vehicle deleted!",
        description: "The Vehicle has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      toast({
        title: "Error deleting vehicle",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnDef<VehicleListProps>[]>(
    () => [
      {
        accessorKey: "photo",
        header: "Imagen",
        cell: ({ row }) => (
          <Image
            src={row.original.photo}
            alt={`Imagen de ${row.original.licensePlate}`}
            height={70}
            width={70}
            className="rounded-full object-cover"
          />
        ),
      },
      { accessorKey: "licensePlate", header: "Placa" },
      { accessorKey: "brandName", header: "Marca" },
      { accessorKey: "lineName", header: "Linea" },
      { accessorKey: "typeName", header: "Tipo" },
      { accessorKey: "typePlate", header: "Tipo Placa" },
      { accessorKey: "mileage", header: "KM" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "owner", header: "Propietario" },
      { accessorKey: "year", header: "Año" },
      { accessorKey: "situation", header: "Estado" },
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
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4 inline">
        Agregar Vehículo
      </Button>
      <h1>Vehículos</h1>
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
      <FormAddVehicle
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        // onAddVehicle={handleAddVehicle}
        onAddVehicle={(newVehicle) => {
          setData([...data, newVehicle]);
          fetchVehicles();
        }}
      />
      {editingVehicle && (
        <FormEditVehicle
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          vehicle={editingVehicle}
          onEditVehicle={(editedVehicle) => {
            setData(
              data.map((mod) =>
                mod.id === editedVehicle.id ? editedVehicle : mod
              )
            );
          }}
        />
      )}
    </div>
  );
}
