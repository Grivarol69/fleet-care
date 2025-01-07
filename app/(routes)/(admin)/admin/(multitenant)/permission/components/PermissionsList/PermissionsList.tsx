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
import { FormAddPermission } from "../FormAddPermission";
import { FormEditPermission } from "../FormEditPermission";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { PermissionsListProps } from "./PermissionsList.types";
import Image from "next/image";

export function PermissionsList() {
  const [data, setData] = useState<PermissionsListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<PermissionsListProps | null>(null);

  const { toast } = useToast();

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`/api/admin/permission`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Permissions: ", error);
      toast({
        title: "Error fetching Permissions",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleEdit = (Permission: PermissionsListProps) => {
    setEditingPermission(Permission);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/permission/${id}`);
      setData(data.filter((permission) => permission.id !== id));
      toast({
        title: "Permission deleted!",
        description: "The Permission has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting Permission:", error);
      toast({
        title: "Error deleting Permission",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<PermissionsListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
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
        Agregar Permiso
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
      <FormAddPermission
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddPermission={(item) => setData([...data, item])}
      />
      {editingPermission && (
        <FormEditPermission
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingPermission}
          onEditPermission={(editedPermission: PermissionsListProps) => {
            setData(
              data.map((permission) =>
                permission.id === editedPermission.id
                  ? editedPermission
                  : permission
              )
            );
          }}
        />
      )}
    </div>
  );
}
