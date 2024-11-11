const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({

  patient_id: {
    type: String,
    required: true,
  },
  visitDate: { type: Date, required: true }, // Date of the visit
  visitType: { type: String, enum: ['Outpatient', 'Inpatient', 'Emergency'], required: true },
  chiefComplaint: String,

  vitalSigns: {
    bloodPressure: {
      type: String,
      required: true, 
    },
    heartRate: {
      type: Number,
      required: true,
    
    },
    temperature: {
      type: Number,
      required: true,
     
    },
  },

  diagnosticInformation: {
    testResults: [{
      testName: String,
      reportFileKey: String, // URL of diagnostic test result (if applicable)
    }],
  },


  dischargeSummary: {
    admissionDate: Date,
    dischargeDate: Date,
    inpatientSummary: String, // Discharge instructions, medications
    
  },

  proceduralDetails: {
    surgeryType: String,
    surgeryDate: Date,
    ProcedureSummary: String, // Brief surgical summary
    postOpInstructions: String,
  },

  medicationDetails: {
    prescriptions: [
      {
        drugName: String,
        dosage: String,
        prescribingPhysician: String,
        refillHistory: [Date],
      },
    ],
    pharmacyRecords: [
      {
        drugName: String,
        filledDate: Date,
        pharmacyLocation: String,
      },
    ],
  },


  legalInfo: {
    consentForms: [String], // Consent for procedures
    advanceDirectives: [String], // End-of-life care wishes
    powerOfAttorney: [String], // Power of attorney details
  },


  paymentRecords: [
    {
      transactionId: {
        type: String,
        required: true
      },
      paymentMode: String,
      paymentDate: Date,
      amount: Number,
    },
  ],

}, { timestamps: true });

const Record = mongoose.model('Records', recordSchema);

module.exports = Record;
