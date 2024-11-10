// backend/models/Patient_Personal.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientPersonalSchema = new Schema(
  {
    patient_id: {
      type: String,
      required: true,
      unique: true,
    },
    patientPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Patient_Personal = mongoose.model("Patient_Personal", PatientPersonalSchema);

module.exports = Patient_Personal;
