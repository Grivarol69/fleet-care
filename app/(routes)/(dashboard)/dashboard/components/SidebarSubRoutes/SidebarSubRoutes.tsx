"use client";

import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { dataGeneralSidebar, dataAdminSidebar } from "./SidebarSubRoutes.data";
import { SidebarSubItem } from "./SidebarSubItem";

export function SidebarSubRoutes() {
  const { userId } = useAuth();

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="p-2 md:p-6">
          <p className="mb-2 text-sm font-semibold text-slate-500">GENERAL</p>
          {dataGeneralSidebar.map((item) => (
            <SidebarSubItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p className="mb-2 text-sm font-semibold text-slate-500">ADMIN</p>
          {dataAdminSidebar.map((item) => (
            <SidebarSubItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
