import {Signup,Login} from '../controllers/AuthController.js'
import express from 'express'
import { userVerification } from '../middlewares/AuthMiddleware.js'

const router = express.Router()

router.post('/create-account',Signup)
router.post('/login',Login)
router.post('/',userVerification)

export default router