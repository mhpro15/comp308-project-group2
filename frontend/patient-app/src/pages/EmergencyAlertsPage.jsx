// EmergencyAlertsPage.jsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Bell } from "lucide-react";

// Define the GraphQL mutation for sending a help alert.
// Make sure the mutation name and parameters match your GraphQL schema.
const SEND_HELP_ALERT = gql`
  mutation SendHelpAlert($patientId: ID!, $message: String) {
    sendHelpAlert(patientId: $patientId, message: $message) {
      id
      patientId
      message
      createdAt
      viewed
    }
  }
`;

const EmergencyAlertsPage = ({ currentUser }) => {
  const [message, setMessage] = useState("");
  const [sendHelpAlert, { loading, error, data }] = useMutation(SEND_HELP_ALERT);

  // Ensure that only a patient can access this page.
  if (!currentUser || currentUser.role !== "patient") {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              This page is only accessible to patient users.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handles the form submission for creating an alert.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a message for your help request.");
      return;
    }

    try {
      await sendHelpAlert({
        variables: {
          patientId: currentUser.id,
          message,
        },
      });
      alert("Help request submitted successfully!");
      setMessage("");
    } catch (err) {
      console.error("Error submitting help request:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">
          Emergency Help Request
        </h1>
        <p className="text-gray-600 mt-2">
          Send an emergency request to notify a nurse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <label htmlFor="helpMessage" className="block text-lg font-medium text-gray-700">
            Your Message
          </label>
          <textarea
            id="helpMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            rows="4"
            placeholder="Describe your emergency or what you need help with..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {loading ? "Submitting..." : "Submit Help Request"}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            Error submitting your request: {error.message}
          </div>
        )}
        {data && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Your help request has been sent. A nurse will respond shortly.
          </div>
        )}
      </form>
    </div>
  );
};

export default EmergencyAlertsPage;
