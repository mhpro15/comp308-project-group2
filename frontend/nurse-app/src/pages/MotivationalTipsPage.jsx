import { useState } from "react";
import {
  MessageCircleHeart,
  User as UserIcon,
  CheckCheck,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { GET_PATIENTS, CREATE_MOTIVATIONAL_TIP } from "../api/api";
import { useQuery, useMutation } from "@apollo/client";

const MotivationalTipsPage = ({ currentUser }) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [tipContent, setTipContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTips, setSentTips] = useState([]);
  const [activeTab, setActiveTab] = useState("send");
  const { data: patients } = useQuery(GET_PATIENTS);
  const [createMotivation] = useMutation(CREATE_MOTIVATIONAL_TIP);

  const handleSubmit = async () => {
    if (!tipContent.trim()) {
      alert("Error: Please enter a motivational tip.");
      return;
    }

    if (!selectedPatient) {
      alert("Error: Please select a patient.");
      return;
    }

    setSubmitting(true);

    try {
      if (currentUser) {
        const input = {
          PatientID: selectedPatient,
          NurseID: currentUser.id,
          content: tipContent,
          title: "Motivational Tip",
          timeStamp: new Date().toISOString(),
        };

        console.log("Submitting motivational tip:", input);

        const response = await createMotivation({
          variables: { input: input },
        });
        console.log(response);

        const newTip = {
          id: response.data.createMotivation.id,
          patientId: selectedPatient,
          content: tipContent,
          timestamp: new Date().toISOString(),
          read: false,
        };

        setSentTips((prev) => [newTip, ...prev]);

        setTipContent("");
        setSelectedPatient("");

        alert("Success: Motivational tip sent successfully.");
      }
    } catch (error) {
      alert("Error: Failed to send motivational tip.");
      console.error("Error sending motivational tip:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientNameById = (patientId) => {
    if (!patients || !patients.getAllUsers) return "Unknown Patient";
    const patient = patients.getAllUsers.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  if (!currentUser || currentUser.role !== "nurse") {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              This page is only accessible to nurse users.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-700">
          Motivational Tips
        </h1>
        <p className="text-gray-600 mt-2">
          Send encouraging messages to your patients to support their health
          journey
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "send"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("send")}
          >
            Send Tip
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Tip History
          </button>
        </div>

        {activeTab === "send" && (
          <div className="p-6">
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5">
                <h3 className="flex items-center text-lg font-bold text-blue-800">
                  <MessageCircleHeart className="h-6 w-6 mr-2 text-blue-600" />
                  New Motivational Tip
                </h3>
                <p className="text-gray-600 mt-1">
                  Share encouragement, health tips, or reminders with your
                  patients
                </p>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="patient"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Patient
                  </label>
                  <select
                    id="patient"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a patient</option>
                    {patients?.getAllUsers
                      .filter((user) => user.role === "patient")
                      .map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="tipContent"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Motivational Message
                  </label>
                  <textarea
                    id="tipContent"
                    placeholder="Write your motivational tip here..."
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-sm text-gray-500 italic">
                    Keep messages positive, concise, and actionable.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-5 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting || !tipContent.trim() || !selectedPatient
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Tip"}
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm mt-8 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
                <h3 className="text-lg font-bold text-gray-800">
                  Tip Templates
                </h3>
                <p className="text-gray-600 mt-1">
                  Quick templates you can use or modify
                </p>
              </div>
              <div className="p-5">
                <div className="grid gap-3">
                  {[
                    "Remember to stay hydrated by drinking at least 8 glasses of water today!",
                    "Taking a 10-minute walk today can boost your mood and energy levels.",
                    "Deep breathing exercises can help reduce stress and improve lung function.",
                    "Don't forget to take your medications as prescribed today.",
                    "Getting enough sleep is crucial for recovery. Aim for 7-8 hours tonight.",
                  ].map((template, index) => (
                    <button
                      key={index}
                      className="bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-md text-left text-sm px-4 py-3 transition-colors duration-200"
                      onClick={() => setTipContent(template)}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-6">
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
                <h3 className="flex items-center text-lg font-bold text-gray-800">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Sent Tips History
                </h3>
                <p className="text-gray-600 mt-1">
                  Previous motivational tips you've sent to patients
                </p>
              </div>
              <div className="p-5">
                {sentTips.length === 0 ? (
                  <div className="border rounded-lg p-6 bg-yellow-50 text-center">
                    <h4 className="font-bold text-yellow-800 mb-2">
                      No tips sent yet
                    </h4>
                    <p className="text-yellow-700">
                      You haven't sent any motivational tips to your patients
                      yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {sentTips.map((tip) => (
                      <div
                        key={tip.id}
                        className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium text-gray-800">
                              {getPatientNameById(tip.patientId)}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              tip.read
                                ? "border bg-gray-100 text-gray-600"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {tip.read ? (
                              <span className="flex items-center">
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Read
                              </span>
                            ) : (
                              "Unread"
                            )}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3 bg-blue-50 p-3 rounded-md italic">
                          {tip.content}
                        </p>

                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Sent:{" "}
                          {format(
                            new Date(tip.timestamp),
                            "MMM d, yyyy h:mm a"
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotivationalTipsPage;
