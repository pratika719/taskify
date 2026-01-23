
const jwt = require('jsonwebtoken');
const bcrypt=require("bcrypt");
const userModel=require("../models/user-model.js");
const AdminModel=require("../models/admin-model.js");




module.exports.isadmin=  async (req,res,next)=>{
    
    if(!req.cookies.token) { req.flash("error","you need to login");
        return res.redirect('/user/register');}

        try{

            let admin= await AdminModel.findOne({email:req.user.email})

            if(!admin){
                return res.status(403).json({ message: "Forbidden" });
            }
             next();


        }
        catch(err){ 
            req.flash("error","something went wrong");
            res.redirect("/user/register");
}
}