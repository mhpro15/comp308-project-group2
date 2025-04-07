import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { GET_ALL_HELP_ALERTS, MARK_ALERT_VIEWED } from "../api/api";

const EmergencyAlertsPage = ({ currentUser }) => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_HELP_ALERTS);
  const [markViewed] = useMutation(MARK_ALERT_VIEWED);

  const handleMarkViewed = async (id) => {
    try {
      await markViewed({ variables: { id } });
      await refetch();
    } catch (error) {
      console.error("Error marking alert as viewed:", error);
    }
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
        <h1 className="text-3xl font-bold tracking-tight text-red-600">
          Emergency Help Alerts
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and respond to emergency help requests from patients
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error loading alerts: {error.message}</p>
          </div>
        ) : !data?.getAllHelpAlerts?.length ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No Emergency Alerts
            </h3>
            <p className="text-gray-500">
              There are currently no emergency help requests from patients.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Help Requests ({data.getAllHelpAlerts.length})
              </h2>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">New</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Viewed</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {data.getAllHelpAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`py-4 ${
                    !alert.viewed
                      ? "bg-red-50 border-l-4 border-red-500"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            alert.viewed ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Emergency Help Request
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-gray-600">
                          Patient ID: {alert.patientId}
                        </p>
                        {alert.message && (
                          <p className="mt-2 p-3 bg-gray-50 rounded text-gray-700">
                            {alert.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      {!alert.viewed && (
                        <button
                          onClick={() => handleMarkViewed(alert.id)}
                          className="flex items-center bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Responded
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlertsPage;
