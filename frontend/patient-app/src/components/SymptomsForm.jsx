// SymptomsForm.jsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { SUBMIT_SYMPTOMS } from "../api/api";
  

const SymptomsForm = ({ patientID }) => {

  // Map symptom values with friendly display labels.
  const symptomOptions = [
    { value: "fever", label: "I have a high temperature or fever" },
    { value: "cough", label: "I am experiencing a persistent cough" },
    { value: "shortness_of_breath", label: "I have difficulty breathing" },
    { value: "fatigue", label: "I feel unusually tired" },
    { value: "sore_throat", label: "My throat is sore or irritated" },
    { value: "body_aches", label: "I have muscle pain or body aches" },
    { value: "congestion", label: "I feel congested or stuffed up" },
    { value: "runny_nose", label: "My nose is running" },
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitSymptoms, { loading, error, data }] = useMutation(SUBMIT_SYMPTOMS);

  // Toggle a symptom value in the selectedSymptoms array.
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSymptoms((prev) =>
      checked ? [...prev, value] : prev.filter((symptom) => symptom !== value)
    );
  };

  // Handle form submission by calling the submitSymptoms mutation.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    try {
      const input = {
        PatientID: patientID,
        symptoms: selectedSymptoms,
      };

      console.log(input);

      await submitSymptoms({ variables: { input: input } });
      alert("Symptoms submitted successfully!");
      // Optionally, clear the selection after success.
      setSelectedSymptoms([]);
    } catch (err) {
      console.error(err);
      alert("There was an error submitting your symptoms.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Select Your Symptoms</h2>
      <div className="flex flex-col space-y-2">
        {symptomOptions.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={option.value}
              checked={selectedSymptoms.includes(option.value)}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Submitting..." : "Submit Symptoms"}
      </button>
      {error && <p className="mt-2 text-red-500">Error: {error.message}</p>}
      {data && (
        <div className="mt-4 p-2 border rounded bg-green-50">
          <p>
            Submission Date:{" "}
            {new Date(data.submitSymptoms.submissionDate).toLocaleString()}
          </p>
          <p>Recorded Symptoms: {data.submitSymptoms.symptoms.join(", ")}</p>
        </div>
      )}
    </form>
  );
};

export default SymptomsForm;
