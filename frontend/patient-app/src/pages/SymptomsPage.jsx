// SymptomsPage.jsx
import React, { useState } from "react";
import SymptomsHistory from "../components/SymptomsHistory";
import SymptomsForm from "../components/SymptomsForm";

const SymptomsPage = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("history");
  console.log("Current User in SymptomsPage:", currentUser);

  return (
    <>
      {currentUser?.id && (
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
            <button
              className={`py-2 px-4 ${
                activeTab === "record"
                  ? "font-semibold border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("record")}
            >
              Record Symptoms
            </button>
          </div>

          {activeTab === "record" ? (
            // Pass the currently logged in patient ID to the form.
            <SymptomsForm patientID={currentUser.id} />
          ) : (
            <SymptomsHistory patientId={currentUser.id} />
          )}
        </div>
      )}
    </>
  );
};

export default SymptomsPage;
