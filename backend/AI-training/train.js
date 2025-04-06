import { prepareTrainingData } from "./dataProcessor.js";
import SymptomPredictionModel from "./model.js";

// Conditionally import TensorFlow based on environment
let tf;
if (process.env.USE_CPU === "true") {
  console.log("Using CPU mode (set by environment variable)");
  tf = await import("@tensorflow/tfjs-node");
} else {
  try {
    // Try to use GPU first
    tf = await import("@tensorflow/tfjs-node-gpu");
    console.log("Using GPU acceleration");
  } catch (error) {
    console.log(`GPU import failed: ${error.message}`);
    console.log("Falling back to CPU mode");
    tf = await import("@tensorflow/tfjs-node");
  }
}

async function trainModel() {
  console.log("============================================");
  console.log("Starting Optimized COVID-19 Prediction Model Training");
  console.log("============================================");

  try {
    // Step 1: Prepare data from cleaned CSV
    console.log("\nPreparing training and testing data from cleaned CSV...");
    const { trainingData, testingData } = await prepareTrainingData();

    console.log("Data preparation complete!");
    console.log(`   Training samples: ${trainingData.length}`);
    console.log(`   Testing samples: ${testingData.length}`);

    // Step 2: Initialize and build optimized model
    console.log("\nBuilding optimized neural network model...");
    const model = new SymptomPredictionModel();
    model.buildModel();

    // Step 3: Train the model with optimized parameters
    const isGPU = tf.getBackend() === "tensorflow";
    if (isGPU) {
      console.log("\nTraining model with GPU acceleration...");
    } else {
      console.log("\nTraining model with CPU...");
    }

    // Parameters based on whether GPU is available
    // Reduced to just 5 epochs since the model is learning our rule-based labels
    const epochs = 5;
    // Larger batch size for more efficient processing
    const batchSize = isGPU ? 128 : 64;

    console.log(
      `Training with ${epochs} epochs and batch size of ${batchSize}`
    );
    await model.train(trainingData, epochs, batchSize);

    // Step 4: Evaluate the model
    console.log("\nEvaluating model on test data...");
    const { accuracy } = await model.evaluate(testingData);

    console.log(`Model trained with accuracy: ${(accuracy * 100).toFixed(2)}%`);

    // Step 5: Save the model
    console.log("\nSaving optimized model...");
    const modelPath = await model.saveModel();
    console.log(`Model saved at: ${modelPath}`);

    // Step 6: Test with prediction examples
    console.log(
      "\nTesting model with sample predictions for different severity levels..."
    );

    // Test case 1: Severe COVID (multiple severe symptoms)
    const severeSymptoms = ["fever", "cough", "shortness_of_breath", "fatigue"];
    console.log(`\nTest 1 - Severe symptoms: ${severeSymptoms.join(", ")}`);
    const severePrediction = await model.predict(severeSymptoms);
    console.log("Prediction results:");
    console.log(`   Severity: ${severePrediction.severity.toUpperCase()}`);
    console.log(
      `   Probability: ${(severePrediction.probability * 100).toFixed(2)}%`
    );

    // Test case 2: Moderate COVID
    const moderateSymptoms = ["fever", "cough", "sore_throat"];
    console.log(`\nTest 2 - Moderate symptoms: ${moderateSymptoms.join(", ")}`);
    const moderatePrediction = await model.predict(moderateSymptoms);
    console.log("Prediction results:");
    console.log(`   Severity: ${moderatePrediction.severity.toUpperCase()}`);
    console.log(
      `   Probability: ${(moderatePrediction.probability * 100).toFixed(2)}%`
    );

    // Test case 3: Mild COVID
    const mildSymptoms = ["cough", "congestion"];
    console.log(`\nTest 3 - Mild symptoms: ${mildSymptoms.join(", ")}`);
    const mildPrediction = await model.predict(mildSymptoms);
    console.log("Prediction results:");
    console.log(`   Severity: ${mildPrediction.severity.toUpperCase()}`);
    console.log(
      `   Probability: ${(mildPrediction.probability * 100).toFixed(2)}%`
    );

    // Test case 4: None (not COVID)
    const noneSymptoms = ["congestion"];
    console.log(`\nTest 4 - Non-COVID symptoms: ${noneSymptoms.join(", ")}`);
    const nonePrediction = await model.predict(noneSymptoms);
    console.log("Prediction results:");
    console.log(`   Severity: ${nonePrediction.severity.toUpperCase()}`);
    console.log(
      `   Probability: ${(nonePrediction.probability * 100).toFixed(2)}%`
    );

    console.log("\n============================================");
    console.log("Optimized model training and evaluation complete!");
    console.log("============================================");

    return {
      success: true,
      accuracy,
      modelPath,
    };
  } catch (error) {
    console.error(`\nError during model training: ${error.message}`);
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the training if script is called directly
if (process.argv[1].includes("train.js")) {
  trainModel().then((result) => {
    if (result.success) {
      console.log("\nTraining completed successfully!");
      process.exit(0);
    } else {
      console.error("\nTraining failed.");
      process.exit(1);
    }
  });
}

export default trainModel;
