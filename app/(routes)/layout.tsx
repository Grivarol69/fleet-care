import React from "react";
import { Sidebar } from "./(dashboard)/dashboard/components/Sidebar";
import { SidebarSub } from "./(dashboard)/dashboard/components/SidebarSub";
import { NavbarDashboard } from "./(dashboard)/dashboard/components/NavbarDashboard";
import { Navbar } from "@/components/shared/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <div className="hidden h-full xl:block w-80 xl:fixed border-r">
        {/* <Sidebar /> */}
        <SidebarSub />
      </div>
      <div className="w-full h-full xl:ml-80">
        <NavbarDashboard />
        {/* <Navbar /> */}
        <div className="p-6 h-max">{children}</div>
      </div>
    </div>
  );
}
