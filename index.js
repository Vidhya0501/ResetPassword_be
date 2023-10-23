import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import AppRoutes from './src/routes/index.js'


dotenv.config()
const PORT=process.env.PORT
const app=express()
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST"],
    credentials: true
}
    
))
app.use(express.json())
app.use(cookieParser)

app.use('/account',AppRoutes)



app.listen(PORT,()=>{console.log(`Server listening to port ${PORT}`)})