import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedWorkOrder = await db.workOrder.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedWorkOrder);
  } catch (error) {
    console.error("[WORK_ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.workOrder.update({
      where: { id: parseInt(id) },
      data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WORK_ORDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
