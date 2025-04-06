import { predictCondition } from "./predictionService.js";
import { AuthenticationError } from "apollo-server-express";

const resolvers = {
  Query: {
    predictFromSymptoms: async (_, { symptoms }, context) => {
      // Check if the user is authenticated
      if (!context.isAuthenticated) {
        throw new AuthenticationError(
          "You must be logged in to access prediction services"
        );
      }

      try {
        // Simply use the predictCondition function that handles all the logic
        const prediction = await predictCondition(symptoms);

        return prediction;
      } catch (error) {
        console.error(
          `Error in predictFromSymptoms resolver: ${error.message}`
        );
        throw new Error(`Failed to generate prediction: ${error.message}`);
      }
    },
  },
};

export default resolvers;
