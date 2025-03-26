const typeDefs = `#graphql
  type Patient {
    id: ID!
    fullName: String!
    dateOfBirth: String!
    gender: String!
    contactInfo: ContactInfo!
    emergencyContact: EmergencyContact!
    medicalHistory: MedicalHistory!
    physicalData: PhysicalData!
    visits: [Visit!]!
    createdAt: String!
    updatedAt: String!
  }
  ## Nurse Type
  type Nurse {
  id: ID!
  fullName: String!
  dateOfBirth: String!
  gender: String!
  contactInfo: NurseContactInfo!
  licenseNumber: String!
  specialization: String
  workSchedule: WorkSchedule
  assignedPatients: [PatientAssignment!]
  isActive: Boolean!
}
  ## Motivational Tip Type
  type MotivationalTip {
  id: ID!
  title: String!
  content: String!
  category: String!
  mediaUrl: String
  nurse: Nurse!   # Populated from nurseId
  patient: Patient # Populated from patientId (if not broadcast)
  isBroadcast: Boolean!
  scheduleDate: String
  isRead: Boolean!
  readAt: String
  createdAt: String!
}
  type ContactInfo {
    phone: String!  # Required
    email: String                 
    address: String
  }

  type EmergencyContact {
    name: String!
    phone: String!
    relation: String!
  }

  type ContactDetails {
  contactInfo: ContactInfo
  emergencyContact: EmergencyContact
}

  type MedicalHistory {
    allergies: [String]
    chronicIllnesses: [String]
    pastSurgeries: [String]
    currentMedications: [String]
  }

  type PhysicalData {
    height: Float
    weight: Float
    bloodPressure: String
    heartRate: Int
    bloodType: String
    symptoms: [String]
  }

  type HealthDetails {
  medicalHistory: MedicalHistory
  physicalData: PhysicalData
  visits: [Visit]
  }

  type Visit {
    date: String!
    doctor : String!
    reason: String!
    diagnosis: String
    prescribedTreatments: [String]
    followUpDate: String
  }
    ##Nurse specific sub types
    ## Nurse Contact Info
  type NurseContactInfo {
  phone: String!
  email: String!  # Nurses require email
  address: String
}
## Work Schedule
type WorkSchedule {
  days: [String!]  # e.g., ["Mon", "Wed"]
  shift: String    # "Morning"/"Afternoon"/"Night"
}
## Patient Assignment linking Nurse and Patient
type PatientAssignment {
  patient: Patient!
  assignmentDate: String!
  primaryCare: Boolean!
}

# Response Types--later
type ConditionAnalysis {
  possibleConditions: [String!]!
  advice: String!
}

type EmergencyAlert {
  id: ID!
  patient: Patient!
  message: String!
  status: String!
  createdAt: String!
}
  input ContactInfoInput {
    phone: String!
    email: String
    address: String
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
    relation: String!
  }

  input MedicalHistoryInput {
    allergies: [String]
    chronicIllnesses: [String]
    pastSurgeries: [String]
    currentMedications: [String]
  }

  input PhysicalDataInput {
    height: Float
    weight: Float
    bloodPressure: String
    heartRate: Int
    bloodType: String
    symptoms: [String]
  }

  input VisitInput {
  date: String!
  doctor: String!
  reason: String!
  diagnosis: String
  prescribedTreatments: [String]
  followUpDate: String
}

  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
    getSymptoms(id: ID!): [String]
  }

  type Mutation {
    addPatient(
      fullName: String!
      dateOfBirth: String!
      gender: String!
      contactInfo: ContactInfoInput!
      emergencyContact: EmergencyContactInput!
      medicalHistory: MedicalHistoryInput!
      physicalData: PhysicalDataInput!
      visits: [VisitInput!]
    ): Patient!
 
    updatePatient(
      id: ID!
      fullName: String
      dateOfBirth: String
      gender: String
      contactInfo: ContactInfoInput
      emergencyContact: EmergencyContactInput
      medicalHistory: MedicalHistoryInput
      physicalData: PhysicalDataInput
      visits: [VisitInput]
    ): Patient!

    deletePatient(id: ID!): String!

    addSymptoms(id: ID!, symptoms: [String]!): Patient!
  }
`;

export default typeDefs;
