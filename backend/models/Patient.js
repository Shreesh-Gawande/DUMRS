import mongoose from "mongoose"

const PatientSchema =new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    patient_id:{
        type:String,
        required:true,
        unique:true,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    age:{
        type:Number,
        required:true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emergency_phone:{
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true
    },
    allergies: [
        {
            substance: { type: String, required: true },
            reaction: { type: String }
        }
    ],
    chronicConditions: [
        {
            condition: { type: String, required: true },
            dateDiagnosed: { type: Date }
        }
    ],
    familyMedicalHistory: [
        {
            relation: { type: String, required: true },
            condition: { type: String, required: true }
        }
    ],
    immunizationRecords: [
        {
            vaccine: { type: String, required: true },
            dateReceived: { type: Date, required: true },
            boosterShot: { type: Boolean, default: false }
        }
    ],
    healthInsuranceDetails: {
        provider: { type: String, required: true },
        coverage: { type: String },
        policyNumber: { type: String, unique: true },
        coPayAmount: { type: Number }
    }
})

const Patient =mongoose.model("Patient",PatientSchema);
module.exports=Patient;