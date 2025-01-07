import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DocumentStats } from "./components/DocumentStats";
import { MaintenanceStats } from "./components/MantenainceStats";
import { DashboardChart } from "./components/DashboardChart";

const maintenanceStats = [
  { name: "Al día", value: 65, color: "#22c55e" },
  { name: "Próximos", value: 25, color: "#eab308" },
  { name: "Vencidos", value: 10, color: "#ef4444" },
];

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-20">
        {/* <DashboardUi /> */}
      </div>
      <div className="grid grid-cols-1 mt-12 xl:grid-cols-2 md:gap-x-10">
        {/* <DashboardChart stats={maintenanceStats} /> */}
        <MaintenanceStats />
        <DocumentStats />
      </div>
    </div>
  );
}
