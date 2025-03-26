import mongoose from "mongoose";

const motivationalTipSchema = new mongoose.Schema(
  {
    // Content
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["Fitness", "Nutrition", "Mental Health", "General Wellness"], 
      required: true 
    },
    mediaUrl: { type: String }, // For images/videos

    // Sender (Nurse who created/sent the tip)
    nurseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Nurse", 
      required: true 
    },

    // Recipient (Patient or group)
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient" 
    },
    isBroadcast: { 
      type: Boolean, 
      default: false 
    }, // If sent to all patients

    // Metadata
    scheduleDate: { type: Date }, // For future tips
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const MotivationalTip = mongoose.model("MotivationalTip", motivationalTipSchema);
export default MotivationalTip;