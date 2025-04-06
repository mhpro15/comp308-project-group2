import predictCondition from "./predict.js";
import trainModel from "./train.js";
import fs from "fs-extra";
import path from "path";
import { availableSymptoms, severityLevels } from "./dataProcessor.js";

/**
 * Provides integration with the GraphQL resolvers
 */
class AIIntegration {
  constructor() {
    this.MODEL_DIR = path.join(process.cwd(), "models");
    this.modelTrained = false;
    this.availableSymptoms = availableSymptoms;
    this.severityLevels = severityLevels;
    this.checkModelExists();
  }

  /**
   * Check if a trained model exists
   */
  async checkModelExists() {
    try {
      const modelMetadataPath = path.join(
        this.MODEL_DIR,
        "model_metadata.json"
      );
      this.modelTrained = await fs.pathExists(modelMetadataPath);

      if (this.modelTrained) {
        const metadata = JSON.parse(
          await fs.readFile(modelMetadataPath, "utf8")
        );
        console.log(`AI model found (version ${metadata.version})`);
        console.log(`Created: ${metadata.createdAt}`);
        console.log(`Target Condition: ${metadata.targetCondition}`);
        console.log(
          `Severity Levels: ${metadata.severityLevels?.join(", ") || "N/A"}`
        );
      } else {
        console.log("No trained model found. Run training before predictions.");
      }

      return this.modelTrained;
    } catch (error) {
      console.error(`Error checking model: ${error.message}`);
      return false;
    }
  }

  /**
   * Get all available symptoms that can be used for prediction
   * @returns {string[]} Array of available symptoms
   */
  getAvailableSymptoms() {
    return this.availableSymptoms;
  }

  /**
   * Get all severity levels the model can predict
   * @returns {string[]} Array of severity levels
   */
  getSeverityLevels() {
    return this.severityLevels;
  }

  /**
   * Process symptoms and return severity prediction for GraphQL resolver
   *
   * @param {string[]} symptoms Array of symptom names
   * @returns {Promise<{condition: string, severity: string, probability: number, allProbabilities: Object}>}
   */
  async processSymptomsForPrediction(symptoms) {
    // Validate symptoms
    const validSymptoms = symptoms.filter((s) =>
      this.availableSymptoms.includes(s)
    );

    if (validSymptoms.length === 0 && symptoms.length > 0) {
      console.warn(
        "No valid symptoms provided. Using empty symptom list for prediction."
      );
    } else if (validSymptoms.length !== symptoms.length) {
      console.warn(
        `Some symptoms were invalid and filtered out. Valid symptoms: ${validSymptoms.join(
          ", "
        )}`
      );
    }

    if (!this.modelTrained) {
      await this.checkModelExists();

      if (!this.modelTrained) {
        console.log(
          "No trained model found. Training now with cleaned data..."
        );
        const result = await trainModel();
        this.modelTrained = result.success;

        if (!this.modelTrained) {
          console.error("Failed to train model");
          return {
            condition: "unknown",
            severity: "unknown",
            probability: 0,
            allProbabilities: Object.fromEntries(
              this.severityLevels.map((level) => [level, 0])
            ),
            error: "Model training failed",
          };
        }
      }
    }

    // Make prediction with validated symptoms
    return await predictCondition(validSymptoms);
  }

  /**
   * Train or retrain the model with cleaned data
   *
   * @returns {Promise<{success: boolean, accuracy?: number, error?: string}>}
   */
  async trainOrRetrainModel() {
    console.log(
      "Starting severity prediction model training with cleaned data..."
    );
    return await trainModel();
  }
}

// Export a singleton instance
const aiIntegration = new AIIntegration();
export default aiIntegration;
