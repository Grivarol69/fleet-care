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
import { FormAddBrand } from "../FormAddBrand";
import { FormEditBrand } from "../FormEditBrand";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { BrandListProps } from "./BrandList.types";

export function BrandList() {
  const [data, setData] = useState<BrandListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandListProps | null>(null);

  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`/api/vehicles/brands`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Brands: ", error);
      toast({
        title: "Error fetching Brands",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleEdit = (brand: BrandListProps) => {
    setEditingBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/brands/${id}`);
      setData(data.filter((brand) => brand.id !== id));
      toast({
        title: "Brand deleted!",
        description: "The brand has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({
        title: "Error deleting brand",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<BrandListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nombre",
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
        Agregar Marca
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
      <FormAddBrand
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddBrand={(newBrand) => setData([...data, newBrand])}
      />
      {editingBrand && (
        <FormEditBrand
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          brand={editingBrand}
          onEditBrand={(editedBrand) => {
            setData(
              data.map((cat) => (cat.id === editedBrand.id ? editedBrand : cat))
            );
          }}
        />
      )}
    </div>
  );
}
