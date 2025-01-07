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
import { FormAddPlanTask } from "../FormAddPlanTask";
import { FormEditPlanTask } from "../FormEditPlanTask";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { PlanTask } from "../SharedTypes/SharedTypes";

export function PlanTasksList({ planId }: { planId: number }) {
  const [data, setData] = useState<PlanTask[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlanTask, setEditingPlanTask] = useState<PlanTask | null>(null);

  const { toast } = useToast();

  const fetchPlanTasksByPlanId = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/plan-task`);
      const filteredTasks = response.data.filter(
        (task: any) => task.planId === planId
      );
      setData(filteredTasks);
    } catch (error) {
      console.error("Error fetching Plan-Tasks: ", error);
      toast({
        title: "Error fetching Plan-Tasks",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPlanTasksByPlanId();
  }, []);

  const handleEdit = (MantPlan: PlanTask) => {
    setEditingPlanTask(MantPlan);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/plan-task/${id}`);
      setData(data.filter((task) => task.id !== id));
      toast({
        title: "Task deleted!",
        description: "The task has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<PlanTask>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "mant_items.description",
      header: "Item Mantenimiento",
      cell: ({ row }) => row.original.mant_items?.description || "N/A",
    },
    {
      accessorKey: "triggerKm",
      header: "Kilometraje",
    },
    {
      header: "Acciones",
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
        Agregar Tarea
      </Button>
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
      <FormAddPlanTask
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        planId={planId} // Pasamos el planId al formulario de agregar
        onAddPlanTask={(item) => setData([...data, item])}
      />
      {editingPlanTask && (
        <FormEditPlanTask
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingPlanTask}
          onEditPlanTask={(editedPlanTask: PlanTask) => {
            setData(
              data.map((task) =>
                task.id === editedPlanTask.id ? editedPlanTask : task
              )
            );
          }}
        />
      )}
    </div>
  );
}
