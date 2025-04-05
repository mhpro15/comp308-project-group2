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

export const CREATE_MOTIVATIONAL_TIP = gql`
  mutation CreateMotivation($input: MotivationInput!) {
    createMotivation(input: $input) {
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
        conditions {
          name
          confidence
        }
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
        conditions {
          name
          confidence
        }
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
