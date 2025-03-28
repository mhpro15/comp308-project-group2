
const mongoose = require('mongoose');

const SymptomRecordSchema = new mongoose.Schema({
  PatientID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: { 
    type: [String], 
    required: true,
    enum: ['fever', 'cough', 'shortness_of_breath', 'fatigue'] 
  },
  submissionDate: { type: Date, default: Date.now },
  aiPrediction: {
    conditions: [{
      name: { type: String, enum: ['COVID-19', 'RSV', 'CHD'] },
      confidence: { type: Number }
    }],
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] }
  }
});

module.exports = mongoose.model('SymptomRecord', SymptomRecordSchema);