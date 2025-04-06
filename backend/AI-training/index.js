import aiIntegration from "./integration.js";
import predictCondition from "./predict.js";
import trainModel from "./train.js";
import SymptomPredictionModel from "./model.js";
import {
  availableSymptoms,
  conditions,
  prepareTrainingData,
} from "./dataProcessor.js";

// Export the main integration object as default
export default aiIntegration;

// Export individual components for more granular usage
export {
  predictCondition,
  trainModel,
  SymptomPredictionModel,
  availableSymptoms,
  conditions,
  prepareTrainingData,
};
