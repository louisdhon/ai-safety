"use client";

import { useState } from 'react';
import { analyzeIncidentAction } from '@/app/actions';

interface IncidentAnalysis {
  type: string;
  severity: string;
  riskFactors: string[];
  recommendations: string[];
}

export function useIncidentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeIncident = async (description: string): Promise<IncidentAnalysis | null> => {
    setIsAnalyzing(true);
    try {
      return await analyzeIncidentAction(description);
    } catch (error) {
      console.error('Error analyzing incident:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeIncident, isAnalyzing };
}