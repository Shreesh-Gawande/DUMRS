
// routes for fetching patient data and updating patent data...
const Hospital=require('../models/Hospital')
const router = require("express").Router();


router.get('/:id/details',async(req,res)=>{
    try {
        const hospital= await Hospital.findById(req.params.id).select('name address phoneNumber email');
        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found not found" });
          }
          res.status(200).json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;
