export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  coordinates: {
    longitude: number;
    latitude: number;
    depth: number;
  };
  url: string;
  significance: number;
}

export interface AnalysisResult {
  riskAssessment: {
    overallRiskScore: number;
    riskLevel: string;
    confidence: number;
    factors: string[];
  };
  temporalAnalysis: {
    monthlyActivity: Record<string, number>;
    trends: { averagePerMonth: number; totalPeriod: number };
  };
  magnitudeAnalysis: {
    average: number;
    distribution: Record<string, number>;
    range: [number, number];
  };
  spatialAnalysis: {
    averageDistance: number;
    closestDistance: number;
  };
  depthAnalysis: {
    averageDepth: number;
    distribution: Record<string, number>;
  };
  probabilityAnalysis: {
    nextYear: { low: number; moderate: number; high: number };
    next5Years: { low: number; moderate: number; high: number };
  };
  recommendations: string[];
} 