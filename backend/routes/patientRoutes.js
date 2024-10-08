// routes for fetching patient data...

const router = require("express").Router();


router.get('/:id/personalData')

router.get('/:id/medicalData')

router.get('/:id/records')

router.get('/:id/records/:visitId')

router.get('/:id/records/reports')

//router.get('/:id/records/recent')

module.exports = router;