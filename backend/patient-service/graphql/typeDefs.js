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

  type MedicalHistory {
    allergies: [String]
    chronicIllnesses: [String]
    pastSurgeries: [String]
    currentMedications: [String]
    familyMedicalHistory: [String]
  }

  type PhysicalData {
    height: Float
    weight: Float
    bloodPressure: String
    heartRate: Int
    bloodType: String
    symptoms: [String]
  }

  type Visit {
    date: String!
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
