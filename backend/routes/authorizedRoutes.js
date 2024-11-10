const router = require("express").Router();
const authMiddleware= require("../middlewares/auth");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const crypto = require('crypto');
const Patient_Personal = require("../models/Patient_Personal");

function generateRandomPassword() {
    return crypto.randomBytes(8).toString('hex'); // Generates a 16-character password
  }
  function generateRandomPatientId() {
    return crypto.randomBytes(10).toString('hex'); // Generates a 16-character password
  }

// Create a new patient
router.post('/patient/new', async (req, res) => {
    try {
        const { fullName, patient_id, dateOfBirth, age, gender, phoneNumber, email, emergency_phone, address } = req.body;
        const randomPassword = generateRandomPassword();
        const patientId=generateRandomPatientId();
        // Check if the patient already exists
        const existingPatient = await Patient.findOne({ patient_id });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient ID already exists' });
        }

        // Parse dateOfBirth to a valid date format
        const parsedDateOfBirth = new Date(dateOfBirth);

        // Create a new patient
        const patient = new Patient({
           
        });

        // Save the patient to the database
        await patient.save();
        const patientPersonal=new Patient_Personal({
            fullName,
            patient_id:patientId,
            patient_password:randomPassword,
            dateOfBirth: parsedDateOfBirth,
            age,
            gender,
            phoneNumber,
            email,
            emergency_phone,
            address
        });
        await patientPersonal.save();
        res.status(201).json({ message: 'Patient created successfully', patient });
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
router.post('/hospital/new',authMiddleware, async (req, res) => {
    const { name, hospital_id, password, address, phoneNumber, email } = req.body;
    try {
        const hospital = new Hospital({
            name,
            hospital_id,
            password,
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
