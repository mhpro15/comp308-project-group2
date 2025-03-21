import { useEffect, useState } from "react";
import { Activity, FileDown } from "lucide-react";
import { VitalSignsDisplay } from "./VitalSignsDisplay";
import { format } from "date-fns";

const VitalSignsHistory = (currentUser) => {
  const [vitalSigns, setVitalSigns] = useState([]);

  // useEffect(() => {
  //   if (currentUser) {
  //     const patientId =
  //       currentUser.role === "nurse" ? "patient1" : currentUser.id; // Replace with selected patient for nurse
  //     const records = {};
  //     setVitalSigns(records);
  //   }
  // }, [currentUser]);

  if (vitalSigns.length === 0) {
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold">Vital Signs History</h2>
          <p className="text-gray-500">
            No vital signs records found. Start by recording new vital signs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm">
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
          <button className="border rounded px-3 py-1 hidden md:flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Latest Record</h3>
        <VitalSignsDisplay vitalSigns={vitalSigns[0]} showDate={true} />

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
              </tr>
            </thead>
            <tbody>
              {vitalSigns?.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="p-2">
                    {format(new Date(record.timestamp), "MMM d, yyyy")}
                  </td>
                  <td className="p-2">
                    {record.bodyTemperature !== undefined
                      ? `${record.bodyTemperature}°C`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record.heartRate !== undefined
                      ? `${record.heartRate} bpm`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record.bloodPressureSystolic !== undefined &&
                    record.bloodPressureDiastolic !== undefined
                      ? `${record.bloodPressureSystolic}/${record.bloodPressureDiastolic}`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record.respiratoryRate !== undefined
                      ? `${record.respiratoryRate} /min`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {record.weight !== undefined ? `${record.weight} kg` : "-"}
                  </td>
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
