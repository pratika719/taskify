const express=require("express");

const router=express.Router();








router.get('/', (req, res) => {
  res.send('GET handler for users route.');
})



module.exports = router;