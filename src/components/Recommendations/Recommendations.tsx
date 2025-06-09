import { AnalysisResult } from '@/types/earthquake';

interface RecommendationsProps {
  analysis: AnalysisResult;
}

export default function Recommendations({ analysis }: RecommendationsProps) {
  if (!analysis?.recommendations || analysis.recommendations.length === 0) {
    return null;
  }

  return (
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
  );
} 