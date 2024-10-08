// For authorized personnels only. Perform creation of new patients, register hospitals, etc..

const router = require("express").Router();

router.post('/patient/new')         // create new patient 

router.put('/patient/update/:id')       // update patient

router.post('/hospital/new')        // register new hospital

router.put('/hospital/:hospitalId') // edit hospital



module.exports = router;