import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lines = await db.vehicle_Line.findMany({
      where: { status: "ACTIVE" },
    });
    return NextResponse.json(lines);
  } catch (error) {
    console.error("[LINE_GET]", error);
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

    const line = await db.vehicle_Line.create({
      data: {
        userId,
        name,
        status: "ACTIVE", // Asegúrate de establecer el estado inicial
      },
    });

    return NextResponse.json(line);
  } catch (error) {
    console.log("[LINE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
