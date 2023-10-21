import express from 'express'//ES Module Import add "type": "module" in package.json
import dotenv from 'dotenv'
import cors from 'cors'

import AppRoutes from './src/routes/index.js'


dotenv.config()
const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use(cors())

app.use('/',AppRoutes)



app.listen(PORT,()=>{console.log(`Server listening to port ${PORT}`)})