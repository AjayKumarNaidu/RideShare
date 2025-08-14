import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      require:true
    },
    email:{
      type:String,
      require:true
    },
    password:{
      type:String,
      require:true
    }
  },
  {
    timestamps:true
  }
)

export const user = mongoose.model('user',UserSchema);

