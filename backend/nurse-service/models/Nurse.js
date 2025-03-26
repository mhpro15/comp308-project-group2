import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      address: { type: String },
    },
    
    // Professional Information
    licenseNumber: { type: String, required: true, unique: true },

    
    // Work Schedule
    workSchedule: {
      days: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
      shift: { type: String, enum: ["Morning", "Afternoon", "Night"] }
    },
    
    // Authentication
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Assigned Patients (reference to Patient model)
    assignedPatients: [{
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      assignmentDate: { type: Date, default: Date.now },
   
    }],
    
    
    notes: { type: String }
  },
  { timestamps: true }
);

// Index for faster queries on commonly searched fields
nurseSchema.index({ email: 1, licenseNumber: 1 });

const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;