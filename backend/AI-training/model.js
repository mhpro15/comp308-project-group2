import {
  availableSymptoms,
  conditions,
  severityLevels,
} from "./dataProcessor.js";
import path from "path";
import fs from "fs-extra";

// Define model parameters
const MODEL_DIR = path.join(process.cwd(), "models");
const TARGET_CONDITION = "COVID-19";

// Dynamically import TensorFlow
let tf;
async function initTensorFlow() {
  if (tf) return tf; // Already initialized

  try {
    if (process.env.USE_CPU === "true") {
      tf = await import("@tensorflow/tfjs-node");
      console.log("Using CPU mode for TensorFlow");
    } else {
      try {
        // Try GPU first
        tf = await import("@tensorflow/tfjs-node-gpu");
        console.log("Using GPU acceleration for TensorFlow");
      } catch (error) {
        console.log(`GPU import failed: ${error.message}`);
        tf = await import("@tensorflow/tfjs-node");
      }
    }

    // Check GPU availability
    try {
      const backend = tf.getBackend();
      console.log(`TensorFlow backend: ${backend}`);

      if (backend === "tensorflow") {
        try {
          const gpuInfo = await tf.backend().getGPUInfo();
          console.log("GPU Acceleration enabled");
          console.log(`GPU detected: ${gpuInfo?.name || "Unknown GPU"}`);
          console.log(
            `Available VRAM: ${(
              gpuInfo?.memoryInfo?.free /
              (1024 * 1024 * 1024)
            ).toFixed(2)} GB`
          );
        } catch (error) {}
      }
    } catch (error) {
      console.log(`Error checking backend: ${error.message}`);
    }

    return tf;
  } catch (error) {
    console.error(`Failed to initialize TensorFlow: ${error.message}`);
    // Fallback to browser version as last resort
    tf = await import("@tensorflow/tfjs");
    tf.setBackend("cpu");
    return tf;
  }
}

class SymptomPredictionModel {
  constructor() {
    this.model = null;
    this.symptomFeatures = availableSymptoms;
    this.targetCondition = TARGET_CONDITION;
    this.severityLevels = severityLevels;
    this.tfInitialized = false;
  }

  async ensureTensorFlow() {
    if (!this.tfInitialized) {
      await initTensorFlow();
      this.tfInitialized = true;
    }
    return tf;
  }

  async buildModel() {
    await this.ensureTensorFlow();

    // Define a neural network for multi-class classification
    const model = tf.sequential();

    // Input layer: One node per symptom
    model.add(
      tf.layers.dense({
        units: 64, // Increased units for more complex classification
        activation: "relu",
        inputShape: [this.symptomFeatures.length],
        kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
      })
    );

    // Add a hidden layer for better feature extraction
    model.add(
      tf.layers.dense({
        units: 32,
        activation: "relu",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
      })
    );

    // Dropout to prevent overfitting
    model.add(tf.layers.dropout({ rate: 0.25 }));

    // Output layer: One node per severity level (multi-class classification)
    model.add(
      tf.layers.dense({
        units: this.severityLevels.length,
        activation: "softmax", // Use softmax for multi-class classification
      })
    );

    // Compile the model for multi-class classification
    model.compile({
      optimizer: tf.train.adam(0.002),
      loss: "categoricalCrossentropy", // Use categorical cross entropy for multi-class
      metrics: ["accuracy"],
    });

    this.model = model;
    console.log("Model built with architecture for severity prediction");

    return model;
  }

  async train(trainingData, epochs = 5, batchSize = 64) {
    await this.ensureTensorFlow();

    if (!this.model) {
      await this.buildModel();
    }

    console.log("Preparing training data for severity prediction...");
    const { xs, ys } = this.prepareTrainingData(trainingData);

    console.log("Starting training process with optimized parameters...");
    console.log(
      `Training on ${xs.shape[0]} samples with ${this.severityLevels.length} severity classes`
    );

    // Train the model with simplified callbacks
    const history = await this.model.fit(xs, ys, {
      epochs,
      batchSize,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}/${epochs}`);
          console.log(`  Loss: ${logs.loss.toFixed(4)}`);
          console.log(`  Accuracy: ${logs.acc.toFixed(4)}`);
          if (logs.val_loss) {
            console.log(`  Validation Loss: ${logs.val_loss.toFixed(4)}`);
            console.log(`  Validation Accuracy: ${logs.val_acc.toFixed(4)}`);
          }
        },
        onTrainEnd: () => {
          console.log("Training complete for severity prediction model!");
        },
      },
    });

    console.log("Training complete!");
    return history;
  }

  async evaluate(testingData) {
    await this.ensureTensorFlow();

    if (!this.model) {
      throw new Error("Model not trained yet. Please train the model first.");
    }

    const { xs, ys } = this.prepareTrainingData(testingData);

    // Evaluate the model
    const evalResult = await this.model.evaluate(xs, ys);
    const loss = evalResult[0].dataSync()[0];
    const accuracy = evalResult[1].dataSync()[0];

    console.log(`Evaluation results:`);
    console.log(`  Loss: ${loss.toFixed(4)}`);
    console.log(`  Accuracy: ${accuracy.toFixed(4)}`);

    // Calculate per-class metrics if possible
    try {
      const predictions = this.model.predict(xs);
      const predictionValues = predictions.argMax(-1).dataSync();
      const actualValues = ys.argMax(-1).dataSync();

      // Calculate confusion matrix
      const confusionMatrix = Array(this.severityLevels.length)
        .fill()
        .map(() => Array(this.severityLevels.length).fill(0));

      for (let i = 0; i < predictionValues.length; i++) {
        confusionMatrix[actualValues[i]][predictionValues[i]]++;
      }

      console.log("Confusion matrix:");
      console.log("  Predicted →");
      console.log("  Actual ↓  | " + this.severityLevels.join(" | "));
      confusionMatrix.forEach((row, i) => {
        console.log(`  ${this.severityLevels[i]}    | ${row.join(" | ")}`);
      });
    } catch (error) {
      console.error("Error calculating detailed metrics:", error.message);
    }

    return { loss, accuracy };
  }

  async predict(symptoms) {
    await this.ensureTensorFlow();

    if (!this.model) {
      throw new Error("Model not trained yet. Please train the model first.");
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

    return {
      condition: this.targetCondition,
      severity: predictedSeverity,
      probability: maxProbability,
      allProbabilities: classProbabilities,
      symptoms: symptoms,
    };
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

  prepareTrainingData(data) {
    // Extract features (symptoms) and labels (severity classes)
    const xs = [];
    const ys = [];

    data.forEach((sample) => {
      // Extract symptom features
      const features = this.symptomFeatures.map((symptom) =>
        sample[symptom] === 1 || sample[symptom] === "1" ? 1 : 0
      );

      // Create one-hot encoded array for severity levels
      const severityIndex = this.severityLevels.indexOf(sample.severity);
      if (severityIndex === -1) {
        console.warn(`Unknown severity level: ${sample.severity}`);
        return; // Skip this sample
      }

      // Create one-hot encoded vector
      const oneHot = new Array(this.severityLevels.length).fill(0);
      oneHot[severityIndex] = 1;

      xs.push(features);
      ys.push(oneHot);
    });

    return {
      xs: tf.tensor2d(xs),
      ys: tf.tensor2d(ys),
    };
  }

  async saveModel() {
    await this.ensureTensorFlow();

    if (!this.model) {
      throw new Error("No model to save. Please train a model first.");
    }

    await fs.ensureDir(MODEL_DIR);
    const modelPath = `file://${path.join(
      MODEL_DIR,
      "symptom_prediction_model"
    )}`;

    // Save the model using the native format
    await this.model.save(modelPath);
    console.log(`Model saved to ${modelPath}`);

    // Save model metadata
    const metadata = {
      symptomFeatures: this.symptomFeatures,
      targetCondition: this.targetCondition,
      severityLevels: this.severityLevels,
      version: "1.0",
      createdAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(MODEL_DIR, "model_metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    return modelPath;
  }

  async loadModel() {
    await this.ensureTensorFlow();

    const modelPath = `file://${path.join(
      MODEL_DIR,
      "symptom_prediction_model"
    )}`;

    try {
      this.model = await tf.loadLayersModel(modelPath);
      console.log(`Model loaded from ${modelPath}`);

      // Load metadata
      const metadataPath = path.join(MODEL_DIR, "model_metadata.json");

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

      return true;
    } catch (error) {
      console.error(`Failed to load model: ${error.message}`);
      return false;
    }
  }
}

export default SymptomPredictionModel;
