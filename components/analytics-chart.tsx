"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", incidents: 4 },
  { month: "Feb", incidents: 3 },
  { month: "Mar", incidents: 2 },
  { month: "Apr", incidents: 6 },
  { month: "May", incidents: 4 },
  { month: "Jun", incidents: 3 },
];

export function AnalyticsChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            axisLine={true}
            tickLine={true}
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            axisLine={true}
            tickLine={true}
            width={60}
            padding={{ top: 20, bottom: 20 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            contentStyle={{ 
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              padding: '8px'
            }}
          />
          <Bar 
            dataKey="incidents" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}