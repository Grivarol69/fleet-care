import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const providers = await db.provider.findMany({
      where: { status: "ACTIVE" },
    });
    return NextResponse.json(providers);
  } catch (error) {
    console.error("[PROVIDERS_GET]", error);
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

    const providers = await db.provider.create({
      data: {
        userId,
        status: "ACTIVE",
        ...otherData,
      },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.log("[PROVIDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
