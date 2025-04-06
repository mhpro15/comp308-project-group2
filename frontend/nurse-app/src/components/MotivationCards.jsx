import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_ALL_CARDS = gql`
  query GetAllMotivationCards {
    getAllMotivationCards {
      id
      topic
      message
    }
  }
`;

const CREATE_CARD = gql`
  mutation CreateMotivationCard($topic: String!, $message: String!) {
    createMotivationCard(topic: $topic, message: $message) {
      id
      topic
      message
    }
  }
`;

const DELETE_CARD = gql`
  mutation DeleteMotivationCard($id: ID!) {
    deleteMotivationCard(id: $id)
  }
`;

const MotivationCards = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_CARDS);
  const [createCard] = useMutation(CREATE_CARD);
  const [deleteCard] = useMutation(DELETE_CARD);

  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!topic || !message) return;

    await createCard({ variables: { topic, message } });
    setTopic("");
    setMessage("");
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteCard({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading cards: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h3>Motivation Cards</h3>

      <form onSubmit={handleCreate} className="mb-4">
        <div className="form-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="form-group mb-2">
          <textarea
            className="form-control"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Card
        </button>
      </form>

      <ul className="list-group">
        {data.getAllMotivationCards.map((card) => (
          <li
            key={card.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{card.topic}</h5>
              <p className="mb-0">{card.message}</p>
            </div>
            <button
              onClick={() => handleDelete(card.id)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MotivationCards;
