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

  type MotivationCard {
    id: ID!
    topic: String!
    message: String!
  }

  type HelpAlert {
    id: ID!
    patientId: ID!
    message: String
    viewed: Boolean!
    createdAt: DateTime!
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
    getAllHelpAlerts: [HelpAlert!]!

    # Motivation and alerts queries
    getMotivationCard: MotivationCard!
    getAllMotivationCards: [MotivationCard!]!
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

    # Motivation mutations
    createMotivationCard(topic: String!, message: String!): MotivationCard!
    deleteMotivationCard(id: ID!): Boolean!

    #alert
    sendHelpAlert(patientId: ID!, message: String): HelpAlert!
    markAlertViewed(id: ID!): Boolean!

    # Relationship mutations
    assignNurseToPatient(patientID: ID!, nurseID: ID!): User!
    unassignNurseFromPatient(patientID: ID!): User!
  }
`;

module.exports = typeDefs;
