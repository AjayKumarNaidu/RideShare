import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import AuthRoutes from './routes/AuthRoutes.js'
import RideRoutes from './routes/RideRoutes.js'
import ProfileRoutes from './routes/ProfileRoutes.js'
import ReviewRoutes from './routes/ReviewRoutes.js'

const PORT = 5000

const app = express()
app.use(cors({
  origin: ["https://rideshare-frontend-w7e2.onrender.com"], 
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true
}));
app.use(express.json())

mongoose.connect('mongodb+srv://ajaykumar:ajaykumar@cluster0.ts2bmae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('mongoDb connected'))
.catch((error)=>console.log(error))

app.use('/api/auth',AuthRoutes)
app.use('/api/ride',RideRoutes)
app.use('/api/profile',ProfileRoutes)
app.use('/api/review',ReviewRoutes)

app.listen(PORT,()=>{
  console.log(`app is running server ${PORT}`)
})