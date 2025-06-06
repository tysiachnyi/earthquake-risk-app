import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const radius = parseFloat(searchParams.get("radius") || "100");
  const minMagnitude = parseFloat(searchParams.get("minMagnitude") || "2.5");
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  if (!lat || !lon || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required parameters: lat, lon, startDate, endDate" },
      { status: 400 }
    );
  }

  try {
    // Calculate radius in degrees (approximately)
    const radiusInDegrees = radius / 111; // Rough conversion: 1 degree ≈ 111 km

    // USGS Earthquake API
    const minLat = lat - radiusInDegrees;
    const maxLat = lat + radiusInDegrees;
    const minLon = lon - radiusInDegrees;
    const maxLon = lon + radiusInDegrees;

    const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minlatitude=${minLat}&maxlatitude=${maxLat}&minlongitude=${minLon}&maxlongitude=${maxLon}&minmagnitude=${minMagnitude}&limit=1000`;

    console.log("Fetching from USGS:", usgsUrl);

    const response = await fetch(usgsUrl);

    if (!response.ok) {
      throw new Error(
        `USGS API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Transform USGS data to our format
    const earthquakes =
      data.features?.map(
        (feature: {
          id: string;
          properties: {
            mag?: number;
            place?: string;
            time?: number;
            url?: string;
            sig?: number;
          };
          geometry: {
            coordinates: [number, number, number];
          };
        }) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;

          return {
            id: feature.id,
            magnitude: props.mag || 0,
            place: props.place || "Unknown location",
            time: new Date(props.time || 0).toISOString(),
            coordinates: {
              longitude: coords[0],
              latitude: coords[1],
              depth: coords[2] || 0,
            },
            url: props.url || "",
            significance: props.sig || 0,
          };
        }
      ) || [];

    // Filter by actual distance (more precise than bounding box)
    const filteredEarthquakes = earthquakes.filter(
      (eq: { coordinates: { latitude: number; longitude: number } }) => {
        const distance = calculateDistance(
          lat,
          lon,
          eq.coordinates.latitude,
          eq.coordinates.longitude
        );
        return distance <= radius;
      }
    );

    console.log(
      `Found ${filteredEarthquakes.length} earthquakes within ${radius}km`
    );

    return NextResponse.json({
      earthquakes: filteredEarthquakes,
      count: filteredEarthquakes.length,
      query: {
        lat,
        lon,
        radius,
        minMagnitude,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch earthquake data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
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
