const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to Patient collection
  visitDate: { type: Date, required: true }, // Date of the visit
  visitType: { type: String, enum: ['Outpatient', 'Inpatient', 'Emergency'], required: true },


  diagnosticInformation: {
    testResults: [{
      testName: String,
      date: Date,
      reportFileURL: String, // URL of diagnostic test result (if applicable)
    }],
    radiologyReports: [{
      scanType: String, // e.g., X-ray, MRI
      date: Date,
      reportFileURL: String, // URL to the scan report or images
    }],
    pathologyReports: [{
      sampleType: String, // e.g., biopsy, tissue
      date: Date,
      reportFileURL: String, // URL of pathology report
    }],
    geneticTestResults: [{
      testName: String,
      date: Date,
      reportFileURL: String, // URL to genetic test results
    }]
  },


  dischargeSummaries: {
    admissionDate: Date,
    dischargeDate: Date,
    inpatientSummary: String, // Discharge instructions, medications
    referrals: [{
      referredTo: String,
      reasonForReferral: String,
    }],
  },

  proceduralDetails: {
    surgeries: [String],  // All surgeries undergone during the visit
    anesthesiaRecords: [String], // Types and doses of anesthesia
    ProcedureSummary: String, // Brief surgical summary
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
