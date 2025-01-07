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

    const planVehicles = await db.vehicleMantPlan.findMany({
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
        // Incluimos el plan de mantenimiento
        mantPlan: true,
      },

      // orderBy: {
      //   assignedAt: "desc",
      // },

      // ejemplo de cómo se hace unordenamiento en base a varios campos
      orderBy: [
        // {
        //   tenantId: "asc",
        // },
        {
          assignedAt: "desc",
        },
        {
          vehiclePlate: "asc",
        },
        {
          mantPlanId: "asc",
        },
      ],
    });

    // Transformamos los datos para incluir los nombres de marca y línea directamente
    const formattedPlanVehicles = planVehicles.map((plan) => ({
      id: plan.id,
      userId,
      tenantId: "",
      vehiclePlate: plan.vehiclePlate,
      brandName: plan.vehicle.brand.name,
      lineName: plan.vehicle.line.name,
      mantPlanId: plan.mantPlanId,
      planDescription: plan.mantPlan.description,
      assignedAt: plan.assignedAt,
      completedKm: plan.completedKm,
      status: plan.status,
      lastKmCheck: plan.lastKmCheck,
    }));

    return NextResponse.json(formattedPlanVehicles);
  } catch (error) {
    console.error("[PLAN_VEHICLE_GET]", error);
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
      mantPlanId,
      status = "ACTIVE", // Estado por defecto
      assignedAt,
      lastKmCheck,
      completedKm,
    } = await req.json();

    const planVehicle = await db.vehicleMantPlan.create({
      data: {
        userId,
        tenantId: "",
        vehiclePlate,
        mantPlanId,
        assignedAt,
        completedKm,
        status,
        state: "EN_PROCESO",
        lastKmCheck,
      },
      include: {
        vehicle: {
          include: {
            brand: true,
            line: true,
          },
        },
        mantPlan: true,
      },
    });

    const planTasks = await db.plan_Tasks.findMany({
      where: {
        planId: mantPlanId,
      },
      include: {
        mant_items: true,
      },
    });

    console.log("planTasks:", planTasks);

    const vehicleMantPlanItems = await Promise.all(
      planTasks.map(async (task) => {
        // const itemProvider = await db.mantItemsProvider.findFirst({
        //   where: {
        //     mantItemId: task.mantItemId,
        //   },
        // });

        // if (!itemProvider) {
        //   console.warn(`No provider found for mantItemId: ${task.mantItemId}`);
        //   return null;
        // }

        return db.vehicleMantPlanItem.create({
          data: {
            vehicleMantPlanId: planVehicle.id,
            mantItemId: task.mantItemId,
            // providerId: itemProvider.providerId,
            providerId: 0,
            actualDuration: 0,
            executionMileage: lastKmCheck + task.triggerKm,
            state: "PENDIENTE",
          },
        });
      })
    );

    console.log("vehicleMantPlanItems: ", vehicleMantPlanItems);

    // Filtrar los items nulos (casos donde no se encontró proveedor)
    // const createdItems = vehicleMantPlanItems.filter((item) => item !== null);

    // Formatear la respuesta para que coincida con la estructura esperada
    const formattedResponse = {
      id: planVehicle.id,
      userId,
      tenantId: "",
      vehiclePlate: planVehicle.vehiclePlate,
      brandName: planVehicle.vehicle.brand.name,
      lineName: planVehicle.vehicle.line.name,
      mantPlanId: planVehicle.mantPlanId,
      planDescription: planVehicle.mantPlan.description,
      assignedAt: planVehicle.assignedAt,
      completedKm: planVehicle.completedKm,
      status: planVehicle.status,
      lastKmCheck: planVehicle.lastKmCheck,
      // items: createdItems,
    };
    console.log("formattedResponse ", formattedResponse);

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("[PLAN_VEHICLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
