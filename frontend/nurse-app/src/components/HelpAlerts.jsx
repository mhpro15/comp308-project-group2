// components/HelpAlerts.jsx
import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_ALL_ALERTS = gql`
  query GetAllHelpAlerts {
    getAllHelpAlerts {
      id
      patientId
      message
      viewed
      createdAt
    }
  }
`;

const MARK_ALERT_VIEWED = gql`
  mutation MarkAlertViewed($id: ID!) {
    markAlertViewed(id: $id)
  }
`;

const HelpAlerts = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ALERTS);
  const [markViewed] = useMutation(MARK_ALERT_VIEWED);

  const handleMarkViewed = async (id) => {
    await markViewed({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p>Error loading alerts: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h3>Help Alerts</h3>
      {data.getAllHelpAlerts.length === 0 ? (
        <p>No alerts.</p>
      ) : (
        <ul className="list-group">
          {data.getAllHelpAlerts.map((alert) => (
            <li
              key={alert.id}
              className={`list-group-item d-flex justify-content-between align-items-start ${
                !alert.viewed ? "list-group-item-warning" : ""
              }`}
            >
              <div>
                <strong>Patient ID:</strong> {alert.patientId}
                <br />
                {alert.message && <p className="mb-1">{alert.message}</p>}
                <small>{new Date(alert.createdAt).toLocaleString()}</small>
              </div>
              {!alert.viewed && (
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => handleMarkViewed(alert.id)}
                >
                  Mark as Viewed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpAlerts;
