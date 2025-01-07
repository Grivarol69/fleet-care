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

    const planes = await db.mant_Plan.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        brand: true, // Incluimos todos los campos de la marca
        line: true, // Incluimos todos los campos de la línea
      },
      orderBy: {
        id: "desc", // Ordenamos por ID descendente para ver los más recientes primero
      },
    });
    return NextResponse.json(planes);
  } catch (error) {
    console.error("[MANT_PLAN_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { description, vehicleBrandId, vehicleLineId, tenantId } =
      await req.json();
    const plan = await db.mant_Plan.create({
      data: {
        userId,
        tenantId,
        description,
        status: "ACTIVE",
        brand: {
          // Relación con Vehicle_Brand
          connect: {
            id: vehicleBrandId,
          },
        },
        line: {
          // Relación con Vehicle_Line
          connect: {
            id: vehicleLineId,
          },
        },
      },
      include: {
        brand: true,
        line: true,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("[ROLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
