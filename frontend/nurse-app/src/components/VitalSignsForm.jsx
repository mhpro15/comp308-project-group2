import { useState } from "react";
import { Thermometer, Heart, Droplet, Activity, Weight } from "lucide-react";

const VitalSignsForm = () => {
  const [bodyTemperature, setBodyTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      console.log({
        bodyTemperature,
        heartRate,
        bloodPressureSystolic,
        bloodPressureDiastolic,
        respiratoryRate,
        weight,
        notes,
      });

      // Reset form
      setBodyTemperature("");
      setHeartRate("");
      setBloodPressureSystolic("");
      setBloodPressureDiastolic("");
      setRespiratoryRate("");
      setWeight("");
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 mt-10">
      <div className="">
        <h2 className="font-bold text-3xl">Record Vital Signs</h2>
        <p>Enter the patient's vital signs information below</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className=" space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="bodyTemperature"
                className="flex items-center font-bold text-lg"
              >
                <Thermometer className="h-4 w-4 mr-2 " />
                Body Temperature (°C)
              </label>
              <input
                id="bodyTemperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={bodyTemperature}
                onChange={(e) => setBodyTemperature(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="heartRate"
                className="flex items-center font-bold text-lg"
              >
                <Heart className="h-4 w-4 mr-2 text-health-500" />
                Heart Rate (bpm)
              </label>
              <input
                id="heartRate"
                type="number"
                placeholder="75"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bloodPressure"
                className="flex items-center font-bold text-lg"
              >
                <Droplet className="h-4 w-4 mr-2 text-health-500" />
                Blood Pressure (mmHg)
              </label>
              <div className="flex space-x-2">
                <input
                  id="bloodPressureSystolic"
                  type="number"
                  placeholder="120"
                  value={bloodPressureSystolic}
                  onChange={(e) => setBloodPressureSystolic(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <span className="flex items-center">/</span>
                <input
                  id="bloodPressureDiastolic"
                  type="number"
                  placeholder="80"
                  value={bloodPressureDiastolic}
                  onChange={(e) => setBloodPressureDiastolic(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="respiratoryRate"
                className="flex items-center font-bold text-lg"
              >
                <Activity className="h-4 w-4 mr-2 text-health-500" />
                Respiratory Rate (/min)
              </label>
              <input
                id="respiratoryRate"
                type="number"
                placeholder="16"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="weight"
                className="flex items-center font-bold text-lg"
              >
                <Weight className="h-4 w-4 mr-2 text-health-500" />
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Add any additional notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="card-footer">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto p-2 bg-blue-500 text-white rounded"
          >
            {isSubmitting ? "Saving..." : "Save Vital Signs"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VitalSignsForm;
