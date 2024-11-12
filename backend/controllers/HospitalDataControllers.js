
const Hospital = require("../models/Hospital");
const crypto = require('crypto');
const authMiddleware= require("../middlewares/auth");
const bcrypt = require("bcrypt");


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

const createNewHospital=async (req,res)=>{
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
}

const updateHospital=async (req,res)=>{
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
}
module.exports={
    createNewHospital,
    updateHospital
};