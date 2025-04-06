import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define symptom-related constants directly in this file
// These match the constants in AI-training/dataProcessor.js
const availableSymptoms = [
  "fever",
  "cough",
  "shortness_of_breath",
  "fatigue",
  "sore_throat",
  "body_aches",
  "congestion",
  "runny_nose",
];

// COVID-19 severity levels
const severityLevels = ["none", "mild", "moderate", "severe"];

// Default target condition
const TARGET_CONDITION = "COVID-19";

// Dynamically import TensorFlow
let tf;
async function initTensorFlow() {
  if (tf) return tf; // Already initialized

  try {
    tf = await import("@tensorflow/tfjs-node");
    console.log("Using TensorFlow Node.js backend");
    return tf;
  } catch (error) {
    console.error(`Failed to initialize TensorFlow: ${error.message}`);
    throw new Error(`TensorFlow initialization failed: ${error.message}`);
  }
}

class SymptomPredictionService {
  constructor() {
    this.model = null;
    this.symptomFeatures = availableSymptoms;
    this.targetCondition = TARGET_CONDITION;
    this.severityLevels = severityLevels;
    this.tfInitialized = false;
    this.modelLoaded = false;
  }

  async ensureTensorFlow() {
    if (!this.tfInitialized) {
      tf = await initTensorFlow();
      this.tfInitialized = true;
    }
    return tf;
  }

  async loadModel() {
    if (this.modelLoaded) return true;

    await this.ensureTensorFlow();

    // Define model paths - use models in the current service directory
    const MODEL_DIR = path.join(process.cwd(), "models");
    const modelPath = `file://${path.join(
      MODEL_DIR,
      "symptom_prediction_model/model.json"
    )}`;
    const metadataPath = path.join(MODEL_DIR, "model_metadata.json");

    try {
      console.log(`Attempting to load model from: ${modelPath}`);

      // Load model
      this.model = await tf.loadLayersModel(modelPath);
      console.log(`Model loaded successfully from ${modelPath}`);

      // Load metadata if exists
      if (await fs.pathExists(metadataPath)) {
        const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
        this.symptomFeatures = metadata.symptomFeatures;
        this.targetCondition = metadata.targetCondition || TARGET_CONDITION;
        this.severityLevels = metadata.severityLevels;

        console.log(
          `Model metadata loaded: version ${metadata.version}, created at ${metadata.createdAt}`
        );
      } else {
        console.warn("Model metadata not found. Using default settings.");
      }

      // Compile the loaded model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      this.modelLoaded = true;
      return true;
    } catch (error) {
      console.error(`Failed to load model: ${error.message}`);
      return false;
    }
  }

  symptomsToFeatureVector(symptoms) {
    // Convert array of symptom names to binary feature vector
    const featureVector = new Array(this.symptomFeatures.length).fill(0);

    symptoms.forEach((symptom) => {
      const index = this.symptomFeatures.indexOf(symptom);
      if (index !== -1) {
        featureVector[index] = 1;
      }
    });

    return tf.tensor2d([featureVector]);
  }

  async predict(symptoms) {
    if (!this.modelLoaded) {
      const loaded = await this.loadModel();
      if (!loaded) {
        throw new Error(
          "Failed to load model. Please ensure the model is trained and available."
        );
      }
    }

    // Convert symptoms to feature vector
    const inputTensor = this.symptomsToFeatureVector(symptoms);

    // Make prediction
    const prediction = this.model.predict(inputTensor);
    const probabilities = prediction.dataSync();

    // Get the index of the highest probability
    let maxIndex = 0;
    let maxProbability = 0;

    for (let i = 0; i < this.severityLevels.length; i++) {
      if (probabilities[i] > maxProbability) {
        maxProbability = probabilities[i];
        maxIndex = i;
      }
    }

    // Convert to severity level
    const predictedSeverity = this.severityLevels[maxIndex];

    // Create probability object for all classes
    const classProbabilities = {};
    this.severityLevels.forEach((level, i) => {
      classProbabilities[level] = probabilities[i];
    });

    // Return prediction result with covidPositive flag
    return {
      condition: this.targetCondition,
      severity: predictedSeverity,
      probability: maxProbability,
      allProbabilities: classProbabilities,
      symptoms: symptoms,
      covidPositive: predictedSeverity !== "none",
    };
  }
}

// Create a singleton instance for prediction service
const predictionService = new SymptomPredictionService();

// Also expose a function similar to the one in predict.js for compatibility
export async function predictCondition(symptoms) {
  try {
    console.log(
      `Predicting COVID-19 severity for symptoms: ${
        symptoms.join(", ") || "none"
      }`
    );

    // Validate symptoms against available ones
    const validSymptoms = symptoms.filter((s) =>
      predictionService.symptomFeatures.includes(s)
    );

    if (validSymptoms.length === 0) {
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

    // Make prediction with valid symptoms
    const prediction = await predictionService.predict(validSymptoms);

    console.log("Severity prediction complete:");
    console.log(`   Condition: ${prediction.condition}`);
    console.log(`   Predicted Severity: ${prediction.severity}`);
    console.log(`   Confidence: ${(prediction.probability * 100).toFixed(2)}%`);

    console.log("Class probabilities:");
    Object.entries(prediction.allProbabilities).forEach(([level, prob]) => {
      console.log(`   ${level}: ${(prob * 100).toFixed(2)}%`);
    });

    return prediction;
  } catch (error) {
    console.error(`Prediction error: ${error.message}`);

    // Return a safe default response in case of error
    return {
      condition: "unknown",
      severity: "unknown",
      probability: 0,
      covidPositive: false,
      allProbabilities: Object.fromEntries(
        severityLevels.map((level) => [level, 0])
      ),
      error: error.message,
    };
  }
}

export default predictionService;
