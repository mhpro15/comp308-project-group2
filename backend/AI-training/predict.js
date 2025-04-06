import SymptomPredictionModel from "./model.js";
import { availableSymptoms, severityLevels } from "./dataProcessor.js";

/**
 * Predicts COVID-19 severity based on symptoms
 * @param {string[]} symptoms - Array of symptom names
 * @returns {Promise<{condition: string, severity: string, probability: number, allProbabilities: Object, covidPositive: boolean}>}
 */
async function predictCondition(symptoms) {
  try {
    console.log(
      `Predicting COVID-19 severity for symptoms: ${
        symptoms.join(", ") || "none"
      }`
    );

    // Validate symptoms against available ones
    const validSymptoms = symptoms.filter((s) => availableSymptoms.includes(s));

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

    // Load model
    const model = new SymptomPredictionModel();
    const loaded = await model.loadModel();

    if (!loaded) {
      throw new Error(
        "Failed to load model. Please ensure the model is trained first."
      );
    }

    // Make prediction with valid symptoms
    const prediction = await model.predict(validSymptoms);

    console.log("Severity prediction complete:");
    console.log(`   Condition: ${prediction.condition}`);
    console.log(`   Predicted Severity: ${prediction.severity}`);
    console.log(`   Confidence: ${(prediction.probability * 100).toFixed(2)}%`);

    console.log("Class probabilities:");
    Object.entries(prediction.allProbabilities).forEach(([level, prob]) => {
      console.log(`   ${level}: ${(prob * 100).toFixed(2)}%`);
    });

    // Add covidPositive flag
    prediction.covidPositive = prediction.severity !== "none";

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

// If script is run directly, predict based on command line args
if (process.argv[1].includes("predict.js")) {
  const symptoms = process.argv.slice(2);

  if (symptoms.length === 0) {
    console.log("Usage: node predict.js [symptom1] [symptom2] ...");
    console.log("Example: node predict.js fever cough shortness_of_breath");
    console.log(
      "(Empty symptom list is valid and will predict 'none' severity)"
    );
    console.log("\nAvailable symptoms:");
    console.log(availableSymptoms.join(", "));
  }

  predictCondition(symptoms)
    .then((result) => {
      console.log("\nSeverity assessment summary:");
      console.log("----------------------------");
      console.log(
        `COVID-19 Status: ${result.covidPositive ? "POSITIVE" : "NEGATIVE"}`
      );
      console.log(`Severity: ${result.severity.toUpperCase()}`);
      console.log(`Confidence: ${(result.probability * 100).toFixed(2)}%`);
      console.log(`Symptoms assessed: ${symptoms.join(", ") || "None"}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

export default predictCondition;
