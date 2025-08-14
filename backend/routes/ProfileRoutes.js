import express from 'express'
import { profile } from '../models/ProfileModel.js';

const router = express.Router();

router.post('/initialprofile',async(req,res)=>{
  try {
    const {name,email} = req.body
    const newprofile = new profile({name:name,email:email})
    await newprofile.save()
    res.json({success:true,message:newprofile})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.get('/allprofiles',async(req,res)=>{
  try {
    const profiles = await profile.find({})
    res.json({success:true,message:profiles})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.get('/oneprofile/:email',async(req,res)=>{
  try {
    const {email} = req.params
    const newprofile = await profile.findOne({email:email})
    res.json({success:true,message:newprofile})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.patch('/updatetakenride/:email',async(req,res)=>{
  try {
    const {email} = req.params
    const {ride} = req.body
    const newprofile = await profile.findOneAndUpdate({email:email},{'$push': {takeride:ride} },{new:true})
    res.json({success:true,message:newprofile})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.patch('/updateofferride/:email',async(req,res)=>{
  try {
    const {email} = req.params
    const {ride} = req.body
    const newprofile = await profile.findOneAndUpdate({email:email},{'$push': {offerride:ride} },{new:true})
    res.json({success:true,message:newprofile})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.patch('/updatereviews/:email',async(req,res)=>{
  try {
    const {email} = req.params
    const {review,rating} = req.body
    const newprofile = await profile.findOneAndUpdate({email:email},{'$push': {reviews:review , ratings:rating}},{new:true})
    res.json({success:true,message:newprofile})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})


export default router;