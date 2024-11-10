const router = require("express").Router();
const authMiddleware= require("../middlewares/auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const crypto = require('crypto');
const Patient_Personal = require("../models/Patient_Personal");

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
router.post('/patient/new', async (req, res) => {
    try {
        const {
            fullName,
            patient_id,
            dateOfBirth,
            age,
            weight,
            height,
            gender,
            phoneNumber,
            email,
            emergency_phone,
            address,
            bloodType,
            allergies,
            chronicConditions,
            familyMedicalHistory,
            immunizationRecords,
            healthInsuranceDetails
        } = req.body;
        console.log("Request Body:", req.body);
        if (!phoneNumber || phoneNumber === null) {
            return res.status(400).json({ message: "Phone number is required and cannot be null" });
        }
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

        // Check if the patient already exists
        const existingPatient = await Patient.findOne({ patient_id: patientId });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient ID already exists' });
        }

        // Parse dateOfBirth to a valid date format
        const parsedDateOfBirth = new Date(dateOfBirth);

        // Create a new patient document in the Patient model
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

        // Create a new patient document in the Patient_Personal model
        const patientPersonal = new Patient_Personal({
            fullName,
            patient_id: patientId,
            patient_password: hashedPassword,
            dateOfBirth: parsedDateOfBirth,
            age,
            weight,
            height,
            gender,
            phoneNumber,
            email,
            emergency_phone,
            address
        });

        // Save the patient personal information to the database
        await patientPersonal.save();

        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (error) {
        console.error('Error during patient creation:', error);
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
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Update patient
router.put('/patient/update/:id',authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, dateOfBirth, age, gender, phoneNumber, email, emergency_phone, address } = req.body;
        const updatePatient = await Patient.findOneAndUpdate(
            { patient_id: id },  // Fixed key for finding patient
            { fullName, dateOfBirth, age, gender, phoneNumber, email, emergency_phone, address },
            { new: true, runValidators: true }
        );

        if (!updatePatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({ message: 'Patient updated successfully', patient: updatePatient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Create a new hospital
router.post('/hospital/new', async (req, res) => {
    const { name, address, phoneNumber, email } = req.body;
    const password = generateRandomPassword();
    console.log(password);
    
    const hashedPassword = await bcrypt.hash(password, 10);  
        const hospitalId=generateRandomPatientId();
    try {
        const hospital = new Hospital({
            name,
            hospital_id:hospitalId,
            hospital_password:hashedPassword,
            address,
            phoneNumber,
            email
        });
        await hospital.save();

        res.status(201).json({ message: 'Hospital created successfully', hospital });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Hospital ID or email already exists' });
        }
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Update hospital
router.put('/hospital/:hospitalId',authMiddleware, async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { name, password, address, phoneNumber, email } = req.body;
        const updateHospital = await Hospital.findOneAndUpdate(
            { hospital_id: hospitalId }, 
            { name, password, address, phoneNumber, email },
            { new: true, runValidators: true }
        );

        if (!updateHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        return res.status(200).json({ message: 'Hospital updated successfully', hospital: updateHospital });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
