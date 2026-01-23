
const jwt = require('jsonwebtoken');
const bcrypt=require("bcrypt");
const userModel=require("../models/user-model.js");



module.exports.loggedin=  async (req,res,next)=>{
    
    if(!req.cookies.token) { req.flash("error","you need to login");
        return res.redirect('/user/register');}

        try{

        let decode=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        req.user=decode;
        next();


        }
        catch(err){ 
            req.flash("error","something wwent wrong");
            res.redirect("/user/register");
}
}