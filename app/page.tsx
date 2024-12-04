import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, BarChart3, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Safety Incident Reporting
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Report and manage safety incidents efficiently with our intelligent
          system. Get real-time insights and automated prioritization.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/report">Report Incident</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 py-8">
        <Card className="p-6 space-y-2">
          <AlertTriangle className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">Quick Reporting</h3>
          <p className="text-muted-foreground">
            Report incidents in under 2 minutes with text or voice input
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <FileText className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">AI Processing</h3>
          <p className="text-muted-foreground">
            Automatic categorization and prioritization of incidents
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <BarChart3 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold">Real-time Analytics</h3>
          <p className="text-muted-foreground">
            Visual insights and trends for better decision making
          </p>
        </Card>
      </section>

      <section className="border-t pt-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Why Choose SafetyFirst?</h2>
          <p className="text-muted-foreground">
            Our AI-powered system helps organizations reduce incident response time
            by 50% and increase reporting volume by 2x within 6 months. Join the
            future of safety management.
          </p>
        </div>
      </section>
    </div>
  );
}