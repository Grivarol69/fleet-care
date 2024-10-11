// File: /app/api/vehicles/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vehicles = await db.vehicle.findMany({
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

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      photo: vehicle.photo,
      licensePlate: vehicle.licensePlate,
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

    // // Primero verificamos si el Model_Vehicle existe
    // const existingModelVehicle = await db.model_Vehicle.findUnique({
    //   where: { id: modelVehicleId },
    // });

    // if (!existingModelVehicle) {
    //   return new NextResponse("Model Vehicle Not Found", { status: 404 });
    // }

    const vehicle = await db.vehicle.create({
      data: {
        userId,
        status: "ACTIVE",
        // modelVehicle: {
        //   connect: { id: modelVehicleId }, // Aquí se conecta con un Model_Vehicle existente por su ID
        // },
        ...otherData,
      },
      // include: {
      //   modelVehicle: true,
      // },
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
