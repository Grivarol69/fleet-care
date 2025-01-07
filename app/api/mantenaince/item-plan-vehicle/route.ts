// File: /app/api/tenants/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemPlanVehicle = await db.vehicleMantPlanItem.findMany({
      include: {
        mantItem: true, // Incluimos todos los campos de la marca
        provider: true, // Incluimos todos los campos de la línea
      },
      orderBy: {
        id: "desc", // Ordenamos por ID descendente para ver los más recientes primero
      },
    });

    // const formattedItems = itemPlanVehicle.map((item) => ({
    //   id: item.id,
    //   vehicleMantPlanId: item.vehicleMantPlanId,
    //   mantItemId: item.mantItemId,
    //   providerId: item.providerId,

    //   brandName: vehicle.brand.name,
    //   lineName: vehicle.line.name,
    //   typeName: vehicle.type.name,
    //   cylinder: vehicle.cylinder,
    //   bodyWork: vehicle.bodyWork,
    //   engineNumber: vehicle.engineNumber,
    //   chasisNumber: vehicle.chasisNumber,
    //   ownerCard: vehicle.ownerCard,
    //   typePlate: vehicle.typePlate,
    //   mileage: vehicle.mileage,
    //   color: vehicle.color,
    //   owner: vehicle.owner,
    //   year: vehicle.year,
    //   situation: vehicle.situation,
    // }));

    return NextResponse.json(itemPlanVehicle);
  } catch (error) {
    console.error("[MANT_PLAN_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      vehicleMantPlanId,
      mantItemId,
      providerId,
      startDate,
      endDate,
      cost,
      actualDuration,
      executionMileage,
      notes,
      state,
    } = await req.json();
    const itemsMantPlan = await db.vehicleMantPlanItem.create({
      data: {
        startDate,
        endDate,
        cost,
        actualDuration,
        executionMileage,
        notes,
        state,
        vehicleMantPlan: {
          connect: {
            id: vehicleMantPlanId,
          },
        },
        mantItem: {
          // Relación con MantItems
          connect: {
            id: mantItemId,
          },
        },
        provider: {
          // Relación con Providers
          connect: {
            id: providerId,
          },
        },
      },
      include: {
        mantItem: true,
        provider: true,
      },
    });

    return NextResponse.json(itemsMantPlan);
  } catch (error) {
    console.error("[ROLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
