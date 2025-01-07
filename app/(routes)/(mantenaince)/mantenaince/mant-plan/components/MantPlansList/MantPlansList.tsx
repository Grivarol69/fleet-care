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
import { FormAddMantPlan } from "../FormAddMantPlan/FormAddMantPlan";
import FormEditMantPlan from "../FormEditMantPlan/FormEditMantPlan";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { MantPlansListProps } from "./MantPlansList.types";
import { MantPlan } from "../FormEditMantPlan/FormEditMantPlan.types";
import Image from "next/image";
import { MantPlanItem } from "../FormAddMantPlan/FormAddMantPlan.types";

export function MantPlansList() {
  const [data, setData] = useState<MantPlansListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMantPlan, setEditingMantPlan] =
    useState<MantPlansListProps | null>(null);

  const { toast } = useToast();

  const fetchMantPlans = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/mant-plan`);
      // Transformar los datos para manejar la relación anidada
      // const transformedData = response.data.map((plan: any) => ({
      //   ...plan,
      //   vehicleBrandName: plan.brand?.name || "N/A",
      //   vehicleLineName: plan.line?.name || "N/A",
      // }));
      // setData(transformedData);

      setData(response.data);
    } catch (error) {
      console.error("Error fetching MantPlans: ", error);
      toast({
        title: "Error fetching MantPlans",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMantPlans();
  }, []);

  const handleAddMantPlan = (newItem: MantPlanItem) => {
    // Aseguramos que el nuevo item tenga la misma estructura que el resto de los datos
    const formattedItem: MantPlansListProps = {
      ...newItem,
      brand: newItem.brand || { id: newItem.vehicleBrandId, name: "" },
      line: newItem.line || { id: newItem.vehicleLineId, name: "" },
    };
    setData([...data, formattedItem]);
  };

  const handleEdit = (MantPlan: MantPlansListProps) => {
    setEditingMantPlan(MantPlan);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/mant-plan/${id}`);
      setData(data.filter((plan) => plan.id !== id));
      toast({
        title: "Plan deleted!",
        description: "The Plan has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Plan:", error);
      toast({
        title: "Error deleting Plan",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<MantPlansListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "brand.name", // Accedemos directamente al nombre de la marca
      header: "Marca",
      cell: ({ row }) => row.original.brand?.name || "N/A",
    },
    {
      accessorKey: "line.name", // Accedemos directamente al nombre de la línea
      header: "Línea",
      cell: ({ row }) => row.original.line?.name || "N/A",
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
        Agregar Plan de Mantenimiento
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
      <FormAddMantPlan
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        // onAddMantPlan={(item) => setData([...data, item])}
        onAddMantPlan={handleAddMantPlan}
      />
      {editingMantPlan && (
        <FormEditMantPlan
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingMantPlan}
          onEditMantPlan={(editedMantPlan: MantPlansListProps) => {
            setData(
              data.map((plan) =>
                plan.id === editedMantPlan.id ? editedMantPlan : plan
              )
            );
          }}
        />
      )}
    </div>
  );
}
