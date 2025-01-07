"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatData {
  name: string;
  value: number;
  color: string;
}

interface DashboardChartProps {
  stats: StatData[];
}

export const DashboardChart = ({ stats }: DashboardChartProps) => {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={stats}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {stats.map((stat: StatData, index: number) => (
              <Cell key={`cell-${index}`} fill={stat.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-4">
        {stats.map((stat: StatData, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-sm">
              {stat.name}: {stat.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardChart;
