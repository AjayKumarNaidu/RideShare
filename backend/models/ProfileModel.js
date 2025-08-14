import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      require:true
    },
    email:{
      type:String,
      require:true
    },
    takeride:{
      type:Array,
      default:[]
    },
    offerride:{
      type:Array,
      default:[]
    },
    ratings:{
      type:Array,
      default:[]
    },
    reviews:{
      type:Array,
      default:[]
    }
  },
  {
    timestamps:true
  }
)

export const profile = mongoose.model('profile',ProfileSchema) 