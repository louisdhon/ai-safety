import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all safety incidents and their current status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-700 dark:text-red-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold">1</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
        <p className="text-muted-foreground text-center py-8">
          No incidents reported in the last 24 hours.
        </p>
      </Card>
    </div>
  );
}