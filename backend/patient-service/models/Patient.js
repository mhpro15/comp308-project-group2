import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String },
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, required: true },
    },

    // Medical History
    allergies: [{ type: String }],
    chronicIllnesses: [{ type: String }],
    pastSurgeries: [{ type: String }],
    currentMedications: [{ type: String }],
    familyMedicalHistory: [{ type: String }],

    // Physical Data & Vitals
    physicalData: {
      height: { type: Number }, // in cm
      weight: { type: Number }, // in kg
      bloodPressure: { type: String },
      heartRate: { type: Number },
      bloodType: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      symptoms: [String],
    },

    // Appointments & Visits
    visits: [
      {
        date: { type: Date, default: Date.now },
        reason: { type: String, required: true },
        diagnosis: { type: String },
        prescribedTreatments: [{ type: String }],
        followUpDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
