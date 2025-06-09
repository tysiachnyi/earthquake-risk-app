import { AnalysisResult } from '@/types/earthquake';
import { getRiskColor } from '@/utils/earthquakeAnalysis';

interface RiskAssessmentProps {
  analysis: AnalysisResult;
}

export default function RiskAssessment({ analysis }: RiskAssessmentProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Risk Assessment
      </h3>

      <div className="space-y-4">
        <div
          className={`p-4 rounded-lg ${getRiskColor(
            analysis.riskAssessment.riskLevel
          )}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              Risk Level: {analysis.riskAssessment.riskLevel}
            </span>
            <span className="text-2xl font-bold">
              {analysis.riskAssessment.overallRiskScore}/100
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-current h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${analysis.riskAssessment.overallRiskScore}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-sm mt-2">
            Confidence:{" "}
            {(analysis.riskAssessment.confidence * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-gray-700">
            Risk Factors:
          </h4>
          <ul className="space-y-1">
            {analysis.riskAssessment.factors.map((factor, index) => (
              <li
                key={index}
                className="text-sm flex items-center text-gray-600"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {analysis.probabilityAnalysis && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">
              Probability Estimates:
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Next Year (M3+):</span>
                <span>
                  {analysis.probabilityAnalysis.nextYear.low}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next Year (M5+):</span>
                <span>
                  {analysis.probabilityAnalysis.nextYear.moderate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next 5 Years (M5+):</span>
                <span>
                  {analysis.probabilityAnalysis.next5Years.moderate}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 