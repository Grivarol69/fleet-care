// File: /app/api/vehicles/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vehicles = await db.vehicle.findMany({
      where: { status: "ACTIVE" },
      //
      include: {
        brand: true, // Incluir todo el objeto brand
        line: true, // Incluir todo el objeto line
        type: true, // Incluir todo el objeto type
      },
    });

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      photo: vehicle.photo,
      licensePlate: vehicle.licensePlate,
      brandId: vehicle.brandId,
      lineId: vehicle.lineId,
      typeId: vehicle.typeId,
      brandName: vehicle.brand.name,
      lineName: vehicle.line.name,
      typeName: vehicle.type.name,
      cylinder: vehicle.cylinder,
      bodyWork: vehicle.bodyWork,
      engineNumber: vehicle.engineNumber,
      chasisNumber: vehicle.chasisNumber,
      ownerCard: vehicle.ownerCard,
      typePlate: vehicle.typePlate,
      mileage: vehicle.mileage,
      color: vehicle.color,
      owner: vehicle.owner,
      year: vehicle.year,
      situation: vehicle.situation,
    }));

    return NextResponse.json(formattedVehicles);
  } catch (error) {
    console.error("[VEHICLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const data = await req.json();
    console.log(data);

    const { id, ...otherData } = data;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await db.vehicle.create({
      data: {
        userId,
        status: "ACTIVE",

        ...otherData,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    /* console.log("[MODEL_VEHICLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 }); */
    console.error("[MODEL_VEHICLE_POST]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
