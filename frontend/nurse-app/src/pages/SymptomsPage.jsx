import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PATIENTS } from "../api/api";
import SymptomsHistory from "../components/SymptomsHistory";

const SymptomsPage = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [selectedPatient, setSelectedPatient] = useState("");
  const { data, loading, error } = useQuery(GET_PATIENTS);

  return (
    <div className="w-max-content mx-auto">
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === "history"
              ? "font-semibold border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Symptoms History
        </button>
      </div>

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
            Patient Symptoms History
          </h2>
          <p className="text-gray-600 mb-6">
            View the patient's recorded symptoms
          </p>
          <div className="symptoms-history">
            <SymptomsHistory patientId={selectedPatient} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsPage;
