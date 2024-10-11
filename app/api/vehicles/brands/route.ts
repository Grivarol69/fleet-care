import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await db.vehicle_Brand.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("[BRANDS_GET]", error);
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

    const brand = await db.vehicle_Brand.create({
      data: {
        userId,
        name,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log("[BRAND_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
