const express = require('express');
const User = require('../models/User');
const { body , validationResult } = require('express-validator');
const router = express.Router();
//First install bcryptjs in powershell (npm i bcryptjs), then import bcrypt also as given below
const bcrypt= require('bcryptjs');
//First install jsonwebtoken in powershell (npm i jsonwebtoken), then import jsonwebtoken also as given below
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET='Hussainisadeveloper';//to return token value
//Route 1: Create a user using: POST "/api/auth/ceateuser". noo login required
router.post('/createuser',[
    body('name',('Name must be required')).isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:6})

], async (req, res)=>{
  let success=false;
    //If there are errors, bad request is return with errors messages by below use function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });//copy from express validator version 6.12.0
    }  
    try{
    //Check whether the user with this email exist already 
    let user = await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).json({success, error: "Sorry this email is already exists"})
    }
     const salt= await bcrypt.genSalt(10);
     const securePass = await bcrypt.hash(req.body.password, salt);
     user=await User.create({
      name: req.body.name,
      email: req.body.email,//copy from express validator version 6.12.0
      password: securePass,
    });

    // .then(user => res.json(user))
    // .catch(err => {console.log(err);res.json({error: 'Please enter unique value for email'})})
    // // res.send(req.body);
    const data= {
      id: user.id
    }
    const autoTokenData = jwt.sign(data, JWT_SECRET);
    // console.log(jwtData);
    success=true;
    res.json({success, autoTokenData});
  } catch(error){
    console.error(error.message);
    res.status(500).send("Some bad request occured");
  }
    
})


//Route 2: Authenticate a user using: POST "/api/auth/login". noo login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password should be blanked').exists(),

], async (req, res)=>{
  let success= false;
   //If there are errors, bad request is return with errors messages by below use function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });//copy from express validator version 6.12.0
    } 

    const {email, password}=req.body;
    try {
      let user=await User.findOne({email});
      if(!user){
        success=false;
        return res.status(400).json({error: 'Please try to login with correct credentials'})
      }
       const comparePass=await bcrypt.compare(password,user.password);
       if(!comparePass){
        success=false;
        return res.status(400).json({error: 'Please try to login with correct credentials'})
      }
      const data= {
      id: user.id
    }
    const autoTokenData = jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({success, autoTokenData})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server occured");
    }

})

//Route 3: Get loggedIn details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser,async (req, res)=>{
try {
  const userId= req.user.id;
  const user= await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server occured");
}
})
module.exports=router;