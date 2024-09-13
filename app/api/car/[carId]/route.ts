import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { carId: string } }
) {
  const { userId } = auth();
  const { isPublish } = await req.json();
  const { carId } = params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const car = await db.car.update({
      where: {
        id: carId,
        userId,
      },
      data: {
        isPublish: isPublish,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.log("[DELETE CAR ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const { userId } = auth();
    const data = await req.json();
    const { carId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedCar = await db.car.delete({
      where: {
        id: carId,
      },
    });

    return NextResponse.json(deletedCar);
  } catch (error) {
    console.log("[DELETE CAR ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
