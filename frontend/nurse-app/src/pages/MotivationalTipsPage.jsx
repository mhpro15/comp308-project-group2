import { useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  GET_ALL_MOTIVATION_CARDS,
  CREATE_MOTIVATION_CARD,
  DELETE_MOTIVATION_CARD,
} from "../api/api";
import { useQuery, useMutation } from "@apollo/client";

const MotivationalTipsPage = ({ currentUser }) => {
  const [submitting, setSubmitting] = useState(false);
  const [cardTopic, setCardTopic] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const {
    data: motivationCards,
    loading: cardsLoading,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery(GET_ALL_MOTIVATION_CARDS);
  const [createMotivationCard] = useMutation(CREATE_MOTIVATION_CARD);
  const [deleteMotivationCard] = useMutation(DELETE_MOTIVATION_CARD);

  const handleSubmitCard = async () => {
    if (!cardTopic.trim() || !cardMessage.trim()) {
      alert(
        "Error: Please enter both topic and message for the motivation card."
      );
      return;
    }

    setSubmitting(true);

    try {
      await createMotivationCard({
        variables: {
          topic: cardTopic,
          message: cardMessage,
        },
      });

      setCardTopic("");
      setCardMessage("");

      await refetchCards();
      alert("Success: Motivation card created successfully.");
    } catch (error) {
      alert("Error: Failed to create motivation card.");
      console.error("Error creating motivation card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteMotivationCard({
        variables: { id },
      });
      await refetchCards();
    } catch (error) {
      alert("Error: Failed to delete motivation card.");
      console.error("Error deleting motivation card:", error);
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
        <h1 className="text-3xl font-bold tracking-tight text-blue-700">
          Motivation Cards
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage motivational cards for all patients
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5">
              <h3 className="flex items-center text-lg font-bold text-blue-800">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                Create Motivation Card
              </h3>
              <p className="text-gray-600 mt-1">
                Create general motivation cards for all patients
              </p>
            </div>
            <div className="p-5 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="cardTopic"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Topic
                </label>
                <input
                  id="cardTopic"
                  type="text"
                  placeholder="Enter card topic..."
                  value={cardTopic}
                  onChange={(e) => setCardTopic(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cardMessage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Motivation Message
                </label>
                <textarea
                  id="cardMessage"
                  placeholder="Write your motivation message here..."
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="bg-gray-50 p-5 border-t">
              <button
                onClick={handleSubmitCard}
                disabled={
                  submitting || !cardTopic.trim() || !cardMessage.trim()
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Card"}
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm mt-8 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-800">
                All Motivation Cards
              </h3>
              <p className="text-gray-600 mt-1">
                View and manage all motivation cards
              </p>
            </div>
            <div className="p-5">
              {cardsLoading ? (
                <p className="text-gray-500">Loading cards...</p>
              ) : cardsError ? (
                <p className="text-red-500">
                  Error loading cards: {cardsError.message}
                </p>
              ) : !motivationCards?.getAllMotivationCards?.length ? (
                <div className="border rounded-lg p-6 bg-yellow-50 text-center">
                  <h4 className="font-bold text-yellow-800 mb-2">
                    No motivation cards yet
                  </h4>
                  <p className="text-yellow-700">
                    Create your first motivation card above
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {motivationCards.getAllMotivationCards.map((card) => (
                    <div
                      key={card.id}
                      className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium text-gray-800">
                            {card.topic}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-xs px-3 py-1 rounded-full font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        >
                          Delete
                        </button>
                      </div>

                      <p className="text-gray-700 mb-3 bg-blue-50 p-3 rounded-md italic">
                        {card.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationalTipsPage;
