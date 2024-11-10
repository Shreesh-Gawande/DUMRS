const mongoose=require("mongoose");

const authoritySchema=new mongoose.Schema({
   authority_id :{
    type:String,
    required:true,
    unique:true,
   },
   email:{
    type:String,
    required:true,
    unique:true,
   },
   authority_password:{
    type:String,
    required:true,
   }
})

const Authority = mongoose.model('Authority', hospitalSchema);

module.exports = Authority;