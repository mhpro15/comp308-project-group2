const typeDefs =`schema {
    query: Query
    mutation: Mutation
  }
scalar DateTime

enum Gender {
  Male
  Female
  Other
}

enum WeekDay {
  Mon
  Tue
  Wed
  Thu
  Fri
  Sat
  Sun
}

enum Shift {
  Morning
  Afternoon
  Night
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

type Visit {
  date: DateTime!
  doctor: String!
  reason: String!
  diagnosis: String
  prescribedTreatments: [String]
  followUpDate: DateTime
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

type WorkSchedule {
  days: [WeekDay!]!
  shift: Shift!
}

type PatientAssignment {
  patient: Patient!
  assignmentDate: DateTime!
  primaryCare: Boolean!
}

type Nurse @key(fields: "id") {
  id: ID!
  firstName: String!
  lastName: String!
  dateOfBirth: DateTime!
  gender: Gender!
  contactInfo: ContactInfo!
  licenseNumber: String!
  specialization: String
  workSchedule: WorkSchedule!
  userId: ID!
  assignedPatients: [PatientAssignment!]!
  notes: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Input types remain the same as your original
input ContactInfoInput {
  phone: String!
  email: String!
  address: String
}

input WorkScheduleInput {
  days: [WeekDay!]!
  shift: Shift!
}

input PatientAssignmentInput {
  patientId: ID!
  primaryCare: Boolean
}

input NurseInput {
  firstName: String!
  lastName: String!
  dateOfBirth: DateTime!
  gender: Gender!
  contactInfo: ContactInfoInput!
  licenseNumber: String!
  specialization: String
  workSchedule: WorkScheduleInput!
  userId: ID!
  assignedPatients: [PatientAssignmentInput!]
  notes: String
}

input NurseUpdateInput {
  firstName: String
  lastName: String
  dateOfBirth: DateTime
  gender: Gender
  contactInfo: ContactInfoInput
  licenseNumber: String
  specialization: String
  workSchedule: WorkScheduleInput
  notes: String
}

type Query {
  nurses: [Nurse!]!
  nurse(id: ID!): Nurse
  nursesBySpecialization(specialization: String!): [Nurse!]!
  nursesByAvailability(day: WeekDay!, shift: Shift!): [Nurse!]!
  searchNurses(name: String!): [Nurse!]!
  nursesByPatient(patientId: ID!): [Nurse!]!
}

type Mutation {
  createNurse(input: NurseInput!): Nurse!
  updateNurse(id: ID!, input: NurseUpdateInput!): Nurse!
  deleteNurse(id: ID!): Boolean!
  assignPatient(nurseId: ID!, patientId: ID!, primaryCare: Boolean = false): Nurse!
  removePatientAssignment(nurseId: ID!, patientId: ID!): Nurse!
  updateWorkSchedule(nurseId: ID!, schedule: WorkScheduleInput!): Nurse!
}`;
export default typeDefs;
