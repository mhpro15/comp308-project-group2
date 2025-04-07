import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients {
    getAllUsers {
      email
      id
      name
      role
    }
  }
`;

export const RECORD_VITAL_SIGNS = gql`
  mutation RecordVitalSigns($input: VitalSignsInput!) {
    recordVitalSigns(input: $input) {
      id
      Temperature
      BPsystolic
      BPdiastolic
      RespiratoryRate
      weight
      notes
      heartRate
      timeStamp
      PatientID {
        id
        email
      }
      NurseID {
        id
        email
      }
    }
  }
`;

export const GET_VITAL_SIGNS = gql`
  query GetVitalSigns($getVitalSignsId: ID!) {
    getVitalSigns(id: $getVitalSignsId) {
      id
      NurseID {
        id
        name
      }
      Temperature
      BPsystolic
      BPdiastolic
      RespiratoryRate
      weight
      notes
      timeStamp
      PatientID {
        name
        id
      }
    }
  }
`;

export const GET_PATIENT_VITAL_SIGNS = gql`
  query GetPatientVitalSigns($patientId: ID!) {
    getPatientVitalSigns(PatientID: $patientId) {
      id
      NurseID {
        id
        name
      }
      Temperature
      BPsystolic
      BPdiastolic
      heartRate
      RespiratoryRate
      weight
      notes
      timeStamp
      PatientID {
        name
        id
      }
    }
  }
`;

export const GET_SYMPTOM_RECORDS = gql`
  query GetSymptomRecord($getSymptomRecordId: ID!) {
    getSymptomRecord(id: $getSymptomRecordId) {
      id
      PatientID {
        id
      }
      symptoms
      submissionDate
      aiPrediction {
        condition
        probability
        riskLevel
      }
    }
  }
`;

export const GET_PATIENT_SYMPTOM_RECORDS = gql`
  query GetPatientSymptoms($patientId: ID!) {
    getPatientSymptoms(PatientID: $patientId) {
      id
      PatientID {
        id
      }
      symptoms
      submissionDate
      aiPrediction {
        condition
        probability
        riskLevel
      }
    }
  }
`;

export const GET_NURSE_MOTIVATIONS = gql`
  query GetNurseMotivations($nurseId: ID!) {
    getNurseMotivations(NurseID: $nurseId) {
      id
      PatientID {
        id
      }
      NurseID {
        id
      }
      title
      content
      timeStamp
    }
  }
`;

export const GET_ALERTS = gql`
  query GetUserAlerts($getAlertId: ID!) {
    getUserAlerts(userID: $userId) {
      id
      user {
        id
      }
      description
      timeStamp
    }
  }
`;

export const GET_PATIENT_ALERTS = gql`
  query GetAlert($getAlertId: ID!) {
    getAlert(id: $getAlertId) {
      id
      user {
        id
      }
      description
      timeStamp
    }
  }
`;

export const UPDATE_AI_PREDICTION = gql`
  mutation UpdateAIPrediction(
    $id: ID!
    $condition: String!
    $severity: String
    $probability: Float
    $riskLevel: String!
  ) {
    updateAIPrediction(
      id: $id
      condition: $condition
      severity: $severity
      probability: $probability
      riskLevel: $riskLevel
    ) {
      id
      aiPrediction {
        condition
        probability
        severity
        riskLevel
      }
    }
  }
`;

export const PREDICT_FROM_SYMPTOMS = gql`
  query PredictFromSymptoms($symptoms: [String]!) {
    predictFromSymptoms(symptoms: $symptoms) {
      condition
      probability
      severity
      covidPositive
      error
    }
  }
`;

export const SUBMIT_SYMPTOMS = gql`
  mutation SubmitSymptoms($input: SymptomInput!) {
    submitSymptoms(input: $input) {
      id
      symptoms
      submissionDate
      PatientID {
        id
        name
      }
      aiPrediction {
        condition
        probability
        riskLevel
      }
    }
  }
`;

export const CREATE_MOTIVATION_CARD = gql`
  mutation CreateMotivationCard($topic: String!, $message: String!) {
    createMotivationCard(topic: $topic, message: $message) {
      id
      topic
      message
    }
  }
`;

export const GET_ALL_MOTIVATION_CARDS = gql`
  query GetAllMotivationCards {
    getAllMotivationCards {
      id
      topic
      message
    }
  }
`;

export const DELETE_MOTIVATION_CARD = gql`
  mutation DeleteMotivationCard($id: ID!) {
    deleteMotivationCard(id: $id)
  }
`;

export const GET_ALL_HELP_ALERTS = gql`
  query GetAllHelpAlerts {
    getAllHelpAlerts {
      id
      patientId
      message
      viewed
      createdAt
    }
  }
`;

export const MARK_ALERT_VIEWED = gql`
  mutation MarkAlertViewed($id: ID!) {
    markAlertViewed(id: $id)
  }
`;
