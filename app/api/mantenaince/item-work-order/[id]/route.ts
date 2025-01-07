import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedItemWorkOrder = await db.workOrderItem.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedItemWorkOrder);
  } catch (error) {
    console.error("[ITEM_WORK_ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    //Busco el ItemWorkOrder
    const itemWO = await db.workOrderItem.findUnique({
      where: { id: parseInt(id) },
    });
    console.log("ItemWorkOrder: ", itemWO);

    //busco su correspondiente WorkOrder
    const workOrder = await db.workOrder.findUnique({
      where: { id: itemWO?.woId },
    });
    console.log("WorkOrder: ", workOrder);

    //le resto a realAmount el costo del item a eliminar
    const resultado = Number(workOrder?.realAmount) - Number(itemWO?.cost);
    console.log("resultado: ", resultado);

    //actualizo el nuevo valor en WorkOrder
    const updatedWorkOrder = await db.workOrder.update({
      where: { id: itemWO?.woId },
      data: {
        // realAmount: new Prisma.Decimal(newRealAmount),
        realAmount: resultado,
      },
    });
    console.log("workOrderActualizado: ", updatedWorkOrder.realAmount);

    await db.workOrderItem.delete({
      where: { id: parseInt(id) },
      //   data: { status: "INACTIVE" },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ITEM_WORK_ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
