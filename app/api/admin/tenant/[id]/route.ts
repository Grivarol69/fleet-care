import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await req.json();
    const updatedTenant = await db.tenant.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("[TENANT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.tenant.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TENANT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
