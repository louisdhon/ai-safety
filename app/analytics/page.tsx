import { Suspense } from "react";
import { TrendsChart } from "@/components/analytics/trends-chart";
import { IncidentTypes } from "@/components/analytics/incident-types";
import { ResponseMetrics } from "@/components/analytics/response-metrics";
import { analyticsData } from "@/lib/data/analytics";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoadingCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analysis and trends of safety incidents.
        </p>
      </div>

      <Suspense fallback={<LoadingCard />}>
        <TrendsChart data={analyticsData.trends} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<LoadingCard />}>
          <IncidentTypes data={analyticsData.types} />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <ResponseMetrics data={analyticsData.responseMetrics} />
        </Suspense>
      </div>
    </div>
  );
}