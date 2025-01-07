import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const planTasks = await db.plan_Tasks.findMany({
      include: {
        mant_items: true,
      },
    });
    return NextResponse.json(planTasks);
  } catch (error) {
    console.error("[PLAN_TASKS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const data = await req.json();
    console.log("data: ", data);

    const { id, ...otherData } = data;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const planTask = await db.plan_Tasks.create({
      data: {
        userId,
        ...otherData,
      },
    });

    return NextResponse.json(planTask);
  } catch (error) {
    console.log("[PLAN_TASKS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
