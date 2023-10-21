import express from 'express'
import AccountRoutes from './AccountR.js'

const router = express.Router()

router.use('/account',AccountRoutes)


export default router