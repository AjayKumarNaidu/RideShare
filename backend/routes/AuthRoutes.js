import express from 'express'
import { user } from '../models/AuthModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

//user registration
router.post('/register',async (req,res)=>{
  try {
    const {name,email,password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    const newuser = new user({name,email,password:hashedPassword})
    await newuser.save()
    res.json({success:true,message:newuser})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

//user login
router.post('/login',async(req,res)=>{
  try {
    const {email,password} = req.body
    const newuser = await user.findOne({email})
    if(!newuser){
      return res.json({success:false,message:'user not found'})
    }

    const isValid = await bcrypt.compare(password,newuser.password)
    if(!isValid){
      return res.json({success:false,message:'user credentials are false'})
    }

    const token = jwt.sign({email:newuser.email},'ajaykumar') //here 'ajaykumar' is jwt secret key.
    return res.json({success:true,message:token})

  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

export default router
