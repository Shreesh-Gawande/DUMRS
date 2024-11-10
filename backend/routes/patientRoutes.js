// routes for fetching patient data...

const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const Record = require("../models/Records");
const { retrieveFileUrl } = require("../controllers/S3Storage");

// Get Patient Personal Data
router.get('/:id/personalData', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('fullName dateOfBirth age gender phoneNumber email address');
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Patient Static Medical Data (Blood Type, Allergies, Chronic Conditions)
router.get('/:id/medicalData', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('bloodType allergies chronicConditions familyMedicalHistory immunizationRecords healthInsuranceDetails');
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Patient Medical Records (with pagination)
router.get('/:id/records', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;                   // default limit=10, change it if required
  try {
    const records = await Record.find({ patientId: req.params.id })
      .sort({ visitDate: -1 }) // sort by recent visits
      .limit(limit * 1) // convert limit to a number
      .skip((page - 1) * limit) // skip the records of previous pages
      .exec();

    const count = await Record.countDocuments({ patientId: req.params.id });

    if (!records || records.length === 0) {
      return res.status(404).json({ error: "No records found" });
    }
    res.status(200).json({
      records,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get specific record of a patient
router.get('/:id/:key', async (req,res) => {
  const patientId = req.params.id;
  const key = req.params.key;
  const url = await retrieveFileUrl(patientId, key);

  res.status(200).json({url});
})

// Get Specific Visit Record Details by Visit ID (not used)
router.get('/:id/records/:visitId', async (req, res) => {
  try {
    const record = await Record.findOne({ patientId: req.params.id, _id: req.params.visitId });
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Diagnostic Reports of a Specific Patient
router.get('/:id/records/reports', async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.params.id })
      .select('visitDate diagnosticInformation.testResults diagnosticInformation.radiologyReports diagnosticInformation.pathologyReports diagnosticInformation.geneticTestResults')
      .sort({ visitDate: -1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ error: "No diagnostic reports found" });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Get Most Recent Record (e.g., for showing the latest visit summary)
router.get('/:id/records/recent', async (req, res) => {
  try {
    const record = await Record.findOne({ patientId: req.params.id })
      .sort({ visitDate: -1 }) // sort by latest date
      .limit(1);                                                     // fethcing only most recent record, change limit value to show more.
      
    if (!record) {
      return res.status(404).json({ error: "No recent records found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add or update allergies
router.patch("/:id/allergies", async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      patient.allergies.push(req.body);
      await patient.save();
      res.json(patient.allergies);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add or update chronic conditions
router.patch("/:id/chronic-conditions", async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      patient.chronicConditions.push(req.body);
      await patient.save();
      res.json(patient.chronicConditions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add or update family medical history
router.patch("/:id/family-history", async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      patient.familyMedicalHistory.push(req.body);
      await patient.save();
      res.json(patient.familyMedicalHistory);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add or update immunization records
router.patch("/:id/immunizations", async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      patient.immunizationRecords.push(req.body);
      await patient.save();
      res.json(patient.immunizationRecords);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


//router.post('/:id/records')

module.exports = router;
