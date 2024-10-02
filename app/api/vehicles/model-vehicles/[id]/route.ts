// File: /app/api/vehicles/[id]/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedModelVehicle = await db.model_Vehicle.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedModelVehicle);
  } catch (error) {
    console.error("[MODEL_VEHICLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.model_Vehicle.update({
      where: { id: parseInt(id) },
      data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MODEL_VEHICLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
