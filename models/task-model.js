const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const taskModel = new Schema({
  author: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
  title: String,
  desc: String,
  status: Boolean
});


module.exports=mongoose.model("task",taskModel);
