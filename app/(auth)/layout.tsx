import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-2 h-full items-center justify-center bg-red-200">
      <div className="flex items-center justify-center">{children}</div>
      <div className="hidden lg:flex lg:bg-slate-300 h-full justify-center items-center lg:flex-col">
        <Image src="/logo.svg" alt="Logo Fleet Care" width="80" height="80" />
        <h1 className="text-xl font-bold">Fleet Care</h1>
      </div>
    </div>
  );
}
