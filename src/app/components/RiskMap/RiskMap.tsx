import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  significance: number;
}

interface EarthquakeMapComponentProps {
  coordinates: [number, number] | null;
  earthquakes?: EarthquakeData[];
}

// Component to handle map view updates
function ChangeView({
  center,
  earthquakes,
}: {
  center: [number, number];
  earthquakes?: EarthquakeData[];
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      // If we have earthquakes, fit bounds to include all earthquakes
      if (earthquakes && earthquakes.length > 0) {
        const bounds = L.latLngBounds([center]);
        earthquakes.forEach((eq) => {
          bounds.extend([eq.coordinates.latitude, eq.coordinates.longitude]);
        });
        map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        map.setView(center, 10);
      }
    }
  }, [center, earthquakes, map]);

  return null;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return "#8B0000"; // Dark red for major earthquakes
  if (magnitude >= 6) return "#FF0000"; // Red for strong earthquakes
  if (magnitude >= 5) return "#FF6600"; // Orange for moderate earthquakes
  if (magnitude >= 4) return "#FFAA00"; // Yellow-orange for light earthquakes
  if (magnitude >= 3) return "#FFFF00"; // Yellow for minor earthquakes
  return "#00FF00"; // Green for micro earthquakes
}

function getMagnitudeRadius(magnitude: number): number {
  // Scale radius based on magnitude (logarithmic scale)
  return Math.max(3, Math.min(25, magnitude * 4));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDepthDescription(depth: number): string {
  if (depth < 70) return "Shallow";
  if (depth < 300) return "Intermediate";
  return "Deep";
}

function getSignificanceDescription(significance: number): string {
  if (significance >= 600) return "Very High";
  if (significance >= 300) return "High";
  if (significance >= 100) return "Moderate";
  return "Low";
}

export default function RiskMap({
  coordinates,
  earthquakes = [],
}: EarthquakeMapComponentProps) {
  // Default coordinates (center of Europe) if no location is provided
  const defaultCenter: [number, number] = [50.1109, 8.6821]; // Frankfurt, Germany
  const center = coordinates || defaultCenter;
  const zoom = coordinates ? 8 : 4;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {coordinates && (
        <>
          <ChangeView center={coordinates} earthquakes={earthquakes} />

          {/* Main location marker */}
          <Marker position={coordinates}>
            <Popup>
              <div className="text-center">
                <strong>Selected Location</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Earthquake markers */}
          {earthquakes.map((earthquake) => (
            <CircleMarker
              key={earthquake.id}
              center={[
                earthquake.coordinates.latitude,
                earthquake.coordinates.longitude,
              ]}
              radius={getMagnitudeRadius(earthquake.magnitude)}
              fillColor={getMagnitudeColor(earthquake.magnitude)}
              color="#000"
              weight={1}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup maxWidth={300}>
                <div className="earthquake-popup">
                  <div className="font-bold text-lg mb-2">
                    Magnitude {earthquake.magnitude.toFixed(1)}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Location:</strong> {earthquake.place}
                    </div>
                    <div>
                      <strong>Time:</strong> {formatDate(earthquake.time)}
                    </div>
                    <div>
                      <strong>Depth:</strong>{" "}
                      {earthquake.coordinates.depth.toFixed(1)} km
                      <span className="ml-1 text-gray-600">
                        ({getDepthDescription(earthquake.coordinates.depth)})
                      </span>
                    </div>
                    <div>
                      <strong>Coordinates:</strong>
                      {earthquake.coordinates.latitude.toFixed(3)},{" "}
                      {earthquake.coordinates.longitude.toFixed(3)}
                    </div>
                    <div>
                      <strong>Significance:</strong> {earthquake.significance}
                      <span className="ml-1 text-gray-600">
                        ({getSignificanceDescription(earthquake.significance)})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Earthquake ID: {earthquake.id}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </>
      )}

      {/* Legend for earthquake magnitudes */}
      {earthquakes.length > 0 && (
        <div className="leaflet-bottom leaflet-right">
          <div
            className="leaflet-control leaflet-bar"
            style={{ background: "white", padding: "10px", margin: "10px" }}
          >
            <div className="text-xs font-bold mb-2">Earthquake Magnitude</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#8B0000" }}
                ></div>
                <span>7.0+ Major</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#FF0000" }}
                ></div>
                <span>6.0-6.9 Strong</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#FF6600" }}
                ></div>
                <span>5.0-5.9 Moderate</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#FFAA00" }}
                ></div>
                <span>4.0-4.9 Light</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#FFFF00" }}
                ></div>
                <span>3.0-3.9 Minor</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#00FF00" }}
                ></div>
                <span>&lt;3.0 Micro</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MapContainer>
  );
}
