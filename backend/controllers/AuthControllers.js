const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authority = require("../models/Authority_Personal");
const Hospital = require("../models/Hospital");
const Patient_Personal = require("../models/Patient_Personal");
const SECRET_KEY = process.env.SECRET_KEY||"Shreesh";



const getUser=async(req,res)=>{
    const { userType } = req.user; // Access userType from req.user set by verifyToken middleware
    res.json({ userType });
}




const signinAuthority=async(req,res)=>{
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
            sameSite:"none",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.status(201).json({ message: "Signup successful", userType: "authority", userId: newAuthority._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const loginAuthority =async (req,res)=>{
    const { authority_id, authority_password } = req.body;
    if (!authority_id || !authority_password) {
        return res.status(400).json({ message: "Id and password are required" });
    }
    try {
        const authority = await Authority.findOne({ authority_id });
        if (!authority) return res.status(404).json({ message: "Authority not found" });

        const isPasswordValid = await bcrypt.compare(authority_password, authority.authority_password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: authority._id, userType: "authority" }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite:"none",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "authority", userId: authority._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const loginHospital=async (req,res)=>{
    const { hospital_id, hospital_password } = req.body;
    if (!hospital_id || !hospital_password) {
        return res.status(400).json({ message: "Id and password are required" });
    }
    
    try {
        const hospital = await Hospital.findOne({ hospital_id });
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
        const isPasswordValid = await bcrypt.compare(hospital_password,hospital.hospital_password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: hospital._id, userType: "doctor" }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"none",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "doctor", userId: hospital._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false  // Keep this consistent with your login settings
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const loginPatient= async(req,res)=>{
    const { patient_id, patientPassword } = req.body;
    if (!patient_id || !patientPassword) {
        return res.status(400).json({ message: "Id and password are required" });
    }
    try {
        // Find the patient in the Patient_Personal model
        const patient = await Patient_Personal.findOne({ patient_id });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Compare the plain-text password with the hashed password
        const isPasswordValid = await bcrypt.compare(patientPassword, patient.patient_password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: patient._id, userType: "patient" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        return res.json({ message: "Login successful", userType: "patient", userId: patient._id });
    } catch (error) {
        console.error("Error during patient login:", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { loginAuthority,
    loginHospital,
    loginPatient,
    signinAuthority,getUser,logout };