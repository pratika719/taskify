const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const adminModel = new Schema({
   fullname:String,
    email:String,
    password:String,
});


module.exports=mongoose.model("admin",adminModel);
