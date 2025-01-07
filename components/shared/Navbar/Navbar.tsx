"use client";

import React from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { userId } = useAuth();

  return (
    <div className="max-w-5xl py-5 mx-auto">
      <div className="justify-between lg:flex">
        <Link href="/" className="flex items-center justify-center gap-x-2">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <span className="text-xl font-bold">Fleet-Care</span>
        </Link>
        <div className="flex items-center justify-center gap-x-7">
          <Link href="/vehicles/fleet" className="text-1xl">
            Lista de Vehículos
          </Link>
          <Link href="/dashboard" className="text-1xl">
            Dashboard
          </Link>
          {userId ? (
            <>
              <Link href="/loved-cars">
                <Heart strokeWidth={1} className={`cursor-pointer`} />
              </Link>
              <UserButton />
            </>
          ) : (
            <Link href="/sign-in" className="flex gap-x-3">
              <Button>
                Iniciar Sesión
                <User className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
