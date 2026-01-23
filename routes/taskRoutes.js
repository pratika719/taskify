const express=require("express");
const taskModel=require("../models/task-model.js");
const userModel=require("../models/user-model.js");
const {loggedin}=require("../middlewares/loggedin.js");
const { error } = require("node:console");
const router=express.Router();









router.get('/', loggedin,async (req, res) => {
    try{
    const userId = req.user.userId;

    let tasks= await userModel.findOne({email:req.user.email}).populate('tasks');
 ;// semd task to

  
        if (!tasks) {
            console.log("USER NOT FOUND IN DB");
            return res.redirect("/register");}
         res.json(tasks)}


            catch(err){
                 res.send(err.message);
            }


})

router.post('/create', loggedin, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userId = req.user.userId;

    const task = await taskModel.create({
      title,
      desc,
      status: false,
      author: userId
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { tasks: task._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (err) {
    res.status(500).json({
      error: "Task creation failed",
      details: err.message
    });
  }
});

router.delete('/delete/:id',loggedin, async  (req, res) => {
  try{
  const taskId=req.params.id;
  const user = req.user;

  console.log(user);

  const tasks = await taskModel.findByIdAndDelete(taskId);
 await userModel.findByIdAndUpdate(
      user.userId,
      { $pull: { tasks: taskId } }
    );
    res.send("done h");
   

} catch(err){
    
    res.status(500).json({ error: "Task deletion failed" });
}
})

router.patch('/edit/:id',loggedin, async  (req, res) => {
  try{
    const  taskId  = req.params.id;
    const userId = req.user.userId;
    const { title, desc, status } = req.body;



const updatedTask = await taskModel.findOneAndUpdate(
      { _id: taskId, author: userId },   // ownership check
      { title, desc, status },           // fields to update
      { new: true }                      // return updated doc
    );

    
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    
    res.json(updatedTask);

} catch(err){
    
    res.status(500).json({ error: "Task update failed" });
}
})




module.exports = router;