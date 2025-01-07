import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedMantPlan = await db.mant_Plan.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedMantPlan);
  } catch (error) {
    console.error("[MANT_PLAN_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.mant_Plan.update({
      where: { id: parseInt(id) },
      data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MANT_PLAN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
