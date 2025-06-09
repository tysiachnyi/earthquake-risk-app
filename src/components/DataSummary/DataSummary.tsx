import { AnalysisResult, EarthquakeData } from '@/types/earthquake';

interface DataSummaryProps {
  earthquakes: EarthquakeData[];
  analysis: AnalysisResult | null;
}

export default function DataSummary({ earthquakes, analysis }: DataSummaryProps) {
  if (earthquakes.length === 0) return null;

  return (
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
  );
} 