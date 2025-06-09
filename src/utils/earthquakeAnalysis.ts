import { AnalysisResult } from '@/types/earthquake';

export const getRiskColor = (level: string) => {
  switch (level) {
    case "High":
      return "text-red-600 bg-red-100";
    case "Moderate":
      return "text-orange-600 bg-orange-100";
    case "Low":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-green-600 bg-green-100";
  }
};

export const formatMagnitudeData = (analysis: AnalysisResult | null) => {
  if (!analysis?.magnitudeAnalysis?.distribution) {
    return [];
  }

  const data = Object.entries(analysis.magnitudeAnalysis.distribution)
    .map(([mag, count]) => ({
      magnitude: parseFloat(mag),
      count: count as number,
    }))
    .sort((a, b) => a.magnitude - b.magnitude);

  return data;
};

export const formatTemporalData = (analysis: AnalysisResult | null) => {
  if (!analysis?.temporalAnalysis?.monthlyActivity) {
    return [];
  }

  const data = Object.entries(analysis.temporalAnalysis.monthlyActivity)
    .map(([month, count]) => ({
      month,
      count: count as number,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return data;
}; 