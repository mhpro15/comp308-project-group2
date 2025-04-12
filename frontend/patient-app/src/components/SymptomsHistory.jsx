import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PATIENT_SYMPTOM_RECORDS } from "../api/api";
import { Calendar, AlertTriangle } from "lucide-react";

const SymptomsHistory = ({ patientId }) => {
  const { data, loading, error } = useQuery(GET_PATIENT_SYMPTOM_RECORDS, {
    variables: { patientId },
    skip: !patientId,
  });
  console.log(data);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p className="font-medium">
          Error loading symptom history: {error.message}
        </p>
      </div>
    );
  }

  if (
    !data ||
    !data.getPatientSymptoms ||
    data.getPatientSymptoms.length === 0
  ) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-medium">
          No symptom records found for this patient.
        </p>
      </div>
    );
  }

  // Function to get background color based on risk level
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symptoms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              AI Assessment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Level
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.getPatientSymptoms.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-900">
                    {new Date(record.submissionDate).toLocaleDateString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {record.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {symptom.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.aiPrediction ? (
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Condition:</span>{" "}
                      {record.aiPrediction?.riskLevel == "low"
                        ? "Normal"
                        : record.aiPrediction?.condition}
                    </p>
                    {record.aiPrediction.probability && (
                      <p>
                        <span className="font-medium">Confidence:</span>{" "}
                        {Math.round(record.aiPrediction.probability * 100)}%
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Not available</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.aiPrediction?.riskLevel ? (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(
                      record.aiPrediction.riskLevel
                    )}`}
                  >
                    {record.aiPrediction.riskLevel === "high" && (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {record.aiPrediction.riskLevel.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Unknown</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SymptomsHistory;
