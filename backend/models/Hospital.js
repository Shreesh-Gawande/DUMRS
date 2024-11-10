const mongoose = require('mongoose');


const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    hospital_id:{
       type:String,
       required:true,
       unique:true,
    },
    hospital_password:{
        type:String,
        required:true,
       },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
   
  
});


const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
