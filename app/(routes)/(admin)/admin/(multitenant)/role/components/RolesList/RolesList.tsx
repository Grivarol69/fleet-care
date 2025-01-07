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
import { FormAddRole } from "../FormAddRole";
import { FormEditRole } from "../FormEditRole";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { RolesListProps } from "./RolesList.types";
import Image from "next/image";

export function RolesList() {
  const [data, setData] = useState<RolesListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RolesListProps | null>(null);

  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`/api/admin/role`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Roles: ", error);
      toast({
        title: "Error fetching Roles",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role: RolesListProps) => {
    setEditingRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/role/${id}`);
      setData(data.filter((role) => role.id !== id));
      toast({
        title: "Role deleted!",
        description: "The role has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error deleting role",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<RolesListProps>[] = [
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
        Agregar Roles
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
      <FormAddRole
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddRole={(item) => setData([...data, item])}
      />
      {editingRole && (
        <FormEditRole
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingRole}
          onEditRole={(editedTenant: RolesListProps) => {
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
