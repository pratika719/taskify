const jwt = require('jsonwebtoken');
const bcrypt=require("bcrypt");
const userModel=require("../models/user-model.js");
const  {generateToken}=require("../utils/generatetoken.js")




module.exports.registerUser= async (req, res) => {
    

    try{
    
       let {name,email,password}=req.body;
       let user = await userModel.findOne({email:email});
       if(user){
            console.log(user);
        return res.status(404).send("user already exist pls login");


       }

    



  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        // Store hash in your password DB.
       
           let user = await userModel.create({name,email,password:hash})

          let token=generateToken(user)
           res.cookie("token",token);
             res.send(user);
       
        



       


    });
});

    }catch(err){
        res.send(err.message);
    }

 





}

module.exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // true in production (HTTPS)
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "Login successful",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports.logout=async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect("/"); 

  
}
