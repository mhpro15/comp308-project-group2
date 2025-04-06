import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_PATIENTS,
  GET_PATIENT_SYMPTOM_RECORDS,
  UPDATE_AI_PREDICTION,
  PREDICT_FROM_SYMPTOMS,
} from "../api/api";
import { AlertTriangle, Activity, RefreshCw, AlertCircle } from "lucide-react";

const AnalyzePage = () => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedSymptomRecord, setSelectedSymptomRecord] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
  } = useQuery(GET_PATIENTS);

  const {
    data: symptomsData,
    loading: symptomsLoading,
    error: symptomsError,
    refetch: refetchSymptoms,
  } = useQuery(GET_PATIENT_SYMPTOM_RECORDS, {
    variables: { patientId: selectedPatient },
    skip: !selectedPatient,
  });

  const [getPrediction, { loading: predictionLoading }] = useLazyQuery(
    PREDICT_FROM_SYMPTOMS,
    { fetchPolicy: "no-cache" } // Don't cache prediction results
  );

  // Update AI prediction mutation
  const [updateAIPrediction] = useMutation(UPDATE_AI_PREDICTION);

  // Reset states when patient changes
  useEffect(() => {
    setSelectedSymptomRecord(null);
    setAnalysisResult(null);
    setUpdateSuccess(false);
    setAnalysisError(null);
  }, [selectedPatient]);

  // Reset success message after 3 seconds
  useEffect(() => {
    let timer;
    if (updateSuccess) {
      timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [updateSuccess]);

  // Helper function to map severity to risk level
  const mapSeverityToRiskLevel = (severity) => {
    switch (severity) {
      case "severe":
        return "high";
      case "moderate":
        return "medium";
      case "mild":
        return "low";
      case "none":
        return "low";
      default:
        return "unknown";
    }
  };

  // Check for authentication token
  const checkAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    try {
      // Basic check to see if token is valid JWT format
      // This doesn't validate the signature, just the format
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Token is not in valid JWT format");
        return false;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.error("Token is expired");
          return false;
        }
      } catch (e) {
        console.error("Could not parse token payload:", e);
      }

      return true;
    } catch (e) {
      console.error("Error checking token:", e);
      return false;
    }
  };

  // Function to analyze symptoms with AI
  const handleAnalyze = async () => {
    if (!selectedSymptomRecord) return;

    // Check token first
    if (!checkAuthToken()) {
      setAnalysisError(
        "Authentication error: You need to be logged in with a valid token to use the AI analysis feature"
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      console.log("Original symptoms:", selectedSymptomRecord.symptoms);

      // Ensure symptoms match exactly what the backend expects
      // Valid symptoms: fever, cough, shortness_of_breath, fatigue, sore_throat, body_aches, congestion, runny_nose
      const validSymptomMap = {
        fever: "fever",
        cough: "cough",
        "shortness of breath": "shortness_of_breath",
        fatigue: "fatigue",
        "sore throat": "sore_throat",
        "body aches": "body_aches",
        congestion: "congestion",
        "runny nose": "runny_nose",
      };

      const formattedSymptoms = selectedSymptomRecord.symptoms.map(
        (symptom) => {
          // Convert to lowercase and remove extra spaces
          const normalized = symptom.toLowerCase().trim();

          // Replace spaces with underscores if needed
          if (validSymptomMap[normalized]) {
            return validSymptomMap[normalized];
          }

          // If not in our map, use as is (after replacing spaces)
          return normalized.replace(/\s+/g, "_");
        }
      );

      console.log("Formatted symptoms for API:", formattedSymptoms);

      // Use the query to get prediction
      const { data, error } = await getPrediction({
        variables: {
          symptoms: formattedSymptoms,
        },
      });

      if (error) {
        throw error;
      }

      if (data && data.predictFromSymptoms) {
        // Check if there was an error in the response
        if (data.predictFromSymptoms.error) {
          setAnalysisError(data.predictFromSymptoms.error);
          return;
        }

        // Always calculate riskLevel from severity since it's not in the API response
        const severity = data.predictFromSymptoms.severity || "unknown";

        setAnalysisResult({
          condition: data.predictFromSymptoms.condition || "COVID-19",
          probability: data.predictFromSymptoms.probability || 0,
          severity: severity,
          riskLevel: mapSeverityToRiskLevel(severity),
        });
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);

      // Extract the most useful error message
      let errorMessage = "Error analyzing symptoms with AI service";

      if (error.networkError) {
        console.error("Network error details:", error.networkError);
        errorMessage = `Network error: ${
          error.networkError.statusCode || ""
        } - Unable to connect to AI service`;

        // Log response body if available
        if (error.networkError.result) {
          console.error("Error response:", error.networkError.result);
        }
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        console.error("GraphQL Errors:", error.graphQLErrors);
        errorMessage = `GraphQL error: ${error.graphQLErrors[0].message}`;

        // Log the path and locations if available
        const firstError = error.graphQLErrors[0];
        if (firstError.path) {
          console.error("Error path:", firstError.path);
        }
      }

      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to update the symptom record with AI prediction
  const handleUpdatePrediction = async () => {
    if (!selectedSymptomRecord || !analysisResult) return;

    setIsUpdating(true);

    try {
      console.log("Updating prediction:", analysisResult);
      await updateAIPrediction({
        variables: {
          symptoms: selectedSymptomRecord.symptoms,
          id: selectedSymptomRecord.id,
          condition: analysisResult.condition,
          probability: analysisResult.probability,
          severity: analysisResult.severity || "unknown",
          riskLevel: analysisResult.riskLevel || "unknown",
        },
      });

      setUpdateSuccess(true);
      refetchSymptoms(); // Refresh the symptom data
    } catch (error) {
      console.error("Error updating prediction:", error);
    } finally {
      setIsUpdating(false);
    }
  };

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        AI Symptom Analysis
      </h1>

      {/* Patient Selection */}
      <div className="mb-8">
        <label
          htmlFor="patientSelect"
          className="block font-bold text-gray-700 text-lg mb-2"
        >
          Select Patient
        </label>
        {patientsLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        ) : patientsError ? (
          <div className="text-red-500">Error loading patients</div>
        ) : (
          <select
            id="patientSelect"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a patient --</option>
            {patientsData?.getAllUsers
              .filter((user) => user.role === "patient")
              .map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Symptom Records */}
      {selectedPatient && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Symptom Records
          </h2>
          {symptomsLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : symptomsError ? (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">
                Error loading symptom records: {symptomsError.message}
              </p>
            </div>
          ) : !symptomsData?.getPatientSymptoms?.length ? (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-medium">
                No symptom records found for this patient.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {symptomsData.getPatientSymptoms.slice(0, 6).map((record) => (
                <div
                  key={record.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSymptomRecord?.id === record.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedSymptomRecord(record)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      {new Date(record.submissionDate).toLocaleDateString()}
                    </div>
                    {record.aiPrediction?.riskLevel && (
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
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {record.symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {symptom.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analysis Section */}
      {selectedSymptomRecord && (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            AI Analysis
          </h2>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Selected Symptoms:
            </h3>
            <div className="flex flex-wrap gap-1">
              {selectedSymptomRecord.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {symptom.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || predictionLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isAnalyzing || predictionLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </button>

            {analysisResult && (
              <button
                onClick={handleUpdatePrediction}
                disabled={isUpdating}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Record"
                )}
              </button>
            )}
          </div>

          {updateSuccess && (
            <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="font-medium">Prediction updated successfully!</p>
            </div>
          )}

          {analysisError && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{analysisError}</p>
            </div>
          )}

          {analysisResult ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Analysis Results:
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Condition:</span>{" "}
                  {analysisResult.condition}
                </div>
                <div>
                  <span className="font-semibold">Probability:</span>{" "}
                  {Math.round(analysisResult.probability * 100)}%
                </div>
                {analysisResult.severity && (
                  <div>
                    <span className="font-semibold">Severity:</span>{" "}
                    <span className="capitalize">
                      {analysisResult.severity}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Risk Level:</span>{" "}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(
                      analysisResult.riskLevel
                    )}`}
                  >
                    {analysisResult.riskLevel === "high" && (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {analysisResult.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ) : isAnalyzing || predictionLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
              <p className="text-gray-600">Analyzing symptoms with AI...</p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-center">
              <p>
                Click "Analyze with AI" to get an assessment of these symptoms.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
