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
  Provider,
  MantItem,
  WorkOrderItem,
  FormAddWorkOrderItemProps,
  FormEditWorkOrderItemProps,
} from "../SharedTypes/SharedTypes";
import { FormAddItemWorkOrder } from "../FormAddItemWorkOrder";
import { FormEditItemWorkOrder } from "../FormEditItemWorkOrder";
import { ItemWorkOrdersListProps } from "../SharedTypes/SharedTypes";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function ItemWorkOrdersList({
  workOrderId,
  onItemsChange,
}: ItemWorkOrdersListProps) {
  const [data, setData] = useState<WorkOrderItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkOrderItem, setEditingWorkOrderItem] =
    useState<WorkOrderItem | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const { toast } = useToast();

  const fetchWorkOrderItemByOTId = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/item-work-order`);
      console.log("ItemsPlanVehicle: ", response.data);

      const filteredItems = response.data.filter(
        (item: WorkOrderItem) => item.woId === workOrderId
      );
      setData(filteredItems);
      // Notificar al padre que hubo cambios
      if (onItemsChange) {
        onItemsChange();
      }
    } catch (error) {
      console.error("Error fetching Items Work Order: ", error);
      toast({
        title: "Error fetching Items Work Order",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorkOrderItemByOTId();
  }, [refreshKey]);

  const handleItemAdded = async (item: WorkOrderItem) => {
    setData([...data, item]);
    setRefreshKey((prev) => prev + 1);
    if (onItemsChange) {
      onItemsChange();
    }
  };

  const handleEdit = (item: WorkOrderItem) => {
    setEditingWorkOrderItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/item-work-order/${id}`);
      setData(data.filter((item) => item.id !== id));
      setRefreshKey((prev) => prev + 1);
      if (onItemsChange) {
        onItemsChange();
      }
      toast({
        title: "Items Work Order deleted!",
        description: "The Items Work Order has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Items Work Order:", error);
      toast({
        title: "Error deleting Items Work Order",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    if (onItemsChange) {
      onItemsChange();
    }
  };

  const columns: ColumnDef<WorkOrderItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "mant_item.description",
      header: "Item Manten.",
      cell: ({ row }) => row.original.mantItemDescription || "N/A",
    },
    {
      accessorKey: "providers.name",
      header: "Proveedor",
      cell: ({ row }) => row.original.providerName || "N/A",
    },
    {
      accessorKey: "startDate",
      header: "Fecha Inicio",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "Fecha Fin",
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
    },
    {
      accessorKey: "cost",
      header: "Importe",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
    {
      accessorKey: "notes",
      header: "Detalles",
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
          Agregar Item Orden Trabajo
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

      <FormAddItemWorkOrder
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        workOrderId={workOrderId}
        onAddWorkOrderItem={(workOrderItem) => {
          // setData([...data, workOrderItem]);
          handleItemAdded(workOrderItem);
          setIsAddDialogOpen(false);
        }}
      />

      {editingWorkOrderItem && (
        <FormEditItemWorkOrder
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          workOrderItem={editingWorkOrderItem}
          onEditWorkOrderItem={(editedItem) => {
            setData(
              data.map((item) =>
                item.id === editedItem.id ? editedItem : item
              )
            );
            setRefreshKey((prev) => prev + 1);
            if (onItemsChange) {
              onItemsChange();
            }
            setIsEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
