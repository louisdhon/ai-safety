import { AnalyticsData } from '@/lib/types/analytics';

export const analyticsData: AnalyticsData = {
  trends: [
    { month: "Jan", incidents: 4 },
    { month: "Feb", incidents: 3 },
    { month: "Mar", incidents: 2 },
    { month: "Apr", incidents: 6 },
    { month: "May", incidents: 4 },
    { month: "Jun", incidents: 3 },
  ],
  types: [
    { type: "Near Miss", percentage: 42 },
    { type: "Injury", percentage: 28 },
    { type: "Property Damage", percentage: 18 },
    { type: "Environmental", percentage: 12 },
  ],
  responseMetrics: [
    { label: "Average Response Time", value: "2.4 hours" },
    { label: "Critical Incidents", value: "45 minutes" },
    { label: "Resolution Time", value: "3.2 days" },
  ],
};