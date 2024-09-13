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
import { FormAddLine } from "../FormAddLine";
import { FormEditLine } from "../FormEditLine";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { LineListProps } from "./LineList.types";

export function LineList() {
  const [data, setData] = useState<LineListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<LineListProps | null>(null);

  const { toast } = useToast();

  const fetchLines = async () => {
    try {
      const response = await axios.get(`/api/vehicles/lines`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Lines: ", error);
      toast({
        title: "Error fetching Lines",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const handleEdit = (line: LineListProps) => {
    setEditingLine(line);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/vehicles/lines/${id}`);
      setData(data.filter((line) => line.id !== id));
      toast({
        title: "Line deleted!",
        description: "The line has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting line:", error);
      toast({
        title: "Error deleting line",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<LineListProps>[] = [
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
        Agregar Linea
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
      <FormAddLine
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddLine={(newLine) => setData([...data, newLine])}
      />
      {editingLine && (
        <FormEditLine
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          line={editingLine}
          onEditLine={(editedLine) => {
            setData(
              data.map((cat) => (cat.id === editedLine.id ? editedLine : cat))
            );
          }}
        />
      )}
    </div>
  );
}
