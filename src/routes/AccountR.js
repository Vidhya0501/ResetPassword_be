import express from 'express'
import AccountController from '../controller/AccountC.js'

const router = express.Router()

router.post('/register',AccountController.register)
router.post('/login',AccountController.login)
router.post('/forgot-password',AccountController.forgotPassword)
router.post('/reset-password/:id/:token',AccountController.resetPassword)

export default router