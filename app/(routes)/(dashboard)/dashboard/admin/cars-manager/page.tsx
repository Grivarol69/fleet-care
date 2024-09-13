import { auth } from "@clerk/nextjs/server";
import { ButtonAddCar } from "./components/ButtonAddCar";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TableCars } from "./components/TableCars";
import ListCars from "./components/ListCars/ListCars";

export default async function CarsManagerPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const car = await db.car.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage your car</h2>
        <ButtonAddCar />
      </div>
      {/* <ListCars cars={car} /> */}

      <div className="py-10">
        <div className="container">
          <h1 className="mb-16 text-2xl font-medium">
            Vehículos de la Empresa
          </h1>
          <TableCars cars={car} />
        </div>
      </div>
    </div>
  );
}
