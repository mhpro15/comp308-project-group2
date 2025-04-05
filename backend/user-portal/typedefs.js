const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    PatientID: ID
    NurseID: ID
    email: String!
    name: String!
    role: String! # 'patient' or 'nurse'
    vitalSigns: [VitalSigns!]
    symptomRecords: [SymptomRecord!]
  }
  type AuthPayload {
    token: String!
    user: User!
  }

  input UserInput {
    email: String!
    password: String!
    role: String!
    name: String!
  }

  type VitalSigns {
    id: ID!
    PatientID: User!
    NurseID: User
    Temperature: Float!
    BPsystolic: Int!
    BPdiastolic: Int!
    heartRate: Int!
    RespiratoryRate: Int!
    weight: Float!
    notes: String
    timeStamp: DateTime!
  }

  input VitalSignsInput {
    PatientID: ID!
    NurseID: ID
    Temperature: Float!
    BPsystolic: Int!
    heartRate: Int!
    BPdiastolic: Int!
    RespiratoryRate: Int!
    weight: Float!
    notes: String
  }

  type Motivation {
    id: ID!
    PatientID: User
    NurseID: [User!] ##created for assignment
    title: String!
    content: String!
    timeStamp: DateTime!
  }

  input MotivationInput {
    PatientID: ID!
    NurseID: ID!
    title: String!
    content: String!
    timeStamp: DateTime
  }

  type Alert {
    id: ID!
    user: User!
    description: String!
    timeStamp: DateTime!
  }

  input AlertInput {
    user: ID!
    description: String!
    timeStamp: DateTime
  }

  enum Symptom {
    fever
    cough
    shortness_of_breath
    fatigue
  }

  type Condition {
    name: String! # allowed values: "COVID-19", "RSV", "CHD"
    confidence: Float
  }

  type AIPrediction {
    conditions: [Condition]
    riskLevel: String # allowed values: "low", "medium", "high"
  }
  input SymptomInput {
    PatientID: ID!
    symptoms: [Symptom!]!
  }
  type SymptomRecord {
    id: ID!
    PatientID: User!
    symptoms: [Symptom!]!
    submissionDate: DateTime!
    aiPrediction: AIPrediction
  }

  input ConditionInput {
    name: String!
    confidence: Float
  }

  input AIPredictionInput {
    conditions: [ConditionInput]
    riskLevel: String
  }

  input SymptomRecordInput {
    PatientID: ID!
    symptoms: [Symptom!]!
    submissionDate: DateTime
    aiPrediction: AIPredictionInput
  }
  # Queries
  type Query {
    # User queries
    currentUser: User
    getUser(id: ID!): User
    getAllUsers(role: String): [User!]!
    # getUsersByRole(role: String!): [User!]!

    # Vital signs queries
    getVitalSigns(id: ID!): VitalSigns
    getPatientVitalSigns(PatientID: ID!): [VitalSigns!]!

    # Symptom queries
    getSymptomRecord(id: ID!): SymptomRecord
    getPatientSymptoms(PatientID: ID!): [SymptomRecord!]!

    # Alert queries
    getAlert(id: ID!): Alert
    getUserAlerts(userID: ID!): [Alert!]!

    # Motivation queries
    getMotivation(id: ID!): Motivation
    motivationsByPatient(patientId: ID!): [Motivation!]!
    getNurseMotivations(NurseID: ID!): [Motivation!]!
  }

  # Mutations
  type Mutation {
    # User mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: UserInput!): AuthPayload!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Vital signs mutations
    recordVitalSigns(input: VitalSignsInput!): VitalSigns!
    updateVitalSigns(id: ID!, input: VitalSignsInput!): VitalSigns!
    deleteVitalSigns(id: ID!): Boolean!

    # Symptom mutations
    submitSymptoms(input: SymptomInput!): SymptomRecord!
    updateAIPrediction(
      id: ID!
      conditions: [String!]!
      riskLevel: String!
    ): SymptomRecord!

    # Alert mutations
    createAlert(input: AlertInput!): Alert!
    resolveAlert(id: ID!): Alert!

    # Motivation mutations
    createMotivation(input: MotivationInput!): Motivation!
    updateMotivation(id: ID!, content: String!): Motivation!
    deleteMotivation(id: ID!): Boolean!

    # Relationship mutations
    assignNurseToPatient(patientID: ID!, nurseID: ID!): User!
    unassignNurseFromPatient(patientID: ID!): User!
  }
`;

module.exports = typeDefs;
