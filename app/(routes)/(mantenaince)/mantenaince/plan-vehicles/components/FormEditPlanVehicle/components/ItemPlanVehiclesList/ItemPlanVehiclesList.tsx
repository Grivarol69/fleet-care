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
  VehicleMantPlanItem,
  FormAddItemPlanVehicleProps,
  FormEditItemPlanVehicleProps,
} from "../SharedTypes/SharedTypes";
import { FormAddItemPlanVehicle } from "../FormAddItemPlanVehicle";
import { FormEditItemPlanVehicle } from "../FormEditItemPlanVehicle";

export function ItemPlanVehiclesList({ planId }: { planId: number }) {
  const [data, setData] = useState<VehicleMantPlanItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicleMantPlanItem, setEditingVehicleMantPlanItem] =
    useState<VehicleMantPlanItem | null>(null);

  const { toast } = useToast();

  const fetchItemPlanVehiclesByPlanId = async () => {
    try {
      const response = await axios.get(`/api/mantenaince/item-plan-vehicle`);
      console.log("ItemsPlanVehicle: ", response.data);

      const filteredItems = response.data.filter(
        (item: VehicleMantPlanItem) => item.vehicleMantPlanId === planId
      );
      setData(filteredItems);
    } catch (error) {
      console.error("Error fetching VehicleMantPlanItem: ", error);
      toast({
        title: "Error fetching VehicleMantPlanItem",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchItemPlanVehiclesByPlanId();
  }, []);

  const handleEdit = (item: VehicleMantPlanItem) => {
    setEditingVehicleMantPlanItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/mantenaince/item-plan-vehicle/${id}`);
      setData(data.filter((item) => item.id !== id));
      toast({
        title: "VehicleMantPlanItem deleted!",
        description: "The VehicleMantPlanItem has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting VehicleMantPlanItem:", error);
      toast({
        title: "Error deleting VehicleMantPlanItem",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<VehicleMantPlanItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "mant_items.description",
      header: "Item Manten.",
      cell: ({ row }) => row.original.mantItem?.description || "N/A",
    },
    {
      accessorKey: "providers.name",
      header: "Proveedor",
      cell: ({ row }) => row.original.provider?.name || "N/A",
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
          Agregar Item Plan
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

      <FormAddItemPlanVehicle
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddItemPlanVehicle={(newItem) => {
          setData([...data, newItem]);
          setIsAddDialogOpen(false);
        }}
      />

      {editingVehicleMantPlanItem && (
        <FormEditItemPlanVehicle
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          itemPlanVehicle={editingVehicleMantPlanItem}
          onEditItemPlanVehicle={(editedItem) => {
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
