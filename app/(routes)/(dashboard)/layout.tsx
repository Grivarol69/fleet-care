import React from "react";
import { Sidebar } from "./dashboard/components/Sidebar";
import { SidebarSub } from "./dashboard/components/SidebarSub";
import { NavbarDashboard } from "./dashboard/components/NavbarDashboard";

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
        <div className="p-6 h-max">{children}</div>
      </div>
    </div>
  );
}
