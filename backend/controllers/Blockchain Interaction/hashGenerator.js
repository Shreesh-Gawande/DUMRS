const crypto = require("crypto");
const Patient = require("../../models/Patient");

async function generatePatientHash(patientId) {
  try {
    // Retrieve Patient and Patient_Personal data
    const patientData = await Patient.findOne({ patient_id: patientId })
        .select("bloodType allergies chronicConditions immunizationRecords");
    console.log(patientData);
  
    if (!patientData ) {
      throw new Error("Patient data not found for hashing.");
    }


    // Create a hash from the combined fields
    const hash = crypto.createHash("sha256").update(JSON.stringify(patientData)).digest("hex");

    return hash;

  } catch (error) {
    console.error("Error generating patient hash:", error);
    throw error;
  }
}

module.exports = generatePatientHash;
