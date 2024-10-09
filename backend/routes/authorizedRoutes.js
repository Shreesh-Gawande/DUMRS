const router = require("express").Router();
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");

// Create a new patient
router.post('/patient/new', async (req, res) => {
    try {
        const { fullName, patient_id, dateOfBirth, age, gender, phoneNumber, email, emergency_phone, address } = req.body;
        const patient = new Patient({
            fullName,
            patient_id,
            dateOfBirth,
            age,
            gender,
            phoneNumber,
            email,
            emergency_phone,
            address
        });
        await patient.save();
        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Patient ID or email already exists' });
        }
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Update patient
router.put('/patient/update/:id', async (req, res) => {
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
router.put('/hospital/:hospitalId', async (req, res) => {
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
