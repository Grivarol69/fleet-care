import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tipos = await db.vehicle_Type.findMany();
    return NextResponse.json(tipos);
  } catch (error) {
    console.error("[TYPE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tipo = await db.vehicle_Type.create({
      data: {
        userId,
        name,
      },
    });

    return NextResponse.json(tipo);
  } catch (error) {
    console.log("[TYPE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
