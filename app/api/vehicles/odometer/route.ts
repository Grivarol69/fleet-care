import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Alerts_State, Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const { vehiclePlate, kilometers, recordedAt } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const odometerLog = await db.odometerLog.create({
      data: {
        vehiclePlate,
        kilometers,
        recordedAt,
      },
    });

    const vehicleMantPlan = await db.vehicleMantPlan.findFirst({
      where: {
        vehiclePlate: vehiclePlate,
        status: "ACTIVE",
      },
      include: {
        vehicleMantPlanItem: {
          include: {
            mantItem: true,
          },
        },
      },
    });

    if (!vehicleMantPlan) {
      return NextResponse.json({
        odometerLog,
        maintenanceAlerts: [],
        message: "No hay plan de mantenimiento activo para este vehículo",
      });
    }

    const maintenanceAlerts = vehicleMantPlan.vehicleMantPlanItem
      .map((item) => {
        const kmToMaintenance = item.executionMileage - kilometers;

        let state: Alerts_State;
        if (kmToMaintenance > 1000) {
          state = Alerts_State.GREEN;
        } else if (kmToMaintenance >= 500) {
          state = Alerts_State.YELLOW;
        } else {
          state = Alerts_State.RED;
        }

        return {
          itemId: item.id,
          vehiclePlate,
          mantItemDescription: item.mantItem.description,
          currentKm: kilometers,
          executionKm: item.executionMileage,
          kmToMaintenance,
          state,
        };
      })
      .filter((alert) => alert.state !== Alerts_State.GREEN);

    console.log("Procesando alertas:", maintenanceAlerts);

    // Crear las alertas una por una con la estructura correcta
    for (const alert of maintenanceAlerts) {
      try {
        const createdAlert = await db.maintenanceAlerts.create({
          data: {
            mantItemDescription: alert.mantItemDescription,
            currentKm: alert.currentKm,
            executionKm: alert.executionKm,
            kmToMaintenance: alert.kmToMaintenance,
            status: Status.ACTIVE,
            state: alert.state,
            vehicle: {
              connect: {
                licensePlate: alert.vehiclePlate,
              },
            },
          },
        });
        console.log("Alerta creada:", createdAlert);
      } catch (error) {
        console.error("Error al crear alerta:", error);
        console.error("Datos de la alerta que falló:", alert);
      }
    }

    await db.vehicleMantPlan.update({
      where: {
        id: vehicleMantPlan.id,
      },
      data: {
        lastKmCheck: kilometers,
      },
    });

    return NextResponse.json({
      odometerLog,
      maintenanceAlerts,
    });
  } catch (error) {
    console.error("[MODEL_ODOMETERLOG]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
