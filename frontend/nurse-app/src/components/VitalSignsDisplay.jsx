import { Thermometer, Heart, Droplet, Activity, Weight } from "lucide-react";
import { format } from "date-fns";
import React from "react";

export const VitalSignsDisplay = ({ vitalSigns, showDate = false }) => {
  return (
    <div className="health-grid">
      {vitalSigns?.bodyTemperature !== undefined && (
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
                {vitalSigns?.bodyTemperature}°C
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
              <p className="text-2xl font-bold">{vitalSigns?.heartRate} bpm</p>
            </div>
          </div>
        </div>
      )}

      {vitalSigns?.bloodPressureSystolic !== undefined &&
        vitalSigns?.bloodPressureDiastolic !== undefined && (
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
                  {vitalSigns?.bloodPressureSystolic}/
                  {vitalSigns?.bloodPressureDiastolic} mmHg
                </p>
              </div>
            </div>
          </div>
        )}

      {vitalSigns?.respiratoryRate !== undefined && (
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
                {vitalSigns?.respiratoryRate} /min
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
          {format(new Date(vitalSigns?.timestamp), "MMMM d, yyyy, h:mm a")}
          {vitalSigns?.notes && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <p className="font-medium">Notes:</p>
              <p>{vitalSigns?.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
