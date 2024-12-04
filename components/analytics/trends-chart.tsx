"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card } from "@/components/ui/card";
import { IncidentTrend } from "@/lib/types/analytics";

interface TrendsChartProps {
  data: IncidentTrend[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value} incidents
        </p>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Incident Trends</h2>
      <div className="h-[400px] w-full" role="graphics-document" aria-label="Monthly incident trends chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted" 
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{ fill: 'currentColor', opacity: 0.1 }}
            />
            <Bar
              dataKey="incidents"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              isAnimationActive={true}
              animationDuration={1000}
              role="graphics-symbol"
              aria-label="Incident count bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}