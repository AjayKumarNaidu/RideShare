import express from 'express'
import { review } from '../models/ReviewModel.js'

const router = express.Router()

router.post('/postreview',async(req,res)=>{
  try {
    const newreview = new review(req.body)
    await newreview.save()
    res.json({success:true,message:newreview})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

router.get('/allreviews',async(req,res)=>{
  try {
    const allreviews = await review.find({})
    res.json({success:true,message:allreviews})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
})

export default router;