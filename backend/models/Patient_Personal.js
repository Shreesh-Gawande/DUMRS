// backend/models/Patient_Personal.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientPersonalSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    patient_id: {
      type: String,
      required: true,
      unique: true,
    },
    patient_password:{
      type:String,
      required:true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emergency_phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
  },
  { timestamps: true }
);

const Patient_Personal = mongoose.model("Patient_Personal", PatientPersonalSchema);

module.exports = Patient_Personal;
