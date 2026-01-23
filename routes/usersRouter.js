const express=require("express");
const router=express.Router();

const  {registerUser,loginuser,logout}=require("../controllers/authcontrollers")





router.get('/', (req, res) => {
  res.send('GET handler for index jj route.');
})


router.post('/register', registerUser)//add cookie check logic if cookie remove in login register page

router.get('/register', (req, res) => {
  
  res.send("register");



})
router.post('/login',loginuser)
router.get('/logout',logout )





module.exports = router;