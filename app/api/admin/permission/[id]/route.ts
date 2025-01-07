import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedPermission = await db.permission.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedPermission);
  } catch (error) {
    console.error("[PERMISSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.permission.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PERMISSION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
