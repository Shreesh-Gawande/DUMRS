

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HospitalPersonalSchema = new Schema(
  {
    hospital_id:{
        type:String,
        required:true,
        unique:true,
     },
     hospital_password:{
         type:String,
         required:true,
        },
  },
  { timestamps: true }
);

const Hospital_Personal = mongoose.model("Hospital_Personal", HospitalPersonalSchema);

module.exports = Hospital_Personal;
