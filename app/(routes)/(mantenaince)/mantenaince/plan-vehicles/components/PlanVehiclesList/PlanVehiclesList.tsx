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
  PlanVehicle,
  Vehicle,
  MantPlan,
  FormAddPlanVehicleProps,
  FormEditPlanVehicleProps,
} from "../SharedTypes/SharedTypes";
import { FormAddPlanVehicle } from "../FormAddPlanVehicle";
import { FormEditPlanVehicle } from "../FormEditPlanVehicle";

export function PlanVehiclesList() {
  const [data, setData] = useState<PlanVehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlanVehicle, setEditingPlanVehicle] =
    useState<PlanVehicle | null>(null);

  const { toast } = useToast();

  const fetchPlanVehicle = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/plan-vehicle`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Plans Vehicle: ", error);
      toast({
        title: "Error fetching Plans Vehicle",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPlanVehicle();
  }, []);

  const handleEdit = (item: PlanVehicle) => {
    setEditingPlanVehicle(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/plan-vehicle/${id}`);
      setData(data.filter((item) => item.id !== id));
      toast({
        title: "Plan Vehicle deleted!",
        description: "The Plan Vehicle has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Plan Vehicle:", error);
      toast({
        title: "Error deleting Plan Vehicle",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<PlanVehicle>[] = [
    {
      accessorKey: "vehiclePlate",
      header: "Placa Vehículo",
    },
    {
      accessorKey: "brandName",
      header: "Marca",
    },
    {
      accessorKey: "lineName",
      header: "Linea",
    },
    {
      accessorKey: "planDescription",
      header: "Plan",
    },
    {
      accessorKey: "assignedAt",
      header: "Asignado",
      cell: ({ row }) => new Date(row.original.assignedAt).toLocaleDateString(),
    },
    {
      accessorKey: "completedKm",
      header: "KM Completados",
    },
    {
      accessorKey: "lastKmCheck",
      header: "Último Km",
    },
    {
      accessorKey: "status",
      header: "Estado",
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
        <Button onClick={() => setIsAddDialogOpen(true)}>Agregar Plan</Button>
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

      <FormAddPlanVehicle
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddPlanVehicle={(newPlan) => {
          setData([...data, newPlan]);
          setIsAddDialogOpen(false);
        }}
      />

      {editingPlanVehicle && (
        <FormEditPlanVehicle
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingPlanVehicle}
          onEditPlanVehicle={(editedPlan) => {
            setData(
              data.map((item) =>
                item.id === editedPlan.id ? editedPlan : item
              )
            );
            setIsEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
