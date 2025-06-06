import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

interface MapComponentProps {
  coordinates: [number, number] | null;
}

// Component to handle map view updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

export default function MapComponent({ coordinates }: MapComponentProps) {
  // Default coordinates (center of Europe) if no location is provided
  const defaultCenter: [number, number] = [50.1109, 8.6821]; // Frankfurt, Germany
  const center = coordinates || defaultCenter;
  const zoom = coordinates ? 13 : 4;

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
          <ChangeView center={coordinates} />
          <Marker position={coordinates}>
            <Popup>
              <div className="text-center">
                <strong>Your Selected Location</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
                </span>
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
