const express=require("express");
const {isadmin} =require("../middlewares/isadmin.js");
const { loggedin } = require("../middlewares/loggedin");
const userModel = require("../models/user-model");

const router=express.Router();







router.get('/allusers', loggedin,isadmin, async (req, res) => {
   try {
    const users = await userModel.find().select("-password");
;

    
  res.status(200).json({
  success: true,
  message: "users displayed successfully",
  data: users
  
});
   }

   catch(err){
    res.send(err.message)
   }

})


router.delete('/delusers/:userid', loggedin,isadmin, async (req, res) => {
   try {
    const userid=req.params.userid;
    const users = await userModel.findByIdAndDelete(userid);

    if (!users){
        res.send("something went wrong")
    }

;

    
  res.status(200).json({
  success: true,
  message: "users deleted successfully",
  data: users
  
});
   }

   catch(err){
    res.send(err.message)
   }

})
router.get('/:userid/tasks', loggedin, isadmin, async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await userModel.findById(userid).populate('tasks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User tasks fetched successfully",
      data: user.tasks
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});




module.exports = router;