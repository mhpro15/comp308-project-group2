import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_MOTIVATION_CARD = gql`
  query GetMotivationCard {
    getMotivationCard {
      id
      topic
      message
    }
  }
`;

const MotivationCard = () => {
  const { loading, error, data } = useQuery(GET_MOTIVATION_CARD);

  if (loading) return <p>Loading motivation...</p>;
  if (error) return <p>Error loading motivation: {error.message}</p>;

  const { topic, message } = data.getMotivationCard;

  return (
    <div className="card border rounded p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{topic}</h2>
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default MotivationCard;
