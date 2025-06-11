import express from 'express'
import { 
    doctorList, 
    loginDoctor, 
    getDoctorProfile, 
    updateDoctorProfile, 
    changeAvailablity,
    getDoctorAppointments,
    cancelDoctorAppointment,
    deleteDoctorAppointment,
    completeAppointment
} from '../controllers/doctorController.js'
import { verifyDoctor } from '../middlewares/authDoctor.js'
import upload from '../middleware/multer.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/profile', verifyDoctor, getDoctorProfile)
doctorRouter.put('/update-profile', verifyDoctor, upload.single('image'), updateDoctorProfile)
doctorRouter.put('/toggle-availability', verifyDoctor, changeAvailablity)

// Appointment routes
doctorRouter.get('/appointments', verifyDoctor, getDoctorAppointments)
doctorRouter.put('/cancel-appointment', verifyDoctor, cancelDoctorAppointment)
doctorRouter.delete('/delete-appointment/:id', verifyDoctor, deleteDoctorAppointment)
doctorRouter.put('/complete-appointment', verifyDoctor, completeAppointment)

export default doctorRouter