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
  WorkOrder,
  Vehicle,
  Provider,
  Technician,
  FormAddWorkOrderProps,
  FormEditWorkOrderProps,
} from "../SharedTypes/SharedTypes";
import { FormAddWorkOrder } from "../FormAddWorkOrder";
import { FormEditWorkOrder } from "../FormEditWorkOrder";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function WorkOrdersList() {
  const [data, setData] = useState<WorkOrder[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(
    null
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const { toast } = useToast();

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/work-order`);
      setData(response.data);
      console.log("response.data: ", response.data);
    } catch (error) {
      console.error("Error fetching Work Order: ", error);
      toast({
        title: "Error fetching Work Order",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [refreshKey]);

  const handleEdit = (item: WorkOrder) => {
    setEditingWorkOrder(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/work-order/${id}`);
      setData(data.filter((item) => item.id !== id));
      toast({
        title: "Work Order deleted!",
        description: "The Work Order has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Work Order:", error);
      toast({
        title: "Error deleting Work Order",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: "vehiclePlate",
      header: "Placa Vehículo",
    },
    {
      accessorKey: "brandName",
      header: "Marca",
      // cell: ({ row }) => row.original.vehicle?.brand?.name || "N/A",
    },
    {
      accessorKey: "lineName",
      header: "Linea",
      // cell: ({ row }) => row.original.vehicle?.line?.name || "N/A",
    },
    {
      accessorKey: "plannedAmount",
      header: "Monto Planeado",
      cell: ({ row }) => formatCurrency(row.original.plannedAmount),
    },
    {
      accessorKey: "realAmount",
      header: "Monto Ejecutado",
      cell: ({ row }) => (
        <span
          className={
            row.original.realAmount > row.original.plannedAmount
              ? "text-red-500"
              : ""
          }
        >
          {formatCurrency(row.original.realAmount)}
        </span>
      ),
    },
    {
      accessorKey: "creationDate",
      header: "Creación",
      cell: ({ row }) =>
        new Date(row.original.creationDate).toLocaleDateString(),
    },
    {
      accessorKey: "startDate",
      header: "Inicio",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
    },
    {
      accessorKey: "creationMileage",
      header: "KM Inicio",
    },
    {
      accessorKey: "providerName",
      header: "Proveedor",
      // cell: ({ row }) => row.original.provider?.name || "N/A",
    },
    {
      accessorKey: "technicianName",
      header: "Técnico Involucrado",
      // cell: ({ row }) => row.original.technician?.name || "N/A",
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
        <Button onClick={() => setIsAddDialogOpen(true)}>Agregar OT</Button>
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

      <FormAddWorkOrder
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddWorkOrder={(workorder) => {
          // fetchWorkOrders();
          setData([...data, workorder]);
          setIsAddDialogOpen(false);
        }}
      />

      {editingWorkOrder && (
        <FormEditWorkOrder
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingWorkOrder}
          onEditWorkOrder={(workorder) => {
            setData(
              data.map((item) => (item.id === workorder.id ? workorder : item))
            );

            // setIsEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
