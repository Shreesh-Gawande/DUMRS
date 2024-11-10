const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authority = require("../models/Authority_Personal");
const Hospital = require("../models/Hospital");
const Patient = require("../models/Patient_Personal");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

// Test Route
router.get("/test", (req, res) => {
    res.send("Test route is working");
});

// Authority Signup
router.post("/signup", async (req, res) => {
    const { authority_id, authority_password } = req.body;
    try {
        const existingAuthority = await Authority.findOne({ authority_id });
        if (existingAuthority) {
            return res.status(400).json({ message: "Authority already exists" });
        }

        const hashedPassword = await bcrypt.hash(authority_password, 10);
        const newAuthority = new Authority({
            authority_id,
            authority_password: hashedPassword,
        });

        await newAuthority.save();

        const token = jwt.sign({ userId: newAuthority._id, userType: "authority" }, SECRET_KEY, { expiresIn: "1h" });

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.status(201).json({ message: "Signup successful", userType: "authority", userId: newAuthority._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Authority Login
router.post("/authority", async (req, res) => {
    const { authority_id, authority_password } = req.body;
    try {
        const authority = await Authority.findOne({ authority_id });
        if (!authority) return res.status(404).json({ message: "Authority not found" });

        const isPasswordValid = await bcrypt.compare(authority_password, authority.authority_password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: authority._id, userType: "authority" }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "authority", userId: authority._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Hospital Login
router.post("/hospital", async (req, res) => {
    const { hospital_id, hospital_password } = req.body;
    try {
        const hospital = await Hospital.findOne({ hospital_id });
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
           console.log(hospital_password)
           console.log( hospital.hospital_password)
        const isPasswordValid = await bcrypt.compare(hospital_password,hospital.hospital_password);
        console.log(isPasswordValid)
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: hospital._id, userType: "hospital" }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "hospital", userId: hospital._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Patient Login
router.post("/patient", async (req, res) => {
    const { patient_id, patientPassword } = req.body;
    try {
        const patient = await Patient.findOne({ patient_id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const isPasswordValid = await bcrypt.compare(patientPassword, patient.patientPassword);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: patient._id, userType: "patient" }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "patient", userId: patient._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
