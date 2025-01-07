// File: /app/api/people/mant-item-provider/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const mantItemsProviders = await db.mantItemsProvider.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        mant_items: true, // Incluimos todos los campos de la marca
        providers: true, // Incluimos todos los campos de la línea
      },
      orderBy: {
        id: "desc", // Ordenamos por ID descendente para ver los más recientes primero
      },
    });
    return NextResponse.json(mantItemsProviders);
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

    const { priority, mantItemId, providerId } = await req.json();
    const mantItemsProviders = await db.mantItemsProvider.create({
      data: {
        userId,
        tenantId: "",
        priority,
        status: "ACTIVE",
        mant_items: {
          // Relación con MantItems
          connect: {
            id: mantItemId,
          },
        },
        providers: {
          // Relación con Providers
          connect: {
            id: providerId,
          },
        },
      },
      include: {
        mant_items: true,
        providers: true,
      },
    });

    return NextResponse.json(mantItemsProviders);
  } catch (error) {
    console.error("[MANT-ITEMS-PROVIDER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
