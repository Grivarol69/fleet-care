import { LogoDashboard } from "../LogoDashboard";
import { SidebarSubRoutes } from "../SidebarSubRoutes";

export function SidebarSub() {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-full">
        <LogoDashboard />
        <SidebarSubRoutes />
      </div>
    </div>
  );
}
