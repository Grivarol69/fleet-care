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

    const roles = await db.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("[ROLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, tenantId } = await req.json();
    const role = await db.role.create({
      data: { name, tenantId },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error("[ROLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
