import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mantItems = await db.mant_Items.findMany({
      include: {
        mant_categories: true,
      },
    });
    return NextResponse.json(mantItems);
  } catch (error) {
    console.error("[MANT_ITEMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tenantId, description, mant_type, estimated_time, idCategory } =
      await req.json();

    const mantItems = await db.mant_Items.create({
      data: {
        userId,
        tenantId,
        description,
        mant_type,
        estimated_time,
        mant_categories: {
          connect: {
            id: idCategory,
          },
        },
      },
      include: {
        mant_categories: true,
      },
    });

    return NextResponse.json(mantItems);
  } catch (error) {
    console.log("[MANT_ITEMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
