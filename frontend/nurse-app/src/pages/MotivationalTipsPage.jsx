import { useState, useEffect } from "react";
import {
  MessageCircleHeart,
  User as UserIcon,
  CheckCheck,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const MotivationalTipsPage = ({ currentUser }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [tipContent, setTipContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTips, setSentTips] = useState([]);
  const [activeTab, setActiveTab] = useState("send");

  //   useEffect(() => {
  //     if (currentUser && currentUser.role === "nurse") {
  //       const assignedPatients = getPatientsByNurseId(currentUser.id);
  //       setPatients(assignedPatients);

  //       // Get all sent tips
  //       const allTips = [];
  //       assignedPatients.forEach((patient) => {
  //         const patientTips = getMotivationalTips(patient.id);
  //         allTips.push(...patientTips);
  //       });

  //       // Sort tips by timestamp (newest first)
  //       allTips.sort(
  //         (a, b) =>
  //           new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  //       );
  //       setSentTips(allTips);
  //     }
  //   }, [currentUser]);

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
        const newTip = addMotivationalTip({
          nurseId: currentUser.id,
          patientId: selectedPatient,
          content: tipContent,
          timestamp: new Date(),
        });

        // // Add to local state
        // setSentTips((prev) => [newTip, ...prev]);

        // // Reset form
        // setTipContent("");

        console.log(newTip);

        alert("Success: Motivational tip sent successfully.");
      }
    } catch (error) {
      alert("Error: Failed to send motivational tip.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientNameById = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  if (!currentUser || currentUser.role !== "nurse") {
    return (
      <div className="border rounded-lg p-4">
        <div className="p-4">
          <h3 className="text-lg font-bold">Access Restricted</h3>
          <p className="text-gray-500">
            This page is only accessible to nurse users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Motivational Tips</h1>
        <p className="text-gray-500">
          Send encouraging messages to your patients
        </p>
      </div>

      <div>
        <div className="border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "send" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("send")}
          >
            Send Tip
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "history" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            Tip History
          </button>
        </div>

        {activeTab === "send" && (
          <div className="mt-4">
            <div className="border rounded-lg p-4">
              <div className="p-4">
                <h3 className="flex items-center text-lg font-bold">
                  <MessageCircleHeart className="h-5 w-5 mr-2 text-blue-500" />
                  New Motivational Tip
                </h3>
                <p className="text-gray-500">
                  Share encouragement, health tips, or reminders with your
                  patients
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="patient" className="block font-medium">
                    Select Patient
                  </label>
                  <select
                    id="patient"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tipContent" className="block font-medium">
                    Motivational Message
                  </label>
                  <textarea
                    id="tipContent"
                    placeholder="Write your motivational tip here..."
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                    rows={4}
                    className="w-full border rounded p-2"
                  />
                  <p className="text-sm text-gray-500">
                    Keep messages positive, concise, and actionable.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting || !tipContent.trim() || !selectedPatient
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Tip"}
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-4 mt-6">
              <div className="p-4">
                <h3 className="text-lg font-bold">Tip Templates</h3>
                <p className="text-gray-500">
                  Quick templates you can use or modify
                </p>
              </div>
              <div className="p-4">
                <div className="grid gap-2">
                  {[
                    "Remember to stay hydrated by drinking at least 8 glasses of water today!",
                    "Taking a 10-minute walk today can boost your mood and energy levels.",
                    "Deep breathing exercises can help reduce stress and improve lung function.",
                    "Don't forget to take your medications as prescribed today.",
                    "Getting enough sleep is crucial for recovery. Aim for 7-8 hours tonight.",
                  ].map((template, index) => (
                    <button
                      key={index}
                      className="border rounded text-left text-sm px-3 py-2"
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
          <div className="mt-4">
            <div className="border rounded-lg p-4">
              <div className="p-4">
                <h3 className="flex items-center text-lg font-bold">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Sent Tips History
                </h3>
                <p className="text-gray-500">
                  Previous motivational tips you've sent to patients
                </p>
              </div>
              <div className="p-4">
                {sentTips.length === 0 ? (
                  <div className="border rounded-md p-4 bg-yellow-50">
                    <h4 className="font-bold">No tips sent yet</h4>
                    <p>
                      You haven't sent any motivational tips to your patients
                      yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentTips.map((tip) => (
                      <div key={tip.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium">
                              {getPatientNameById(tip.patientId)}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              tip.read
                                ? "border bg-gray-100"
                                : "bg-blue-500 text-white"
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

                        <p className="text-sm mb-2">{tip.content}</p>

                        <p className="text-xs text-gray-500">
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
