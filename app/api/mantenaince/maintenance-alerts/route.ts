import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET: Obtener todos los planes de vehículos con sus relaciones
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const maintenanceAlerts = await db.maintenanceAlerts.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        // Incluimos el vehículo y sus relaciones
        vehicle: {
          include: {
            brand: true, // Incluye la marca
            line: true, // Incluye la línea
          },
        },
      },

      orderBy: [
        {
          vehiclePlate: "asc",
        },
      ],
    });

    // Transformamos los datos para incluir los nombres de marca y línea directamente
    const formattedMaintenanceAlerts = maintenanceAlerts.map((item) => ({
      id: item.id,
      photo: item.vehicle.photo || "",
      vehiclePlate: item.vehiclePlate,
      brandName: item.vehicle.brand.name,
      lineName: item.vehicle.line.name,
      mantItemDescription: item.mantItemDescription,
      currentKm: item.currentKm,
      executionKm: item.executionKm,
      kmToMaintenance: item.kmToMaintenance,
      status: item.status,
      state: item.state as "YELLOW" | "RED",
    }));

    return NextResponse.json(formattedMaintenanceAlerts);
  } catch (error) {
    console.error("[MAINTENANCE_ALERTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
