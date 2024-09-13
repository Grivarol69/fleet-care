import { Reveal } from "@/components/shared/Reveal";
import Image from "next/image";
import React from "react";

export function FirstBlock() {
  return (
    <div className="grid lg:grid-cols-2 lg:px-0 lg:py-24 items-center">
      <Reveal className="p-6 lg:pl-40" position="bottom">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
          Premium
          <span className="block">Software Mantenimiento </span> Yevimaquinas
        </h1>
        <p className="text-lg mt-2 lg:mt-5 lg:text-xl max-w-sm">
          Don't deny yourself pleasure of driving the best premium cars from
          around the world here and now
        </p>
      </Reveal>
      <Reveal className="flex justify-evenly" position="right">
        <Image
          src="/images/frangers.jpg"
          alt="Rent Cars"
          width={600}
          height={600}
          priority
        />
      </Reveal>
    </div>
  );
}
