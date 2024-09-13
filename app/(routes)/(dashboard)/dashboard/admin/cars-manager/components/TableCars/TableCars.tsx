"use client";

import Image from "next/image";
import { TableCarsProps } from "./TableCars.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DatatableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  caption?: string;
}

export function TableCars(props: TableCarsProps) {
  const { cars } = props;

  return (
    <Table>
      <TableCaption>List of Cars</TableCaption>
      <TableHeader>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Power</TableHead>
        <TableHead>Transmission</TableHead>
        <TableHead>Passenger</TableHead>
        <TableHead>Engine</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Price Of Day</TableHead>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>
              <Image src={car.photo} alt="Photo" width={60} height={60} />
            </TableCell>

            <TableCell>{car.name}</TableCell>
            <TableCell>{car.cv}</TableCell>
            <TableCell>{car.transmission}</TableCell>
            <TableCell>{car.people}</TableCell>
            <TableCell>{car.engine}</TableCell>
            <TableCell>{car.type}</TableCell>
            <TableCell>{car.priceDay}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
