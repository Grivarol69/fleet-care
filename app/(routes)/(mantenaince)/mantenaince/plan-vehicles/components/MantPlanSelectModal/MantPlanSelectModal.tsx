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

// interface MantPlans {
//   id: number;
//   tenantId: string;
//   description: string;
//   vehicleBrandId: number;
//   vehicleLineId: number;
//   vehicleBrandName: string;
//   vehicleLineName: string;

//   status: string;
// }

// interface MantPlansSelectModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   mantplans: MantPlans[];
//   onSelectMantPlan: (mantplans: MantPlans) => void;
// }

import { MantPlanSelectModalProps, MantPlan } from "../SharedTypes/SharedTypes";

export function MantPlanSelectModal({
  isOpen,
  setIsOpen,
  mantplans,
  onSelectMantPlan,
}: MantPlanSelectModalProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<MantPlan>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        header: "Marca",
        accessorKey: "vehicleBrandName",
      },
      {
        header: "Línea",
        accessorKey: "vehicleLineName",
      },
    ],
    []
  );

  const table = useReactTable({
    data: mantplans,
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
          <DialogTitle>Seleccionar Mant-Plan</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar Mant-Plan..."
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
                  onClick={() => onSelectMantPlan(row.original)}
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
