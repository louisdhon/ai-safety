"use client";

import { IncidentReportForm } from "@/components/incident-report-form";
import { Card } from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Report an Incident</h1>
        <p className="text-muted-foreground">
          Fill out the form below to report a safety incident. All reports can be submitted
          anonymously if preferred.
        </p>
      </div>
      <Card className="p-6">
        <IncidentReportForm />
      </Card>
    </div>
  );
}