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

    const workorders = await db.workOrder.findMany({
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
        // Incluimos proveedores y técnicos
        provider: true,
        technician: true,
      },

      orderBy: {
        creationDate: "desc",
      },
    });

    // Transformamos los datos para incluir los nombres de marca y línea directamente
    const formattedWorkOrders = workorders.map((item) => ({
      id: item.id,
      userId,
      tenantId: "",
      vehiclePlate: item.vehiclePlate,
      brandName: item.vehicle.brand.name,
      lineName: item.vehicle.line.name,
      maintenanceType: item.maintenanceType,
      priority: item.priority,
      creationDate: item.creationDate,
      startDate: item.startDate,
      endDate: item.endDate,
      plannedAmount: item.plannedAmount,
      realAmount: item.realAmount,
      otstatus: item.otstatus,
      creationMileage: item.creationMileage,
      technicianId: item.technicianId,
      providerId: item.providerId,
      technicianName: item.technician?.name,
      providerName: item.provider?.name,
      remarks: item.remarks,
      status: item.status,
    }));

    return NextResponse.json(formattedWorkOrders);
  } catch (error) {
    console.error("[WORK_ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Método POST

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      vehiclePlate,
      maintenanceType,
      priority,
      creationDate,
      startDate,
      endDate,
      plannedAmount,
      realAmount,
      otstatus,
      creationMileage,
      providerId,
      technicianId,
      remarks,
      status = "ACTIVE", // Estado por defecto
    } = await req.json();

    const workOrder = await db.workOrder.create({
      data: {
        userId,
        tenantId: "",
        vehiclePlate,
        maintenanceType,
        priority,
        creationDate,
        startDate,
        endDate,
        plannedAmount,
        realAmount,
        otstatus,
        creationMileage,
        providerId,
        technicianId,
        remarks,
        status,
      },
      include: {
        vehicle: {
          include: {
            brand: true,
            line: true,
          },
        },
        technician: true,
        provider: true,
      },
    });

    console.log("workOrder: ", workOrder);

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error("[WORK_ORDER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
