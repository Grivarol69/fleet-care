import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedTechnician = await db.technician.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedTechnician);
  } catch (error) {
    console.error("[TECHNICIAN_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.technician.update({
      where: { id: parseInt(id) },
      data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TECHNICIAN_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
