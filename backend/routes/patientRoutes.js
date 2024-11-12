// routes for fetching patient data...

const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const Patient_Personal=require("../models/Patient_Personal")
const Record = require("../models/Records");
const { retrieveFileUrl, uploadFileToS3 } = require("../controllers/S3Storage");

const multer = require('multer');

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Get Patient Personal Data
router.get('/:id/personalData', async (req, res) => {
  try {
    console.log(req.params.id);
    
    const patient = await Patient_Personal.find({patient_id:req.params.id}).select('fullName dateOfBirth age gender phoneNumber email address');
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    console.log(patient)
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
    const records = await Record.find({ patient_id: req.params.id })
      .sort({ visitDate: -1 }) // sort by recent visits
      .limit(limit * 1) // convert limit to a number
      .skip((page - 1) * limit) // skip the records of previous pages
      .exec();

    const count = await Record.countDocuments({ patient_id: req.params.id });
    console.log(records);
    
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
router.get('/file/:id/:key', async (req, res) => {

  const patientId = req.params.id;
  const key = req.params.key;
  const url = await retrieveFileUrl(patientId, key);

  res.status(200).json({ url });
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
router.get('/records/recent/:id', async (req, res) => {
  try {
    const records = await Record.find({ patient_id: req.params.id })
      .sort({ visitDate: -1 }) // sort by latest date
      .limit(5); // fetch only the 5 most recent records

    if (!records || records.length === 0) {
      return res.status(404).json({ error: "No recent records found" });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/records/bloodPressure/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Find all records for the given patient ID
    const records = await Record.find({ patient_id: patientId }).sort({ visitDate: 1 });
    
    // Extract the blood pressure values and their corresponding timestamps
    const bloodPressureData = records.map(record => ({
      x: record.visitDate, // Send the full date
      y: parseFloat(record.vitalSigns.bloodPressure),
    }));
    
    res.json(bloodPressureData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching blood pressure data' });
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


router.post('/:id/add-record', upload.fields([
  { name: 'bloodTests', maxCount: 3 },
  { name: 'urineTests', maxCount: 3 },
  { name: 'otherTests', maxCount: 3 },
]), async (req, res) => {
  const { patientId, visitType, visitDate, chiefComplaint, vitalSigns, dischargeSummary, procedures } = req.body;

  // Get uploaded files
  const bloodTestFiles = req.files['bloodTests'] || [];
  const urineTestFiles = req.files['urineTests'] || [];
  const otherTestFiles = req.files['otherTests'] || [];

  // Check for required fields
  if (!patientId || !visitType || !visitDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Helper function to process file upload
  const processFileUpload = async (file, testType) => {
    const key = `${Date.now()}-${file.originalname}`;
    const reportKey = `${req.body.patientId}/${key}`;

    await uploadFileToS3(reportKey, file);
    return {
      testName: testType,
      reportFileKey: key,
    };
  };

  try {
    // Process and upload files to S3
    const diagnosticTests = [];
    const fileUploadPromises = [
      ...bloodTestFiles.map(file => processFileUpload(file, 'Blood')),
      ...urineTestFiles.map(file => processFileUpload(file, 'Urine')),
      ...otherTestFiles.map(file => processFileUpload(file, 'Other')),
    ];

    const uploadedFiles = await Promise.all(fileUploadPromises);
    diagnosticTests.push(...uploadedFiles);

    const parsedVitalSigns = JSON.parse(vitalSigns);
    const parsedDischargeSummary = dischargeSummary ? JSON.parse(dischargeSummary) : null;
    const parsedProcedures = procedures ? JSON.parse(procedures) : null;


    // Create and save the new record
    const newRecord = new Record({
      patient_id: patientId,
      visitDate: new Date(visitDate),
      visitType,
      chiefComplaint,
       vitalSigns: parsedVitalSigns,
      diagnosticInformation: { testResults: diagnosticTests },
      dischargeSummary: parsedDischargeSummary ? {
        admissionDate: new Date(parsedDischargeSummary.admissionDate),
        dischargeDate: new Date(parsedDischargeSummary.dischargeDate),
        inpatientSummary: parsedDischargeSummary.inpatientSummary,
      } : null,
      proceduralDetails: parsedProcedures ? {
        surgeryType: parsedProcedures.surgeryType,
        surgeryDate: new Date(parsedProcedures.surgeryDate),
        procedureSummary: parsedProcedures.procedureSummary,
        postOpInstructions: parsedProcedures.postOpInstructions,
      } : null,
    });

    const savedRecord = await newRecord.save();

    // Update the Patient document with the new record ID
    await Patient.findOneAndUpdate(
      { patient_id: patientId },
      { $push: { medicalRecords: savedRecord._id } }
    );

    res.status(201).json(savedRecord);

  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create medical record'
    });
  }
});




module.exports = router;
