import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedRole = await db.role.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("[ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.role.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ROLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
