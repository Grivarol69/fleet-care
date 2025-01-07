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

// interface Vehicles {
//   licensePlate: string;
//   typePlate: string;
//   brandId?: number;
//   lineId?: number;
//   typeId?: number;
//   brandName: string;
//   lineName: string;
//   typeName: string;
//   year: number;
// }

// interface VehicleSelectModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   vehicles: Vehicles[];
//   onSelectVehicle: (vehicles: Vehicles) => void;
// }

import { VehicleSelectModalProps, Vehicle } from "../SharedTypes/SharedTypes";

export function VehicleSelectModal({
  isOpen,
  setIsOpen,
  vehicles,
  onSelectVehicle,
}: VehicleSelectModalProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        header: "Placa",
        accessorKey: "licensePlate",
      },
      {
        header: "Tipo Placa",
        accessorKey: "typePlate",
      },
      {
        header: "Marca",
        accessorKey: "brandName",
      },
      {
        header: "Línea",
        accessorKey: "lineName",
      },
      {
        header: "Tipo",
        accessorKey: "typeName",
      },
      {
        header: "Año",
        accessorKey: "year",
      },
    ],
    []
  );

  const table = useReactTable({
    data: vehicles,
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
          <DialogTitle>Seleccionar Vehículo</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar vehiculo..."
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
                  onClick={() => onSelectVehicle(row.original)}
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
