import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const technicians = await db.technician.findMany({
      where: { status: "ACTIVE" },
    });
    return NextResponse.json(technicians);
  } catch (error) {
    console.error("[TECHNICIANS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const data = await req.json();

    const { id, ...otherData } = data;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const technician = await db.technician.create({
      data: {
        status: "ACTIVE",
        ...otherData,
      },
    });

    return NextResponse.json(technician);
  } catch (error) {
    console.log("[TECHNICIAN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
