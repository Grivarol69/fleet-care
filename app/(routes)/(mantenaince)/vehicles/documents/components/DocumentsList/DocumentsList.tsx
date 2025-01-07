"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormAddDocument } from "../FormAddDocument";
import { FormEditDocument } from "../FormEditDocument";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { DocumentsListProps } from "./DocumentsList.types";
import { ArrowUpDown } from "lucide-react";

export function DocumentsList() {
  const [data, setData] = useState<DocumentsListProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<DocumentsListProps | null>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`/api/vehicles/documents`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Documents: ", error);
      toast({
        title: "Error fetching Documents",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleEdit = (document: DocumentsListProps) => {
    setEditingDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/vehicles/documents/${id}`);
      setData(data.filter((doc) => doc.id !== id));
      toast({
        title: "Document deleted!",
        description: "The document has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error deleting document",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<DocumentsListProps>[] = [
    {
      accessorKey: "vehiclePlate",
      // header: "Placa Vehiculo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Placa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Documento",
    },
    {
      accessorKey: "fileName",
      header: "Nro Documento",
    },
    {
      accessorKey: "uploadDate",
      // header: "Fecha Subida",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Subida
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      // header: "Fecha Vencimiento",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vencimiento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "insurance",
      header: "Aseguradora",
    },
    {
      accessorKey: "status",
      header: "Estado",
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
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Agregar Documento
      </Button>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por placa"
          value={
            (table.getColumn("vehiclePlate")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("vehiclePlate")?.setFilterValue(event.target.value)
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
      <FormAddDocument
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddDocument={(newDocument) => setData([...data, newDocument])}
      />
      {editingDocument && (
        <FormEditDocument
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          document={editingDocument}
          onEditDocument={(editedDocument) => {
            setData(
              data.map((doc) =>
                doc.id === editedDocument.id ? editedDocument : doc
              )
            );
          }}
        />
      )}
    </div>
  );
}
