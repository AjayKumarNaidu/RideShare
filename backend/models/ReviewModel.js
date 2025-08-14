import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      require:true
    },
    review:{
      type:String,
      require:true
    }
  }
)

export const review = mongoose.model('review',ReviewSchema) 