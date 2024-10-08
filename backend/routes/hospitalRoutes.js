
// routes for fetching patient data and updating patent data...

const router = require("express").Router();

router.get('/patients')

router.get('/:id/personalData')

router.get('/:id/medicalData')
router.put('/:id/medicalData')
router.post('/:id/medicalData')

router.get('/:id/records')
router.put('/:id/records')
router.post('/:id/records')

router.get('/:id/records/:visitId')
router.put('/:id/records/:visitId')
router.post('/:id/records/:visitId')

router.get('/:id/records/reports')
router.put('/:id/records/reports')
router.post('/:id/records/reports')



module.exports = router;
