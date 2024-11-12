const express = require("express");
const router = express.Router();
const { getRecordHash, storeRecordHash } = require('../controllers/Blockchain Interaction/BlockchainStorage');


router.get('/blockchain', async (req, res) => {
   
    const patientId = "patient123";
    const medicalData = "Sample medical data";

    // Store the hash of the medical data
    await storeRecordHash(patientId, medicalData);

    // Retrieve the hash for the patient ID
    const hash = await getRecordHash(patientId);
    console.log("Created hash: ",hash);
    
    res.json({success: true, hash});
})

module.exports = router;