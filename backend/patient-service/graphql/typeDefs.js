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

  type ContactInfo {
    phone: String!
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
    contactDetails(id: ID!): ContactDetails
    symptoms(id: ID!): [String]
    healthDetails(id: ID!): HealthDetails
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

    addVisit(id: ID!, visit: VisitInput!): Patient!

    addSymptoms(id: ID!, symptoms: [String]!): Patient!

    removeSymptom(id: ID!, symptom: String!): Patient!
  }
`;

export default typeDefs;
