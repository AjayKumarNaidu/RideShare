import express from 'express'
import { ride } from '../models/RideModel.js';

const router = express.Router()

router.post('/postride',async (req,res)=>{
  try {
    console.log(req.body)
    const newride = new ride(req.body)
    await newride.save()
    res.json({success:true,message:newride})
  } catch (error) {
    res.json({success:true,message:error.message})
  }
})

router.get('/allrides',async(req,res)=>{
  try {
    const rides = await ride.find({})
    res.json({success:true,message:rides})
  } catch (error) {
    res.json({success:true,message:error.message})
  }
})

router.get('/oneride/:id',async(req,res)=>{
  try {
    const {id} = req.params
    const newride = await ride.findById(id)
    res.json({success:true,message:newride})
  } catch (error) {
    res.json({success:true,message:error.message})
  }
})

router.patch('/updateride/:id',async(req,res)=>{
  try {
    const {id} = req.params
    const {availableSeats,email,bookedSeats} = req.body
    const updatedride = await ride.findByIdAndUpdate(id,{availableSeats,bookedSeats,'$push':{customers:email}},{new:true})
    res.json({success:true,message:updatedride})
  } catch (error) {
    res.json({success:true,message:error.message})
  }
})


export default router;