import { useEffect, useState } from "react";
import { Thermometer, Heart, Droplet, Activity, Weight } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PATIENTS, RECORD_VITAL_SIGNS } from "../api/api";

const VitalSignsForm = (user) => {
  const [bodyTemperature, setBodyTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const { data, loading, error } = useQuery(GET_PATIENTS);
  const [recordVitalSigns] = useMutation(RECORD_VITAL_SIGNS);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const input = {
        PatientID: selectedPatient,
        NurseID: user.id || "",
        Temperature: parseFloat(bodyTemperature) || 0,
        BPsystolic: parseInt(bloodPressureSystolic) || 0,
        BPdiastolic: parseInt(bloodPressureDiastolic) || 0,
        RespiratoryRate: parseInt(respiratoryRate) || 0,
        heartRate: parseInt(heartRate) || 0,
        weight: parseFloat(weight) || 0,
        notes: notes || "",
      };

      console.log("Submitting vital signs:", input);
      const result = await recordVitalSigns({ variables: { input: input } });
      console.log("Result:", result);
      if (result.data) {
        alert("New Vital Sign Record was saved succesfully for patient");
      }
      setBodyTemperature("");
      setHeartRate("");
      setBloodPressureSystolic("");
      setBloodPressureDiastolic("");
      setRespiratoryRate("");
      setWeight("");
      setNotes("");
    } catch (error) {
      console.error("Error recording vital signs:", error);
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors);
      }
      if (error.networkError) {
        console.error("Network Error:", error.networkError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Vital Signs Recording
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error loading patients: {error.message}</p>
        </div>
      ) : (
        <div className="mb-8">
          <label
            htmlFor="patientSelect"
            className="block font-bold text-gray-700 text-lg mb-2"
          >
            Select Patient
          </label>
          <select
            id="patientSelect"
            value={selectedPatient}
            onChange={(e) => {
              setSelectedPatient(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">-- Select a patient --</option>
            {data.getAllUsers
              .filter((user) => user.role === "patient")
              .map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedPatient && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="font-bold text-2xl text-gray-800 mb-2">
            Record Vital Signs
          </h2>
          <p className="text-gray-600 mb-6">
            Enter the patient's vital signs information below
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="bodyTemperature"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                    Body Temperature (°C)
                  </label>
                  <input
                    id="bodyTemperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={bodyTemperature}
                    onChange={(e) => setBodyTemperature(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="heartRate"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Heart Rate (bpm)
                  </label>
                  <input
                    id="heartRate"
                    type="number"
                    placeholder="75"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bloodPressure"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                    Blood Pressure (mmHg)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="bloodPressureSystolic"
                      type="number"
                      placeholder="120"
                      value={bloodPressureSystolic}
                      onChange={(e) => setBloodPressureSystolic(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500 text-xl font-medium">/</span>
                    <input
                      id="bloodPressureDiastolic"
                      type="number"
                      placeholder="80"
                      value={bloodPressureDiastolic}
                      onChange={(e) =>
                        setBloodPressureDiastolic(e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="respiratoryRate"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Respiratory Rate (/min)
                  </label>
                  <input
                    id="respiratoryRate"
                    type="number"
                    placeholder="16"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="weight"
                    className="flex items-center font-medium text-gray-700"
                  >
                    <Weight className="h-5 w-5 mr-2 text-yellow-600" />
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="block font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Add any additional notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Vital Signs"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VitalSignsForm;
