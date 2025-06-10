import express from 'express'
import { doctorList, loginDoctor, getDoctorProfile } from '../controllers/doctorController.js'
import { verifyDoctor } from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/profile', verifyDoctor, getDoctorProfile)

export default doctorRouter