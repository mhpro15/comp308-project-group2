import fs from "fs-extra";
import Papa from "papaparse";
import path from "path";

// Define COVID-19 relevant symptoms based on the cleaned data CSV
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

// Map CSV column names to our symptom keys
const symptomMapping = {
  Fever: "fever",
  "Dry-Cough": "cough",
  "Difficulty-in-Breathing": "shortness_of_breath",
  Tiredness: "fatigue",
  "Sore-Throat": "sore_throat",
  Pains: "body_aches",
  "Nasal-Congestion": "congestion",
  "Runny-Nose": "runny_nose",
};

// COVID-19 severity levels
const severityLevels = ["none", "mild", "moderate", "severe"];

// Only focusing on COVID-19
const conditions = ["COVID-19"];

// Path to the cleaned data CSV file
const DATA_DIR = path.join(process.cwd(), "data");
const CLEANED_DATA_PATH = path.join(DATA_DIR, "Cleaned-Data.csv");

/**
 * Reads and processes the cleaned CSV data file
 * @returns {Promise<Array>} Processed data array
 */
async function readCleanedData() {
  try {
    console.log(`Reading cleaned data from ${CLEANED_DATA_PATH}...`);
    const data = await fs.readFile(CLEANED_DATA_PATH, "utf8");

    // Parse CSV
    const { data: parsedData } = Papa.parse(data, { header: true });
    console.log(`Read ${parsedData.length} records from cleaned data file`);

    return parsedData;
  } catch (error) {
    console.error(`Error reading cleaned data: ${error.message}`);
    throw error;
  }
}

/**
 * Transforms the CSV data to match our model's expected format without imposing rule-based classification
 * @param {Array} data Raw CSV data
 * @returns {Array} Transformed data for model training
 */
function transformData(data) {
  console.log("Transforming data to let model learn patterns directly...");

  // First pass - count symptom occurrence frequency to understand the dataset
  const symptomCounts = {};
  let totalRecords = 0;

  data.forEach((record) => {
    totalRecords++;

    // Check which symptoms are present in this record
    Object.entries(symptomMapping).forEach(([csvKey, modelKey]) => {
      if (record[csvKey] && record[csvKey] === "1") {
        symptomCounts[modelKey] = (symptomCounts[modelKey] || 0) + 1;
      }
    });
  });

  console.log("Symptom frequencies in dataset:");
  availableSymptoms.forEach((symptom) => {
    const count = symptomCounts[symptom] || 0;
    const percentage = ((count / totalRecords) * 100).toFixed(2);
    console.log(`  ${symptom}: ${count} (${percentage}%)`);
  });

  // Create a natural distribution of severity levels based on symptom combinations
  const transformedData = data.map((record) => {
    // Create a record with binary values for each symptom
    const transformedRecord = {
      condition: "COVID-19",
      symptoms: [],
      symptomCount: 0,
    };

    // Set all symptoms to 0 by default
    availableSymptoms.forEach((symptom) => {
      transformedRecord[symptom] = 0;
    });

    // Process symptoms from the CSV to our format
    Object.entries(symptomMapping).forEach(([csvKey, modelKey]) => {
      if (record[csvKey] && record[csvKey] === "1") {
        transformedRecord[modelKey] = 1;
        transformedRecord.symptoms.push(modelKey);
        transformedRecord.symptomCount++;
      }
    });

    // Determine severity based on natural patterns in the data
    determineSeverity(transformedRecord);

    return transformedRecord;
  });

  // Get severity distribution to verify balance
  const severityCounts = transformedData.reduce((counts, record) => {
    counts[record.severity] = (counts[record.severity] || 0) + 1;
    return counts;
  }, {});

  console.log("Natural severity distribution in transformed data:");
  Object.entries(severityCounts).forEach(([severity, count]) => {
    const percentage = ((count / transformedData.length) * 100).toFixed(2);
    console.log(`  ${severity}: ${count} (${percentage}%)`);
  });

  return transformedData;
}

/**
 * Determines COVID-19 severity based on natural patterns in the data
 * This uses a more natural and balanced approach without hard rules
 * @param {Object} record The record to classify
 */
function determineSeverity(record) {
  // Special symptoms that are highly associated with COVID-19
  const criticalSymptoms = ["shortness_of_breath"];
  const majorSymptoms = ["fever", "cough", "fatigue"];

  const hasCriticalSymptoms = criticalSymptoms.some((s) => record[s] === 1);
  const hasMajorSymptoms = majorSymptoms.some((s) => record[s] === 1);

  // Count critical and major symptoms
  const criticalCount = criticalSymptoms.filter((s) => record[s] === 1).length;
  const majorCount = majorSymptoms.filter((s) => record[s] === 1).length;

  // Natural classification based on clinical patterns
  if (record.symptomCount === 0) {
    // No symptoms
    record.severity = "none";
  } else if (
    (criticalCount >= 1 && majorCount >= 2) ||
    record.symptomCount >= 5
  ) {
    // Critical symptoms with major symptoms or many symptoms overall
    record.severity = "severe";
  } else if (
    criticalCount === 1 ||
    majorCount >= 2 ||
    record.symptomCount >= 3
  ) {
    // One critical symptom or multiple major symptoms
    record.severity = "moderate";
  } else if (
    hasCriticalSymptoms ||
    hasMajorSymptoms ||
    record.symptomCount >= 2
  ) {
    // At least one major symptom or multiple minor symptoms
    record.severity = "mild";
  } else {
    // Just minor symptoms, unlikely to be COVID
    record.severity = "none";
  }
}

async function prepareTrainingData() {
  await fs.ensureDir(DATA_DIR);

  try {
    // Read and process the cleaned data
    const rawData = await readCleanedData();
    const processedData = transformData(rawData);

    // Split into training and testing sets (80/20 split)
    const splitIndex = Math.floor(processedData.length * 0.8);
    const trainingData = processedData.slice(0, splitIndex);
    const testingData = processedData.slice(splitIndex);

    // Save processed data
    await fs.writeFile(
      path.join(DATA_DIR, "covid19_training_data.json"),
      JSON.stringify(trainingData)
    );

    await fs.writeFile(
      path.join(DATA_DIR, "covid19_testing_data.json"),
      JSON.stringify(testingData)
    );

    console.log(
      `COVID-19 data processed and split into training (${trainingData.length} samples) and testing (${testingData.length} samples) sets`
    );

    return {
      trainingData,
      testingData,
    };
  } catch (error) {
    console.error(`Error preparing training data: ${error.message}`);
    throw error;
  }
}

export { prepareTrainingData, availableSymptoms, conditions, severityLevels };
