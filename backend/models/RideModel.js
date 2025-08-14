import mongoose from 'mongoose'

const RideSchema = new mongoose.Schema(
  {
    email:{
      type:String,
      require:true
    },
    source:{
      type:String,
      require:true
    },
    destination:{
      type:String,
      require:true
    },
    date:{
      type:String,
      require:true
    },
    time:{
      type:String,
      require:true
    },
    pricePerSeat:{
      type:Number,
      require:true
    },
    vehicleType:{
      type:String,
      require:true
    },
    availableSeats:{
      type:Number,
      require:true
    },
    bookedSeats:{
      type:Number,
      default:0
    },
    contactNumber:{
      type:String,
      require:true
    },
    customers:{
      type:Array,
      default:[]
    }
  },
  {
    timestamps:true
  }
)

export const ride = mongoose.model('ride',RideSchema);