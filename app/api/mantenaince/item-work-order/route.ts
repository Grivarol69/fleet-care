// File: /app/api/tenants/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemWorkOrder = await db.workOrderItem.findMany({
      include: {
        mant_item: true, // Incluimos todos los campos de la marca
        provider: true, // Incluimos todos los campos de la línea
      },
      orderBy: {
        id: "desc", // Ordenamos por ID descendente para ver los más recientes primero
      },
    });

    const formattedItems = itemWorkOrder.map((item) => ({
      id: item.id,
      woId: item.woId,
      mantItemId: item.mantItemId,
      providerId: item.providerId,
      mantItemDescription: item.mant_item.description,
      providerName: item.provider.name,
      startDate: item.startDate,
      endDate: item.endDate,
      cost: item.cost,
      actualDuration: item.actualDuration,
      executionMileage: item.executionMileage,
      notes: item.notes,
      state: item.state,
    }));
    // console.log("formattedItems: ", formattedItems);

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("[ITEM_WORK_ORDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = await req.json();

    const itemsWorkOrder = await db.workOrderItem.create({
      data: {
        userId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        cost: payload.cost,
        actualDuration: payload.actualDuration,
        executionMileage: payload.executionMileage,
        notes: payload.notes,
        state: payload.state,
        workOrder: { connect: { id: payload.woId } },
        mant_item: { connect: { id: payload.mantItemId } },
        provider: { connect: { id: payload.providerId } },
      },
      include: {
        workOrder: true,
        mant_item: true,
        provider: true,
      },
    });

    // Actualizar realAmount en WorkOrder
    const workOrder = await db.workOrder.findUnique({
      where: { id: payload.woId },
      include: { workOrderItems: true },
    });

    if (!workOrder) {
      throw new Error("WorkOrder not found");
    }

    const nuevoMonto =
      Number(workOrder.realAmount) + Number(itemsWorkOrder.cost);

    const newRealAmount =
      workOrder.workOrderItems.reduce(
        (sum, item) => sum + (Number(item.cost) || 0),
        0
      ) + (Number(payload.cost) || 0);

    await db.workOrder.update({
      where: { id: payload.woId },
      data: {
        // realAmount: new Prisma.Decimal(newRealAmount),
        realAmount: nuevoMonto,
      },
    });

    return NextResponse.json(itemsWorkOrder);
  } catch (error) {
    console.error("[ROLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
