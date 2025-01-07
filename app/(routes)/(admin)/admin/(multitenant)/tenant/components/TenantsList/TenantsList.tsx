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
import { FormAddTenant } from "../FormAddTenant";
import { FormEditTenant } from "../FormEditTenant";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { TenantsListProps } from "./TenantsList.types";
import { ImageIcon } from "lucide-react";

// Componente ImageCell para manejar la visualización de la imagen
const ImageCell = ({
  imageUrl,
  altText,
}: {
  imageUrl: string;
  altText: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para verificar si la URL es válida
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setIsLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        setImageError(true);
      };
    }
  }, [imageUrl]);

  if (!imageUrl || !isValidUrl(imageUrl) || imageError) {
    return (
      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gray-100">
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative h-[70px] w-[70px]">
      <div
        className={`h-full w-full rounded-full bg-cover bg-center bg-no-repeat transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-100">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      )}
      <div className="absolute inset-0 rounded-full border border-gray-200" />
    </div>
  );
};

export function TenantsList() {
  const [data, setData] = useState<TenantsListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantsListProps | null>(
    null
  );

  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`/api/admin/tenant`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Tenants: ", error);
      toast({
        title: "Error fetching Tenants",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = (tenant: TenantsListProps) => {
    setEditingTenant(tenant);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/tenant/${id}`);
      setData(data.filter((tenant) => tenant.id !== id));
      toast({
        title: "Tenant deleted!",
        description: "The tenant has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast({
        title: "Error deleting tenant",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<TenantsListProps>[] = [
    {
      accessorKey: "photo",
      header: "Imagen",
      cell: ({ row }) => (
        <ImageCell
          imageUrl={row.original.photo}
          altText={`Imagen de ${row.original.name}`}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "domain",
      header: "Dominio",
    },
    {
      accessorKey: "rut_nit",
      header: "RUT-NIT",
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
        Agregar Tenant
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
      <FormAddTenant
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddTenant={(item) => setData([...data, item])}
      />
      {editingTenant && (
        <FormEditTenant
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingTenant}
          onEditTenant={(editedTenant: TenantsListProps) => {
            setData(
              data.map((tenant) =>
                tenant.id === editedTenant.id ? editedTenant : tenant
              )
            );
          }}
        />
      )}
    </div>
  );
}
