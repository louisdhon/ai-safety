"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IncidentType } from "@/lib/types/analytics";
import { motion } from "framer-motion";

interface IncidentTypesProps {
  data: IncidentType[];
}

export function IncidentTypes({ data }: IncidentTypesProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Incident Types</h2>
      <div className="space-y-6">
        {data.map((item, index) => (
          <motion.div
            key={item.type}
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.type}</span>
              <span className="font-medium">{item.percentage}%</span>
            </div>
            <Progress 
              value={item.percentage} 
              className="h-2"
              aria-label={`${item.type} incidents: ${item.percentage}%`}
            />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}