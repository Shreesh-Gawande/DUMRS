const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    unique: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    
    
  },
  allergies: [
    {
      substance: { type: String, required: true },
      reaction: { type: String },
    },
  ],
  chronicConditions: [
    {
      condition: { type: String, required: true },
      dateDiagnosed: { type: Date },
    },
  ],
  familyMedicalHistory: [
    {
      relation: { type: String, required: true },
      condition: { type: String, required: true },
    },
  ],
  immunizationRecords: [
    {
      vaccine: { type: String, required: true },
      dateReceived: { type: Date, required: true },
      boosterShot: { type: Boolean, default: false },
    },
  ],
  surgeries: [
    { 
      procedure: { type: String },
      date: { type: String },
      hospital: { type: String },
      surgeon: { type: String },
      notes: { type: String }
    }
  ],
  healthInsuranceDetails: {
    provider: { type: String },
    coverage: { type: String },
    policyNumber: { type: String, unique: true },
    coPayAmount: { type: Number },
  },
  medicalRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Records", // Use the model name as a string
    },
  ],
});

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;
