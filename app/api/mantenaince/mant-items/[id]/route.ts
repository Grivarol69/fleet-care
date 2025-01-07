import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedMantItem = await db.mant_Items.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedMantItem);
  } catch (error) {
    console.error("[MANT_ITEM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.mant_Items.delete({
      where: { id: parseInt(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MANT_ITEM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
