import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedLine = await db.vehicle_Line.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedLine);
  } catch (error) {
    console.error("[LINE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.vehicle_Line.update({
      where: { id: parseInt(id) },
      data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LINE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
