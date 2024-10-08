const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  
  diagnosticInfo: {
    testResults: [String], 
    radiologyReports: [String], // E.g., X-rays, MRI
    pathologyReports: [String], // E.g., biopsy results
    geneticTestResults: [String], // E.g., genetic testing
  },
  
  hospitalVisits: {
    outpatientSummaries: [String], // E.g., doctor consultations
    inpatientAdmissions: [
      {
        admissionDate: Date,
        reason: String,
        attendingPhysician: String,
      },
    ],
    emergencyRoomVisits: [
      {
        visitDate: Date,
        treatmentsAdministered: String,
        followUpRequired: Boolean,
      },
    ],
  },
  
  dischargeSummaries: {
    inpatientSummary: String, // Discharge instructions, medications
    rehabilitationPlans: [String], // Physical therapy, recovery
    referralSummaries: [String], // Referrals to other specialists
  },
  
  proceduralHistory: {
    surgeries: [
      {
        type: String,
        surgeonNotes: String,
        postSurgeryCare: String,
      },
    ],
    anesthesiaRecords: [String], // Types and doses of anesthesia
    operativeNotes: [String], // Detailed surgical notes
  },
  
  medicationHistory: {
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
  
  consultations: {
    physicianNotes: [String], // Doctor’s notes, diagnoses
    specialistReports: [String], // Reports from specialists
    referralInfo: [String], // Information on referrals
  },
  
  lifestyleInfo: {
    diet: String, // Dietary restrictions or recommendations
    exercise: String, // Exercise regimen
    substanceUse: {
      alcohol: Boolean,
      tobacco: Boolean,
      drugUse: Boolean,
    },
    mentalHealth: [String], // Mental health records
  },
  
  legalInfo: {
    consentForms: [String], // Consent for procedures
    advanceDirectives: [String], // End-of-life care wishes
    powerOfAttorney: [String], // Power of attorney details
  },
  
  billingRecords: {
    hospitalBills: [String], // Itemized bills
    insuranceClaims: [
      {
        claimDate: Date,
        status: String, // Approved, rejected
        coPayment: Number,
      },
    ],
    paymentRecords: [
      {
        paymentDate: Date,
        amount: Number,
      },
    ],
  },
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
