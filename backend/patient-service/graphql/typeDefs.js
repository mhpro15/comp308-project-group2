const typeDefs = `#graphql
  
  scalar DateTime
  enum Gender { 
  Male
  Female
  Other
  }
  type Patient @key(fields: "id") {
    id: ID!
    fullName: String!
    dateOfBirth: DateTime!
    gender: Gender!
    contactInfo: ContactInfo!
    emergencyContact: EmergencyContact!
    medicalHistory: MedicalHistory!
    physicalData: PhysicalData!
    visits: [Visit!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

type ContactInfo {
  phone: String!
  email: String!  
  address: String
} 
  type EmergencyContact {
    name: String!
    phone: String!
    relation: String!
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
    date: DateTime!
    doctor : String!
    reason: String!
    diagnosis: String
    prescribedTreatments: [String]
    followUpDate: DateTime
  }


## Patient Assignment linking Nurse and Patient
type PatientAssignment {
  patient: Patient!
  assignmentDate: DateTime!
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
  date: DateTime!
  doctor: String!
  reason: String!
  diagnosis: String
  prescribedTreatments: [String]
  followUpDate: DateTime
}

  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
    getSymptoms(id: ID!): [String]
  }

  type Mutation {
    addPatient(
      fullName: String!
      dateOfBirth: DateTime!
      gender: Gender! 
      contactInfo: ContactInfoInput!
      emergencyContact: EmergencyContactInput!
      medicalHistory: MedicalHistoryInput!
      physicalData: PhysicalDataInput!
      visits: [VisitInput!]
    ): Patient!
 
    updatePatient(
      id: ID!
      fullName: String
      dateOfBirth: DateTime
      gender: Gender
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
