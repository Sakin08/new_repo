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
    completeAppointment,
    getDoctorDashboardStats
} from '../controllers/doctorController.js'
import { verifyDoctor } from '../middlewares/authDoctor.js'
import upload from '../middleware/multer.js'

const doctorRouter = express.Router()

// Profile routes
doctorRouter.get('/profile', verifyDoctor, getDoctorProfile)
doctorRouter.put('/update-profile', verifyDoctor, upload.single('image'), updateDoctorProfile)
doctorRouter.put('/change-availability', verifyDoctor, changeAvailablity)

// Auth routes
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/list', doctorList)

// Appointment routes
doctorRouter.get('/appointments', verifyDoctor, getDoctorAppointments)
doctorRouter.get('/dashboard-stats', verifyDoctor, getDoctorDashboardStats)
doctorRouter.put('/cancel-appointment', verifyDoctor, cancelDoctorAppointment)
doctorRouter.put('/complete-appointment', verifyDoctor, completeAppointment)
doctorRouter.delete('/delete-appointment/:id', verifyDoctor, deleteDoctorAppointment)

export default doctorRouter