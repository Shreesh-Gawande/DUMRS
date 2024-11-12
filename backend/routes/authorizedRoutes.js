const router = require("express").Router();
const { createNewPatient, addStaticRecordsToPatients, GetStaticPatientData, GetPAtientStaticMedicalData, updatePatientPersonalData, updataPatientStaticMedicalData } = require("../controllers/PatientDataControllers");
const { createNewHospital, updateHospital } = require("../controllers/HospitalDataControllers");

//Add static data to patients
router.post('/new/:patient_id',addStaticRecordsToPatients);

// Create a new patient
router.post('/patient/new',createNewPatient);

//Get patient Static Data
router.get('/patient/staticData/:patient_id', GetStaticPatientData);

//update patient Static medical data
router.put("/patient/:patient_id",updataPatientStaticMedicalData);

//get patient Static medical data
router.get('/patient/:patient_id',GetPAtientStaticMedicalData);

// Update patient
router.put('/patient/update/:id',updatePatientPersonalData);

// Create a new hospital
router.post('/hospital/new',createNewHospital);

// Update hospital
router.put('/hospital/:hospitalId',updateHospital);

module.exports = router;
