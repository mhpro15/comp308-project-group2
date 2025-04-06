// components/SendHelpAlert.jsx
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const SEND_HELP_ALERT = gql`
  mutation SendHelpAlert($patientId: ID!, $message: String) {
    sendHelpAlert(patientId: $patientId, message: $message) {
      id
      viewed
      createdAt
    }
  }
`;

const SendHelpAlert = () => {
  const patientId = localStorage.getItem("patientId");
  const [message, setMessage] = useState("");
  const [sendAlert] = useMutation(SEND_HELP_ALERT);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      alert("Patient ID missing.");
      return;
    }

    await sendAlert({
      variables: { patientId, message },
    });

    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Request Help</h5>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-2"
          placeholder="Optional message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-danger" type="submit">
          Send Alert
        </button>
      </form>
      {sent && <p className="text-success mt-2">Help alert sent!</p>}
    </div>
  );
};

export default SendHelpAlert;
