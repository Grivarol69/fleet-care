"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardChart from "../DashboardChart/DashboardChart";
import Image from "next/image";

export const MantenainceStats = () => {
  const maintenanceStats = [
    { name: "Al día", value: 65, color: "#22c55e" },
    { name: "Próximos", value: 25, color: "#eab308" },
    { name: "Vencidos", value: 10, color: "#ef4444" },
  ];

  const maintenanceAlerts = [
    {
      plate: "ABC123",
      vehicle: "Toyota Hilux",
      maintenance: "Cambio de Aceite",
      kmLeft: 500,
      status: "warning",
    },
    {
      plate: "DAS141",
      vehicle: "Toyota Hilux",
      maintenance: "Cambio de Aceite",
      kmLeft: 300,
      status: "danger",
    },
  ];

  const getStatusColor = (status: any) => {
    switch (status) {
      case "danger":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    // <div className="container mx-auto px-4 py-6 max-w-7xl">
    // <div className="grid grid-cols-12 gap-6">
    //   <div className="col-span-12 md:col-span-8 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Mantenimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceAlerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{alert.plate}</TableCell>
                <TableCell>{alert.maintenance}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      alert.status
                    )}`}
                  >
                    {alert.kmLeft}km
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    //   </div>
    // </div>
    // </div>
  );
};
