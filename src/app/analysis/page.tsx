"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { format, subMonths, subYears } from "date-fns";
import { EarthquakeData, AnalysisResult } from "@/types/earthquake";
import LocationInput from "@/components/LocationInput/LocationInput";
import RiskAssessment from "@/components/RiskAssessment/RiskAssessment";
import DataSummary from "@/components/DataSummary/DataSummary";
import EarthquakeCharts from "@/components/EarthquakeCharts/EarthquakeCharts";
import Recommendations from "@/components/Recommendations/Recommendations";
import { Container } from "../components";

// Dynamic imports to avoid SSR issues
const MapComponent = dynamic(() => import("../components/RiskMap/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

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

  const handleLocationSubmit = async (
    e?: React.FormEvent,
    useGeolocation: boolean = false
  ) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let lat: number | undefined = undefined;
      let lon: number | undefined = undefined;
      let locString: string | undefined = undefined;

      if (useGeolocation) {
        // Get location from browser geolocation
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by this browser.");
          setIsLoading(false);
          return;
        }
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              lat = position.coords.latitude;
              lon = position.coords.longitude;
              locString = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
              setCoordinates([lat, lon]);
              setLocation(locString);
              resolve();
            },
            (error) => {
              setError(
                "Error getting your location. Please enter it manually."
              );
              setIsLoading(false);
              reject(error);
            }
          );
        });
      } else {
        // Manual location input
        if (!location.trim()) {
          setIsLoading(false);
          return;
        }
        // Geocode location
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        } else {
          setError("Location not found. Please try a different search term.");
          setIsLoading(false);
          return;
        }
      }

      if (typeof lat === "number" && typeof lon === "number") {
        await fetchEarthquakeData(lat, lon);
      } else {
        setError("Could not determine coordinates. Please try again.");
      }
    } catch (error) {
      setError("Error finding location. Please try again." + error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEarthquakeData = async (lat: number, lon: number) => {
    console.log("Fetching earthquake data for:", lat, lon);
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
      return;
    } catch (error) {
      console.error("Error analyzing earthquake data:", error);
      setError("Error analyzing earthquake data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <main className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <LocationInput
            onSubmit={handleLocationSubmit}
            isLoading={isLoading}
            error={error}
            filters={filters}
            setFilters={setFilters}
            location={location}
            setLocation={setLocation}
          />

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
              {analysis && <RiskAssessment analysis={analysis} />}
            </div>
          )}

          {/* Data Summary */}
          <DataSummary earthquakes={earthquakes} analysis={analysis} />

          {/* Charts Section */}
          {analysis && <EarthquakeCharts analysis={analysis} />}

          {/* Recommendations */}
          {analysis && <Recommendations analysis={analysis} />}
        </div>
      </main>
    </Container>
  );
}
