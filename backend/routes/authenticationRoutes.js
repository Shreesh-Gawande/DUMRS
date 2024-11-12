const express = require("express");
const {loginAuthority, loginHospital, loginPatient, signinAuthority}=require("../controllers/AuthControllers")
const router = express.Router();

// Authority Signup
router.post("/signup", signinAuthority);

// Authority Login
router.post("/authority", loginAuthority);
    
// Hospital Login
router.post("/hospital", loginHospital);

// Patient Login
router.post("/patient", loginPatient);


module.exports = router;
