import Link from "next/link";
import { Header, Paragraph } from "../components";

export default function AboutPage() {
  return (
    <main className="min-h-screen py-8 ">
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

          <div className="pt-4 flex items-center space-x-2">
            <Link
              href="https://github.com/tysiachnyi/earthquake-risk-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-700 hover:text-black transition"
            >
              {/* GitHub SVG icon */}
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View on GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
