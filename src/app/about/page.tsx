import { Header, Paragraph } from "../components";

export default function AboutPage() {
  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Header text="About EQ Risk App" />

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <Paragraph text="The Earthquake Risk App is designed to help you understand and prepare for seismic activity in your area." />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Interactive map with location search</li>
              <li>Real-time geolocation support</li>
              <li>Historical earthquake data visualization</li>
              <li>Comprehensive risk assessment analysis</li>
              <li>Emergency preparedness recommendations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">How to Use</h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Navigate to the Analysis page</li>
              <li>Enter your location or use your current location</li>
              <li>
                Set your search parameters (radius, magnitude, time period)
              </li>
              <li>
                View comprehensive earthquake risk analysis and recommendations
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Technology</h2>
            <Paragraph text="Built with Next.js, TypeScript, TailwindCSS, Leaflet, and Recharts for an optimal user experience." />
          </div>
        </div>
      </div>
    </main>
  );
}
