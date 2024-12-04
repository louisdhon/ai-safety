"use client";

import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ResponseMetric } from "@/lib/types/analytics";
import { motion } from "framer-motion";

interface ResponseMetricsProps {
  data: ResponseMetric[];
}

export function ResponseMetrics({ data }: ResponseMetricsProps) {
  const getIcon = (label: string) => {
    switch (label) {
      case "Average Response Time":
        return <Clock className="h-4 w-4" />;
      case "Critical Incidents":
        return <AlertTriangle className="h-4 w-4" />;
      case "Resolution Time":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Response Time</h2>
      <div className="space-y-4">
        {data.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-primary">
                {getIcon(metric.label)}
              </span>
              <span className="text-sm text-muted-foreground">{metric.label}</span>
            </div>
            <span className="font-medium">{metric.value}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}