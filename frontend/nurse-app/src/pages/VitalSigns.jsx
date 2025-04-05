import React from "react";
import VitalSignsForm from "../components/VitalSignsForm";
import VitalSignsHistory from "../components/VitalSignsHistory";

const VitalSigns = ({ currentUser }) => {
  const [activeTab, setActiveTab] = React.useState("enter");
  console.log("Current User in VitalSigns:", currentUser);
  return (
    <div className="w-max-content mx-auto">
      <div className="flex mb-4 border-b">
        <button
          className={` py-2 px-4 ${
            activeTab === "enter"
              ? "font-semibold border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("enter")}
        >
          Enter Vital Signs
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "history"
              ? "font-semibold border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Vital Signs History
        </button>
      </div>

      {activeTab === "enter" ? (
        <VitalSignsForm user={currentUser} />
      ) : (
        <div className="vital-signs-history">
          <h2 className="text-xl font-semibold">Vital Signs History</h2>
          <VitalSignsHistory user={currentUser} />
        </div>
      )}
    </div>
  );
};

export default VitalSigns;
