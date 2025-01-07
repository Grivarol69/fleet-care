// File: /app/api/tenants/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const permissions = await db.permission.findMany();
    return NextResponse.json(permissions);
  } catch (error) {
    console.error("[PERMISSIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, tenantId, description } = await req.json();
    const permission = await db.permission.create({
      data: { name, tenantId, description },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("[PERMISSION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
