"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "../components";

// Dynamically import the Map component to avoid SSR issues
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

export default function MapPage() {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    try {
      // Use Nominatim API for geocoding (free alternative to Google Maps)
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
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      alert("Error finding location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Error getting your location. Please enter it manually.");
        setIsLoading(false);
      }
    );
  };

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Header text="Earthquake Risk Map" />

        {/* Location Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Find Your Location</h2>

          <form onSubmit={handleLocationSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter City, Country or Address
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA or Tokyo, Japan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  list="location-suggestions"
                />
                <datalist id="location-suggestions">
                  <option value="San Francisco, CA, USA" />
                  <option value="Tokyo, Japan" />
                  <option value="Istanbul, Turkey" />
                  <option value="Los Angeles, CA, USA" />
                  <option value="Mexico City, Mexico" />
                  <option value="Naples, Italy" />
                  <option value="Athens, Greece" />
                  <option value="Lisbon, Portugal" />
                </datalist>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Searching..." : "Show on Map"}
                </button>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Use My Location
                </button>
              </div>
            </div>
          </form>

          {coordinates && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current Location:</strong> {location}
              </p>
              <p className="text-sm text-blue-600">
                Coordinates: {coordinates[0].toFixed(6)},{" "}
                {coordinates[1].toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Map View</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapComponent coordinates={coordinates} />
          </div>

          {!coordinates && (
            <div className="mt-4 text-center text-gray-500">
              <p>Enter a location above to see it on the map</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
