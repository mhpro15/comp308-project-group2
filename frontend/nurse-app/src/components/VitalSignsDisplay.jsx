import { Thermometer, Heart, Droplet, Activity, Weight } from "lucide-react";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_PATIENTS, GET_PATIENT_VITAL_SIGNS } from "../api/api";

export const VitalSignsDisplay = ({
  currentUser,
  selectedPatient: initialSelectedPatient,
  showDate = false,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(
    initialSelectedPatient || ""
  );
  const [vitalSigns, setVitalSigns] = useState(null);

  const { data: patients, loading: patientsLoading } = useQuery(GET_PATIENTS);

  const {
    data: vitalSignsData,
    loading: vitalSignsLoading,
    error: vitalSignsError,
    refetch,
  } = useQuery(GET_PATIENT_VITAL_SIGNS, {
    variables: {
      patientId:
        selectedPatient ||
        (currentUser?.role === "patient" ? currentUser.id : ""),
    },
    skip: !selectedPatient && currentUser?.role !== "patient",
    fetchPolicy: "network-only",
  });

  // Update selected patient when prop changes
  useEffect(() => {
    if (initialSelectedPatient && initialSelectedPatient !== selectedPatient) {
      setSelectedPatient(initialSelectedPatient);
    }
  }, [initialSelectedPatient, selectedPatient]);

  // Set initial patient selection based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "patient") {
        setSelectedPatient(currentUser.id);
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
  }, [currentUser, patients, selectedPatient]);

  // Update vitalSigns when data changes
  useEffect(() => {
    if (vitalSignsData?.getPatientVitalSigns?.length > 0) {
      setVitalSigns(vitalSignsData.getPatientVitalSigns[0]);
    } else {
      setVitalSigns(null);
    }
  }, [vitalSignsData]);

  // Handle patient selection change
  useEffect(() => {
    if (selectedPatient) {
      refetch({ patientId: selectedPatient });
    }
  }, [selectedPatient, refetch]);

  if (vitalSignsLoading || patientsLoading) {
    return <p className="text-gray-500">Loading vital signs data...</p>;
  }

  if (vitalSignsError) {
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold">Vital Signs</h2>
          <p className="text-red-500">
            Error loading vital signs: {vitalSignsError.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {currentUser?.role === "nurse" && !initialSelectedPatient && (
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

      {!vitalSigns && selectedPatient && (
        <div className="p-4">
          <p className="text-gray-500">
            No vital signs data available for this patient.
          </p>
        </div>
      )}

      {vitalSigns && (
        <div className="health-grid">
          {vitalSigns?.Temperature !== undefined && (
            <div className="border rounded-md shadow-sm">
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-health-100 rounded-full text-health-600">
                  <Thermometer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Body Temperature
                  </p>
                  <p className="text-2xl font-bold">
                    {vitalSigns?.Temperature}°C
                  </p>
                </div>
              </div>
            </div>
          )}

          {vitalSigns?.heartRate !== undefined && (
            <div className="border rounded-md shadow-sm">
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-health-100 rounded-full text-health-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Heart Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {vitalSigns?.heartRate} bpm
                  </p>
                </div>
              </div>
            </div>
          )}

          {vitalSigns?.BPsystolic !== undefined &&
            vitalSigns?.BPdiastolic !== undefined && (
              <div className="border rounded-md shadow-sm">
                <div className="p-4 flex items-center space-x-4">
                  <div className="p-2 bg-health-100 rounded-full text-health-600">
                    <Droplet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Blood Pressure
                    </p>
                    <p className="text-2xl font-bold">
                      {vitalSigns?.BPsystolic}/{vitalSigns?.BPdiastolic} mmHg
                    </p>
                  </div>
                </div>
              </div>
            )}

          {vitalSigns?.RespiratoryRate !== undefined && (
            <div className="border rounded-md shadow-sm">
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-health-100 rounded-full text-health-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Respiratory Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {vitalSigns?.RespiratoryRate} /min
                  </p>
                </div>
              </div>
            </div>
          )}

          {vitalSigns?.weight !== undefined && (
            <div className="border rounded-md shadow-sm">
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-health-100 rounded-full text-health-600">
                  <Weight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Weight
                  </p>
                  <p className="text-2xl font-bold">{vitalSigns?.weight} kg</p>
                </div>
              </div>
            </div>
          )}

          {showDate && (
            <div className="col-span-full mt-2 text-sm text-muted-foreground">
              Recorded on{" "}
              {vitalSigns?.timeStamp
                ? format(new Date(vitalSigns.timeStamp), "MMM d, yyyy HH:mm")
                : "Unknown date"}
              {vitalSigns?.notes && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="font-medium">Notes:</p>
                  <p>{vitalSigns?.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
