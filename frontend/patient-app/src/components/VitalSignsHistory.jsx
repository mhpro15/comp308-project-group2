import { useEffect, useState } from "react";
import { Activity, FileDown, RefreshCw } from "lucide-react"; // Added RefreshCw icon
import { VitalSignsDisplay } from "./VitalSignsDisplay";
import { format } from "date-fns";
import { useQuery } from "@apollo/client";
import { GET_PATIENTS, GET_PATIENT_VITAL_SIGNS } from "../api/api";

const VitalSignsHistory = ({ user }) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isRefetching, setIsRefetching] = useState(false);
  console.log("Current User in VitalSignsHistory:", user);
  const {
    data: patients,
    loading: patientsLoading,
    error: patientsError,
  } = useQuery(GET_PATIENTS);

  const {
    data: vitalSignsData,
    loading: vitalSignsLoading,
    error: vitalSignsError,
    refetch,
  } = useQuery(GET_PATIENT_VITAL_SIGNS, {
    variables: {
      patientId: selectedPatient || (user?.role === "patient" ? user.id : ""),
    },
    skip: !selectedPatient && user?.role !== "patient",
    fetchPolicy: "network-only",
  });

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await refetch();
    } finally {
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "patient") {
        setSelectedPatient(user.id);
      } else if (patients?.getAllUsers?.length > 0 && !selectedPatient) {
        // Optionally set to first patient for nurse
        const firstPatient = patients.getAllUsers.find(
          (user) => user.role === "patient"
        );
        if (firstPatient) {
          setSelectedPatient(firstPatient.id);
        }
      }
    }
  }, [user, patients, selectedPatient]);

  useEffect(() => {
    if (selectedPatient) {
      refetch({ patientId: selectedPatient });
    }
  }, [selectedPatient, refetch]);

  if (vitalSignsLoading || patientsLoading) {
    return <p>Loading vital signs data...</p>;
  }

  if (vitalSignsError) {
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold">Vital Signs History</h2>
          <p className="text-red-500">
            Error loading vital signs: {vitalSignsError.message}
          </p>
        </div>
      </div>
    );
  }

  const vitalSigns = vitalSignsData?.getPatientVitalSigns || [];

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {user?.role == "nurse" && (
        <div className="mb-6">
          <label
            htmlFor="patientSelect"
            className="block font-bold text-lg mb-2"
          >
            Select Patient
          </label>
          <select
            id="patientSelect"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">-- Select a patient --</option>
            {patients?.getAllUsers
              ?.filter((user) => user.role === "patient")
              .map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Activity className="h-5 w-5 mr-2 text-health-500" />
              Vital Signs History
            </h2>
            <p className="text-gray-500">
              View historical vital signs measurements
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefetch}
              disabled={isRefetching || vitalSignsLoading}
              className="border rounded px-3 py-1 flex items-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              {isRefetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Latest Record</h3>
        {vitalSigns.length === 0 ? (
          <p>No vital signs records found for this patient.</p>
        ) : (
          <VitalSignsDisplay
            user={user}
            selectedPatient={selectedPatient}
            showDate={true}
          />
        )}

        <h3 className="text-lg font-medium mt-8 mb-4">Historical Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Temperature</th>
                <th className="text-left p-2">Heart Rate</th>
                <th className="text-left p-2">Blood Pressure</th>
                <th className="text-left p-2">Respiratory Rate</th>
                <th className="text-left p-2">Weight</th>
                <th className="text-left p-2">Notes</th>
                <th className="text-left p-2">Nurse</th>
              </tr>
            </thead>
            <tbody>
              {vitalSigns.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="p-2">
                    {format(new Date(record.timeStamp), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="p-2">
                    {record?.Temperature !== undefined
                      ? `${record.Temperature}°C`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record?.heartRate !== undefined
                      ? `${record.heartRate} bpm`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record?.BPsystolic !== undefined &&
                    record?.BPdiastolic !== undefined
                      ? `${record.BPsystolic}/${record.BPdiastolic}`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record?.RespiratoryRate !== undefined
                      ? `${record.RespiratoryRate} /min`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record?.weight !== undefined ? `${record.weight} kg` : "-"}
                  </td>
                  <td className="p-2">{record?.notes || "-"}</td>
                  <td className="p-2">{record?.NurseID?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsHistory;
