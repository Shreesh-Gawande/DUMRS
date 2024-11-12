const router = require("express").Router();
const { createNewPatient, addStaticRecordsToPatients, GetStaticPatientData, GetPAtientStaticMedicalData, updatePatientPersonalData, updataPatientStaticMedicalData } = require("../controllers/PatientDataControllers");
const { createNewHospital, updateHospital } = require("../controllers/HospitalDataControllers");

//Add static data to patients
router.post('/new/:patient_id',addStaticRecordsToPatients);
const authMiddleware= require("../middlewares/auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const crypto = require('crypto');
const Patient_Personal = require("../models/Patient_Personal");
const { body, validationResult } = require('express-validator');

function generateRandomPassword() {
    return crypto.randomBytes(8).toString('hex'); // Generates a 16-character password
  }
  
  function generateRandomPatientId() {
    // Generate random bytes and convert them to a decimal number
    const randomBytes = crypto.randomBytes(5); // 5 bytes = 40 bits, enough for a 10-digit number
    const decimalValue = parseInt(randomBytes.toString('hex'), 16);

    // Ensure the value is a 10-digit number
    return decimalValue % 9000000000 + 1000000000; // Ensures the number is between 1000000000 and 9999999999
}



// Create a new patient
router.post('/patient/new',createNewPatient);

//Get patient Static Data
router.get('/patient/staticData/:patient_id', GetStaticPatientData);

//update patient Static medical data
router.put("/patient/:patient_id",updataPatientStaticMedicalData);

//get patient Static medical data
router.get('/patient/:patient_id',GetPAtientStaticMedicalData);
router.post('/new/:patient_id', async (req, res) => {
    try {
        const {
            bloodType,
            allergies,
            chronicConditions,
            familyMedicalHistory,
            immunizationRecords,
            healthInsuranceDetails
        } = req.body;

        // Get patient_id from URL parameters
        const patientId = req.params.patient_id;

        // Check if the patient ID already exists
        const existingPatient = await Patient.findOne({ patient_id: patientId });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient ID already exists' });
        }

        // Create a new patient document with the given patient_id
        const patient = new Patient({
            patient_id: patientId,
            bloodType,
            allergies,
            chronicConditions,
            familyMedicalHistory,
            immunizationRecords,
            healthInsuranceDetails
        });

        // Save the patient to the database
        await patient.save();

        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (error) {
        console.error('Error during patient creation:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/patient/new', async (req, res) => {
    try {
        const {
            fullName,
            dateOfBirth,
            weight,
            height,
            gender,
            phoneNumber,
            email,
            emergencyPhone,
            address
        } = req.body;

        if (!phoneNumber || phoneNumber === null) {
            return res.status(400).json({ message: "Phone number is required and cannot be null" });
        }

        // Check if phone number already exists
        const existingPhoneNumber = await Patient_Personal.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // Generate a random password and hash it
        const password = generateRandomPassword();
        console.log('Generated password:', password);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a random patient ID
        const patientId = generateRandomPatientId();

        // Parse dateOfBirth to a valid date format
        const parsedDateOfBirth = new Date(dateOfBirth);

        // Calculate age based on date of birth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        // Create a new patient personal document
        const patientPersonal = new Patient_Personal({
            fullName,
            patient_id: patientId,
            patient_password: hashedPassword,
            dateOfBirth: parsedDateOfBirth,
            age: age,
            weight,
            height,
            gender,
            phoneNumber,
            email,
            emergency_phone:emergencyPhone,
            address
        });

        // Save the patient personal information to the database
        await patientPersonal.save();

        res.status(201).json({ message: 'Patient personal information created successfully', patientPersonal });
    } catch (error) {
        console.error('Error during patient personal creation:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/patient/staticData/:patient_id', async (req, res) => {
    const { patient_id } = req.params;
  
    try {
      // Fetch data from Patient_Personal model
      const patientStatic = await Patient_Personal.findOne({ patient_id }).select('age height weight');
      if (!patientStatic) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      // Fetch bloodType and allergies from Patient model
      const patientAdditional = await Patient.findOne({ patient_id }).select('bloodType allergies');
      if (!patientAdditional) {
        return res.status(404).json({ error: "Additional patient data not found" });
      }
  
      // Combine data from both models
      const combinedData = {
        ...patientStatic.toObject(),
        bloodType: patientAdditional.bloodType,
        allergies: patientAdditional.allergies,
      };
  
      return res.status(200).json(combinedData);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.put('/patient/:patient_id', async (req, res) => {
    try {
      const { patient_id } = req.params;
      const { section, newEntry } = req.body;
  
      
      // Add timestamps and ID to the new entry
      const entryWithMetadata = {
        ...newEntry,
      };
  
      // Find patient and update the specific section
      const updatedPatient = await Patient.findOneAndUpdate(
        {patient_id:patient_id},
        { 
          $push: { [section]: entryWithMetadata },
          $set: { updated_at: new Date() }
        },
        { 
          new: true,
          runValidators: true
        }
      );
  
      if (!updatedPatient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }
  
      
      res.status(200).json({
        success: true,
        message: 'Entry added successfully',
        data: {
          patient: updatedPatient,
          newEntry: entryWithMetadata
        }
      });
  
    } catch (error) {
      console.error('Error updating patient record:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating patient record',
        error: error.message
      });
    }
  });
  

router.get('/patient/:patient_id', async (req, res) => {
    try {
        const { patient_id } = req.params;

        // Find the patient in the Patient model using patient_id
        const patient = await Patient.findOne({ patient_id });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Return the patient data
        res.status(200).json({
            message: 'Patient found successfully',
            patient: {
                patient_id: patient.patient_id,
                bloodType: patient.bloodType,
                allergies: patient.allergies,
                chronicConditions: patient.chronicConditions,
                familyMedicalHistory: patient.familyMedicalHistory,
                immunizationRecords: patient.immunizationRecords,
                healthInsuranceDetails: patient.healthInsuranceDetails,
                medicalRecords: patient.medicalRecords,
                surgeries:patient.surgeries
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Update patient
router.put('/patient/update/:id',updatePatientPersonalData);

// Create a new hospital
router.post('/hospital/new',createNewHospital);

// Update hospital
router.put('/hospital/:hospitalId',updateHospital);

module.exports = router;
