import express from 'express'
import AccountController from '../controller/AccountC.js'

const router = express.Router()

router.post('/register',AccountController.register)

export default router