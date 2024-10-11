"use client";

import { useState, useEffect, useMemo, forwardRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnFiltersState,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
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

import { FormAddVehicle } from "../FormAddVehicles";
import { FormEditVehicle } from "../FormEditVehicles";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { VehicleListProps, VehicleEditProps } from "./VehiclesList.types";
import Image from "next/image";
import { DownloadBtn } from "./DownloadBtn";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { FormAddVehicleDocuments } from "../FormAddVehiclesDoc";
import { FormEditVehicleDocument } from "../FormEditVehiclesDoc";

export function VehicleList() {
  const [data, setData] = useState<VehicleListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleEditProps | null>(
    null
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`/api/vehicles/vehicles`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Vehicles: ", error);
      toast({
        title: "Error fetching Vehicles",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle: VehicleListProps) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/vehicles/${id}`);
      setData(data.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Vehicle deleted!",
        description: "The Vehicle has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      toast({
        title: "Error deleting vehicle",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnDef<VehicleListProps>[]>(
    () => [
      {
        accessorKey: "photo",
        header: "Imagen",
        cell: ({ row }) => (
          <Image
            src={row.original.photo}
            alt={`Imagen de ${row.original.licensePlate}`}
            height={70}
            width={70}
            className="rounded-full object-cover"
          />
        ),
      },
      {
        accessorKey: "licensePlate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Placa
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "brandName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Marca
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      { accessorKey: "lineName", header: "Linea" },
      { accessorKey: "typeName", header: "Tipo" },
      { accessorKey: "typePlate", header: "Tipo Placa" },
      { accessorKey: "cylinder", header: "Cilindraje" },
      { accessorKey: "bodyWork", header: "Carrocería" },
      { accessorKey: "engineNumber", header: "Nro Motor" },
      { accessorKey: "chasisNumber", header: "Nro Chasis" },
      { accessorKey: "ownerCard", header: "Tarjeta Propietario" },
      { accessorKey: "mileage", header: "KM" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "owner", header: "Propietario" },
      { accessorKey: "year", header: "Año" },
      { accessorKey: "situation", header: "Estado" },
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
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="mb-4 inline"
        >
          Agregar Vehículo
        </Button>

        <DownloadBtn data={data} fileName="vehicles" />
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por placa"
          value={
            (table.getColumn("licensePlate")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("licensePlate")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

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
          {table.getRowModel().rows.map((row, i) => (
            <TableRow
              key={row.id}
              className={`
              ${i % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}
            `}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-end mt-2 gap-2">
        <Button
          size="sm"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
          // className="p-1 border boder-gray-300 px-2 disabled:opacity-30"
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
          // className="p-1 border boder-gray-300 px-2 disabled:opacity-30"
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Pagina: </div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Ir a Página:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            className="border p-1 rounded w-16 bg-transparent"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-transparent"
        >
          {[5, 10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
      <FormAddVehicleDocuments
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddVehicle={(vehicle) => {
          setData([...data, vehicle]);
          fetchVehicles();
        }}
      />
      {editingVehicle && (
        <FormEditVehicleDocument
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          vehicle={editingVehicle}
          onEditVehicle={(editedVehicle) => {
            setData(
              data.map((mod) =>
                mod.id === editedVehicle.id ? editedVehicle : mod
              )
            );
          }}
        />
      )}
    </div>
  );
}
