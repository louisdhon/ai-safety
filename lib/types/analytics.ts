export interface IncidentTrend {
  month: string;
  incidents: number;
}

export interface IncidentType {
  type: string;
  percentage: number;
}

export interface ResponseMetric {
  label: string;
  value: string;
}

export interface AnalyticsData {
  trends: IncidentTrend[];
  types: IncidentType[];
  responseMetrics: ResponseMetric[];
}