import { gql } from "apollo-server-express";

const typeDefs = gql`
  # Add federation directive
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.0"
      import: ["@key", "@shareable"]
    )

  type PredictionProbability {
    none: Float
    mild: Float
    moderate: Float
    severe: Float
  }

  type Prediction {
    condition: String
    severity: String
    probability: Float
    allProbabilities: PredictionProbability
    symptoms: [String]
    covidPositive: Boolean
    error: String
  }

  type Query {
    predictFromSymptoms(symptoms: [String]!): Prediction
  }
`;

export default typeDefs;
