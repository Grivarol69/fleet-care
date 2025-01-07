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
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { DocumentProps } from "../SharedTypes/sharedTypes";

import { FormAddDocument } from "../FormAddDocument";
import { FormEditDocument } from "../FormEditDocument";

export function DocumentsList({ vehiclePlate }: { vehiclePlate: string }) {
  const [data, setData] = useState<DocumentProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentProps | null>(
    null
  );

  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`/api/vehicles/documents`);

      console.log("Documents: ", response.data);

      const filteredDocuments = response.data.filter(
        (document: DocumentProps) => document.vehiclePlate === vehiclePlate
      );
      setData(filteredDocuments);
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

  const handleEdit = (document: DocumentProps) => {
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

  const columns: ColumnDef<DocumentProps>[] = [
    {
      accessorKey: "vehiclePlate",
      header: "Placa Vehiculo",
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
      header: "Fecha Subida",
    },
    {
      accessorKey: "expiryDate",
      header: "Fecha Vencimiento",
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* <h2 className="text-2xl font-bold">
          Planes de Mantenimiento por Vehículo
        </h2> */}
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Agregar Documento
        </Button>
      </div>

      <div className="rounded-md border">
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
      </div>

      <FormAddDocument
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        vehiclePlate={vehiclePlate}
        onAddDocument={(newItem) => {
          setData([...data, newItem]);
          setIsAddDialogOpen(false);
        }}
      />

      {editingDocument && (
        <FormEditDocument
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          vehiclePlate={vehiclePlate}
          document={editingDocument}
          onEditDocument={(editedDocument) => {
            setData(
              data.map((item) =>
                item.id === editedDocument.id ? editedDocument : item
              )
            );
            setIsEditDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
