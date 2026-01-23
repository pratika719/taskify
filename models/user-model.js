const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userModel = new Schema({
   name:String,
    email:String,
    password:String,
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task"
    }]
});
//rtrtrtrrttrtrtrtrttrt

module.exports=mongoose.model("user",userModel);
