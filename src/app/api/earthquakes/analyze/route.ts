import { NextRequest, NextResponse } from "next/server";

interface EarthquakeData {
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

interface AnalysisRequest {
  earthquakes: EarthquakeData[];
  location: { lat: number; lon: number };
  analysisType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { earthquakes, location } = body;

    if (!earthquakes || !location) {
      return NextResponse.json(
        { error: "Missing required parameters: earthquakes, location" },
        { status: 400 }
      );
    }

    // Perform comprehensive analysis
    const analysis = performComprehensiveAnalysis(earthquakes, location);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing earthquake data:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze earthquake data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function performComprehensiveAnalysis(
  earthquakes: EarthquakeData[],
  location: { lat: number; lon: number }
) {
  // Magnitude Analysis
  const magnitudes = earthquakes.map((eq) => eq.magnitude);
  const magnitudeDistribution: { [key: string]: number } = {};

  magnitudes.forEach((mag) => {
    const rounded = Math.floor(mag * 2) / 2; // Round to nearest 0.5
    magnitudeDistribution[rounded.toString()] =
      (magnitudeDistribution[rounded.toString()] || 0) + 1;
  });

  const magnitudeAnalysis = {
    average:
      magnitudes.length > 0
        ? (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1)
        : 0,
    range:
      magnitudes.length > 0
        ? [Math.min(...magnitudes), Math.max(...magnitudes)]
        : [0, 0],
    distribution: magnitudeDistribution,
    total: magnitudes.length,
  };

  // Temporal Analysis
  const monthlyActivity: { [key: string]: number } = {};
  earthquakes.forEach((eq) => {
    const month = new Date(eq.time).toISOString().substring(0, 7); // YYYY-MM format
    monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
  });

  const temporalAnalysis = {
    monthlyActivity,
    totalPeriod: Object.keys(monthlyActivity).length,
    averagePerMonth:
      earthquakes.length / Math.max(Object.keys(monthlyActivity).length, 1),
  };

  // Spatial Analysis
  const distances = earthquakes.map((eq) =>
    calculateDistance(
      location.lat,
      location.lon,
      eq.coordinates.latitude,
      eq.coordinates.longitude
    )
  );

  const spatialAnalysis = {
    averageDistance:
      distances.length > 0
        ? (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(1)
        : 0,
    closestDistance:
      distances.length > 0 ? Math.min(...distances).toFixed(1) : 0,
    farthestDistance:
      distances.length > 0 ? Math.max(...distances).toFixed(1) : 0,
  };

  // Depth Analysis
  const depths = earthquakes.map((eq) => eq.coordinates.depth);
  const depthAnalysis = {
    average:
      depths.length > 0
        ? (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1)
        : 0,
    shallow: depths.filter((d) => d < 70).length,
    intermediate: depths.filter((d) => d >= 70 && d < 300).length,
    deep: depths.filter((d) => d >= 300).length,
  };

  // Risk Assessment
  const riskScore = calculateRiskScore(
    earthquakes,
    magnitudeAnalysis,
    spatialAnalysis
  );
  const riskLevel = getRiskLevel(riskScore);
  const confidence = calculateConfidence(
    earthquakes.length,
    temporalAnalysis.totalPeriod
  );

  const riskFactors = [];
  if (earthquakes.length > 50)
    riskFactors.push("High historical seismic activity");
  if (parseFloat(magnitudeAnalysis.average.toString()) > 4.0)
    riskFactors.push("Significant average magnitude");
  if (parseFloat(spatialAnalysis.closestDistance.toString()) < 20)
    riskFactors.push("Close proximity to seismic activity");
  if (magnitudeAnalysis.range[1] > 6.0)
    riskFactors.push("History of strong earthquakes");
  if (riskFactors.length === 0)
    riskFactors.push("Low historical seismic activity");

  // Probability Analysis
  const probabilityAnalysis = {
    nextYear: {
      low: Math.min(
        95,
        (earthquakes.filter((eq) => eq.magnitude >= 3).length /
          temporalAnalysis.totalPeriod) *
          12
      ).toFixed(0),
      moderate: Math.min(
        75,
        (earthquakes.filter((eq) => eq.magnitude >= 5).length /
          temporalAnalysis.totalPeriod) *
          12
      ).toFixed(0),
      high: Math.min(
        25,
        (earthquakes.filter((eq) => eq.magnitude >= 7).length /
          temporalAnalysis.totalPeriod) *
          12
      ).toFixed(0),
    },
    next5Years: {
      moderate: Math.min(
        90,
        (earthquakes.filter((eq) => eq.magnitude >= 5).length /
          temporalAnalysis.totalPeriod) *
          60
      ).toFixed(0),
      high: Math.min(
        50,
        (earthquakes.filter((eq) => eq.magnitude >= 7).length /
          temporalAnalysis.totalPeriod) *
          60
      ).toFixed(0),
    },
  };

  // Recommendations
  const recommendations = generateRecommendations(
    riskLevel,
    riskScore,
    earthquakes
  );

  return {
    riskAssessment: {
      overallRiskScore: riskScore,
      riskLevel,
      confidence,
      factors: riskFactors,
    },
    temporalAnalysis,
    magnitudeAnalysis,
    spatialAnalysis,
    depthAnalysis,
    probabilityAnalysis,
    recommendations,
  };
}

function calculateRiskScore(
  earthquakes: EarthquakeData[],
  magnitudeAnalysis: { average: string | number; range: number[] },
  spatialAnalysis: {
    closestDistance: string | number;
    averageDistance: string | number;
  }
): number {
  let score = 0;

  // Factor 1: Number of earthquakes (0-30 points)
  score += Math.min(30, earthquakes.length / 2);

  // Factor 2: Average magnitude (0-25 points)
  score += Math.min(25, parseFloat(magnitudeAnalysis.average.toString()) * 5);

  // Factor 3: Maximum magnitude (0-25 points)
  score += Math.min(25, magnitudeAnalysis.range[1] * 3);

  // Factor 4: Proximity (0-20 points, closer = higher risk)
  const avgDistance = parseFloat(spatialAnalysis.averageDistance.toString());
  score += Math.max(0, 20 - avgDistance / 10);

  return Math.min(100, Math.round(score));
}

function getRiskLevel(score: number): string {
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  if (score >= 30) return "Low";
  return "Very Low";
}

function calculateConfidence(
  earthquakeCount: number,
  monthsOfData: number
): number {
  // Higher confidence with more data points and longer time period
  const dataScore = Math.min(0.5, earthquakeCount / 100);
  const timeScore = Math.min(0.5, monthsOfData / 120); // 10 years = max time score
  return Math.min(1, dataScore + timeScore);
}

function generateRecommendations(
  riskLevel: string,
  riskScore: number,
  earthquakes: EarthquakeData[]
): string[] {
  const recommendations = [];

  if (riskLevel === "High") {
    recommendations.push("Consider earthquake insurance for your property");
    recommendations.push(
      "Prepare an emergency kit with supplies for at least 72 hours"
    );
    recommendations.push("Secure heavy furniture and appliances to walls");
    recommendations.push(
      "Identify safe spots in each room (under sturdy tables, away from windows)"
    );
    recommendations.push("Practice earthquake drills with your family");
  } else if (riskLevel === "Moderate") {
    recommendations.push("Prepare a basic emergency kit");
    recommendations.push("Secure tall furniture and heavy objects");
    recommendations.push("Learn earthquake safety procedures");
    recommendations.push("Consider earthquake insurance");
  } else {
    recommendations.push("Stay informed about earthquake preparedness");
    recommendations.push("Keep a small emergency kit at home");
    recommendations.push("Know how to turn off utilities in case of emergency");
  }

  if (earthquakes.some((eq) => eq.coordinates.depth < 50)) {
    recommendations.push(
      "Be aware that shallow earthquakes can cause more surface damage"
    );
  }

  if (earthquakes.some((eq) => eq.magnitude > 5)) {
    recommendations.push(
      "Review building codes and structural safety in your area"
    );
  }

  return recommendations;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
