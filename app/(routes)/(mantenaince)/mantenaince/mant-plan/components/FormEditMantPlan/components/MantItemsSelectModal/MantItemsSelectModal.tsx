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
import { Decimal } from "@prisma/client/runtime/library";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  MantItemsSelectModalProps,
  MantItem,
} from "../SharedTypes/SharedTypes";
// import { Mant_Items } from "@prisma/client";

// export interface MantItem {
//   id: number;
//   description: string;
//   mant_type: "PREVENTIVO" | "PREDICTIVO" | "CORRECTIVO" | "ON_DEMAND";
//   estimated_time: Decimal;
//   idCategory: number;
//   mant_categories?: {
//     id: number;
//     description: string;
//   };
// }

// export interface MantItemsSelectModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   planId?: number;
//   mant_items: MantItem[];
//   onSelectMantItem: (mantItem: MantItem) => void;
// }

export function MantItemsSelectModal({
  isOpen,
  setIsOpen,
  mantItem,
  onSelectMantItems,
}: MantItemsSelectModalProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<MantItem>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Descripción",
        accessorKey: "description",
      },
      {
        header: "Tipo",
        accessorKey: "mant_type",
      },
      {
        header: "Tiempo (horas)",
        accessorKey: "estimated_time",
        cell: ({ row }) => {
          const time = row.original.estimated_time;
          return typeof time === "object" && time.toString
            ? time.toString()
            : time;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: mantItem,
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
          <DialogTitle>Seleccionar Item Mantenimiento</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar item mant..."
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
                  onClick={() => onSelectMantItems(row.original)}
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
