

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorityPersonalSchema = new Schema(
  {
    authority_id :{
        type:String,
        required:true,
        unique:true,
       },
       authority_password:{
        type:String,
        required:true,
       }
  },
  { timestamps: true }
);

const Authority_Personal = mongoose.model("Authority_Personal", AuthorityPersonalSchema);

module.exports = Authority_Personal;
