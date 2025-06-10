import express from 'express'
import { doctorList, loginDoctor, getDoctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import { verifyDoctor } from '../middlewares/authDoctor.js'
import upload from '../middleware/multer.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/profile', verifyDoctor, getDoctorProfile)
doctorRouter.put('/update-profile', verifyDoctor, upload.single('image'), updateDoctorProfile)

export default doctorRouter