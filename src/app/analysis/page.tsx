"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "../components";
import { format, subMonths, subYears } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Dynamic imports to avoid SSR issues
const MapComponent = dynamic(
  () => import("./components/EarthquakeMapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        Loading Map...
      </div>
    ),
  }
);

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

interface AnalysisResult {
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

export default function AnalysisPage() {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [earthquakes, setEarthquakes] = useState<EarthquakeData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    radius: 200,
    minMagnitude: 2.0,
    timeRange: "5years",
  });

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Geocode location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordinates([lat, lon]);
        await fetchEarthquakeData(lat, lon);
      } else {
        setError("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      setError("Error finding location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEarthquakeData = async (lat: number, lon: number) => {
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();

      switch (filters.timeRange) {
        case "1month":
          startDate = subMonths(endDate, 1);
          break;
        case "6months":
          startDate = subMonths(endDate, 6);
          break;
        case "1year":
          startDate = subYears(endDate, 1);
          break;
        case "5years":
          startDate = subYears(endDate, 5);
          break;
        case "10years":
          startDate = subYears(endDate, 10);
          break;
      }

      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        radius: filters.radius.toString(),
        minMagnitude: filters.minMagnitude.toString(),
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });

      const response = await fetch(`/api/earthquakes?${params}`);
      if (!response.ok) throw new Error("Failed to fetch earthquake data");

      const data = await response.json();
      setEarthquakes(data.earthquakes);

      // Analyze the data
      await analyzeData(data.earthquakes, { lat, lon });
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      setError("Error fetching earthquake data. Please try again.");
    }
  };

  const analyzeData = async (
    earthquakeData: EarthquakeData[],
    locationData: { lat: number; lon: number }
  ) => {
    try {
      const response = await fetch("/api/earthquakes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          earthquakes: earthquakeData,
          location: locationData,
          analysisType: "comprehensive",
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze earthquake data");

      const analysisResult = await response.json();
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error analyzing earthquake data:", error);
      setError("Error analyzing earthquake data.");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        fetchEarthquakeData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Error getting your location. Please enter it manually.");
        setIsLoading(false);
      }
    );
  };

  const getRiskColor = (level: string) => {
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

  const formatMagnitudeData = () => {
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

  const formatTemporalData = () => {
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

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Location Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Earthquake Risk Analysis
            </h2>
            <p className="text-gray-600">
              Enter a location to analyze historical earthquake data and assess
              seismic risk
            </p>
          </div>

          <form onSubmit={handleLocationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter City, Country or Coordinates
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Istanbul, Turkey or 41.0082,28.9784"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius
                  </label>
                  <select
                    value={filters.radius}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        radius: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                  >
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                    <option value={200}>200 km</option>
                    <option value={500}>500 km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Mag
                  </label>
                  <select
                    value={filters.minMagnitude}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minMagnitude: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                  >
                    <option value={2.0}>2.0+</option>
                    <option value={2.5}>2.5+</option>
                    <option value={3.0}>3.0+</option>
                    <option value={4.0}>4.0+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        timeRange: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                  >
                    <option value="1month">1 Month</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="5years">5 Years</option>
                    <option value="10years">10 Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Analyze Location
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use My Location
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {coordinates && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Earthquake Map
              </h3>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapComponent
                  coordinates={coordinates}
                  earthquakes={earthquakes}
                />
              </div>
            </div>

            {/* Risk Assessment */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Risk Assessment
                </h3>

                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${getRiskColor(
                      analysis.riskAssessment.riskLevel
                    )}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Risk Level: {analysis.riskAssessment.riskLevel}
                      </span>
                      <span className="text-2xl font-bold">
                        {analysis.riskAssessment.overallRiskScore}/100
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-current h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${analysis.riskAssessment.overallRiskScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      Confidence:{" "}
                      {(analysis.riskAssessment.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Risk Factors:
                    </h4>
                    <ul className="space-y-1">
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center text-gray-600"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysis.probabilityAnalysis && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700">
                        Probability Estimates:
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Next Year (M3+):</span>
                          <span>
                            {analysis.probabilityAnalysis.nextYear.low}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Year (M5+):</span>
                          <span>
                            {analysis.probabilityAnalysis.nextYear.moderate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next 5 Years (M5+):</span>
                          <span>
                            {analysis.probabilityAnalysis.next5Years.moderate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Summary */}
        {earthquakes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Data Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {earthquakes.length}
                </div>
                <div className="text-sm text-gray-600">Total Earthquakes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analysis?.magnitudeAnalysis?.average || "N/A"}
                </div>
                <div className="text-sm text-gray-600">Avg Magnitude</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analysis?.magnitudeAnalysis?.range?.[1] || "N/A"}
                </div>
                <div className="text-sm text-gray-600">Max Magnitude</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analysis?.spatialAnalysis?.averageDistance || "N/A"} km
                </div>
                <div className="text-sm text-gray-600">Avg Distance</div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Magnitude Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Magnitude Distribution
              </h3>
              {formatMagnitudeData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatMagnitudeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="magnitude" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No Earthquake Data</p>
                    <p className="text-sm">
                      Try expanding the search radius or time range
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Temporal Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Temporal Activity
              </h3>
              {formatTemporalData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatTemporalData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No Temporal Data</p>
                    <p className="text-sm">
                      Try expanding the search radius or time range
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis?.recommendations && analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
