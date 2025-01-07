import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  WorkOrderSelectModalProps,
  WorkOrder,
} from "../SharedTypes/SharedTypes";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function WorkOrderSelectModal({
  isOpen,
  setIsOpen,
  workorder,
  onSelectWorkOrder,
}: WorkOrderSelectModalProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<WorkOrder>[]>(
    () => [
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
        cell: ({ row }) =>
          new Date(row.original.startDate).toLocaleDateString(),
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
    ],
    []
  );

  const table = useReactTable({
    data: workorder,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Orden de Trabajo</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar Items..."
          value={globalFilter}
          onChange={handleSearch}
          className="mb-4"
        />
        <div className="overflow-x-auto">
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
                <TableRow
                  key={row.id}
                  onClick={() => onSelectWorkOrder(row.original)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
