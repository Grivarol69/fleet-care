// File: /app/api/vehicles/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const modelVehicles = await db.model_Vehicle.findMany({
      where: { status: "ACTIVE" },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
        line: {
          select: {
            name: true,
          },
        },
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedModelVehicles = modelVehicles.map((mv) => ({
      id: mv.id,
      brandId: mv.brandId,
      brandName: mv.brand.name,
      lineId: mv.lineId,
      lineName: mv.line.name,
      typeId: mv.typeId,
      typeName: mv.type.name,
      year: mv.year,
      engine: mv.engine,
      wheels: mv.wheels,
    }));

    return NextResponse.json(formattedModelVehicles);
  } catch (error) {
    console.error("[MODEL_VEHICLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { brandId, lineId, typeId, year, engine, wheels } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const modelVehicle = await db.model_Vehicle.create({
      data: {
        userId,
        brandId,
        lineId,
        typeId,
        year,
        engine,
        wheels,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(modelVehicle);
  } catch (error) {
    console.log("[MODEL_VEHICLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
