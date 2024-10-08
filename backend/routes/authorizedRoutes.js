// For authorized personnels only. Perform creation of new patients, register hospitals, etc..

const router = require("express").Router();

router.get('/patients')
router.post('/patients')
router.put('/:id/personalData')

router.post('/hospitals')
router.put('/hospitals/:hospitalId')
router.get('/hospitals')



module.exports = router;