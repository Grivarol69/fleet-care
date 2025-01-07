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
import { FormAddUser } from "../FormAddUser/FormAddUser";
import { FormEditUser } from "../FormEditUser/FormEditUser";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { UsersListProps } from "./UsersList.types";
import Image from "next/image";

export function UsersList() {
  const [data, setData] = useState<UsersListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsersListProps | null>(null);

  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/admin/user`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Users: ", error);
      toast({
        title: "Error fetching Users",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UsersListProps) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/user/${id}`);
      setData(data.filter((user) => user.id !== id));
      toast({
        title: "User deleted!",
        description: "The user has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<UsersListProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "firstName",
      header: "Nombre",
    },
    {
      accessorKey: "lastName",
      header: "Apellidos",
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
        Agregar Usuario
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
      <FormAddUser
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddUser={(item) => setData([...data, item])}
      />
      {editingUser && (
        <FormEditUser
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          item={editingUser}
          onEditUser={(editedTenant: UsersListProps) => {
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
