"use client";

import React from "react";
import { ListCarsProps } from "./ListCars.types";
import { Car } from "@prisma/client";
import Image from "next/image";
import { Fuel, Gauge, Gem, Heart, Users, Wrench } from "lucide-react";

export function ListCars(props: ListCarsProps) {
  const { cars } = props;

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {cars.map((car: Car) => {
        const {
          priceDay,
          photo,
          cv,
          engine,
          transmission,
          id,
          people,
          name,
          type,
        } = car;

        return (
          <div key={id} className="p-1 rounded-lg shadow-md hover:shadow-lg">
            <Image
              src={photo}
              alt={name}
              width={400}
              height={600}
              className="rounded-lg"
            />
            <div className="p-3">
              <div className="flex flex-col mb-3 gap-x-4">
                <p className="text-xl min-h-16 lg:min-h-fit">{name}</p>
                <p>{priceDay} $/día</p>
              </div>
              <p className="flex items-center">
                <Gem className="h-4 w-4 mr-2" strokeWidth={1} />
                {type}
              </p>

              <p className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" strokeWidth={1} />
                {car.transmission}
              </p>

              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2" strokeWidth={1} />
                {car.people}
              </p>

              <p className="flex items-center">
                <Fuel className="h-4 w-4 mr-2" strokeWidth={1} />
                {car.engine}
              </p>

              <p className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" strokeWidth={1} />
                {car.cv} CV
              </p>
              <div className="flex items-center justify-center gap-x-3">
                <p>Modal App Reservation</p>
                <Heart
                  className={`mt-2 cursor-pointer`}
                  onClick={() => console.log("HEART")}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
