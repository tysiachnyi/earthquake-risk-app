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
import { AnalysisResult } from '@/types/earthquake';
import { formatMagnitudeData, formatTemporalData } from '@/utils/earthquakeAnalysis';

interface EarthquakeChartsProps {
  analysis: AnalysisResult;
}

export default function EarthquakeCharts({ analysis }: EarthquakeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Magnitude Distribution */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Magnitude Distribution
        </h3>
        {formatMagnitudeData(analysis).length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatMagnitudeData(analysis)}>
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
        {formatTemporalData(analysis).length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formatTemporalData(analysis)}>
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
  );
} 