import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

const changeAvailablity=async(req,res)=>{
    try{
        // Get doctor ID from request body (for admin) or from auth middleware (for doctor)
        const docId = req.body.docId || req.doctorId;

        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.json({success: false, message: 'Doctor not found'});
        }

        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available});
        res.json({success:true, message:'Availability updated successfully'});
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const doctorList=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for doctor login
const loginDoctor=async(req,res)=>{
    try{
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:'invalid credentials'})
        }
        const isMatch=await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            res.json({success:true,token})
        }else{
          res.json({success:false,message:'invalid credentials'})  
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Get doctor profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.doctorId).select('-password');
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, doctor });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const {
            name,
            speciality,
            degree,
            experience,
            fees,
            about,
            address
        } = req.body;

        // Validate required fields
        if (!name || !speciality || !degree || !experience || !fees || !about || !address) {
            return res.json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Create update object
        const updateData = {
            name,
            speciality,
            degree,
            experience,
            fees,
            about,
            address: JSON.parse(address)
        };

        // Handle image upload if provided
        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "image",
                });
                updateData.image = imageUpload.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.json({
                    success: false,
                    message: "Error uploading image"
                });
            }
        }

        // Update doctor profile
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            req.doctorId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedDoctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const docId = req.doctorId;
        const appointments = await appointmentModel.find({ docId })
            .sort({ date: -1 })
            .lean();

        // Fetch user details for each appointment
        const appointmentsWithUserDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const user = await userModel.findById(appointment.userId)
                    .select('name dob image email phone')
                    .lean();

                // Calculate age
                let age = null;
                if (user?.dob) {
                    const birthDate = new Date(user.dob);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }

                return {
                    _id: appointment._id,
                    patientName: user?.name || 'Unknown',
                    age: age || 'N/A',
                    date: appointment.slotDate,
                    time: appointment.slotTime,
                    fees: appointment.amount,
                    paymentMode: appointment.payment ? 'Online' : 'Cash',
                    status: appointment.cancelled ? 'cancelled' : appointment.isCompleted ? 'completed' : 'pending',
                    userData: {
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                        image: user?.image,
                        age: age
                    }
                };
            })
        );

        res.json({ success: true, appointments: appointmentsWithUserDetails });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const cancelDoctorAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.doctorId;

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            docId
        });

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        appointment.cancelled = true;
        await appointment.save();

        // Remove the booked slot from doctor's schedule
        const doctor = await doctorModel.findById(docId);
        if (doctor && doctor.slots_booked && doctor.slots_booked[appointment.slotDate]) {
            doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[appointment.slotDate]
                .filter(time => time !== appointment.slotTime);
            
            if (doctor.slots_booked[appointment.slotDate].length === 0) {
                delete doctor.slots_booked[appointment.slotDate];
            }
            
            doctor.markModified('slots_booked');
            await doctor.save();
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteDoctorAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const docId = req.doctorId;

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            docId,
            $or: [{ cancelled: true }, { isCompleted: true }]
        });

        if (!appointment) {
            return res.json({ 
                success: false, 
                message: 'Appointment not found or cannot be deleted (must be cancelled or completed)' 
            });
        }

        await appointmentModel.deleteOne({ _id: appointmentId });
        res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const completeAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.doctorId;

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            docId,
            cancelled: false,
            isCompleted: false
        });

        if (!appointment) {
            return res.json({ 
                success: false, 
                message: 'Appointment not found or cannot be completed' 
            });
        }

        appointment.isCompleted = true;
        await appointment.save();

        res.json({ success: true, message: 'Appointment completed successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const getDoctorDashboardStats = async (req, res) => {
    try {
        const docId = req.doctorId;

        // Get total appointments for this doctor
        const totalAppointments = await appointmentModel.countDocuments({ docId });

        // Get completed appointments count
        const completedAppointments = await appointmentModel.countDocuments({ 
            docId, 
            isCompleted: true 
        });

        // Get cancelled appointments count
        const cancelledAppointments = await appointmentModel.countDocuments({ 
            docId, 
            cancelled: true 
        });

        // Get pending appointments count
        const pendingAppointments = await appointmentModel.countDocuments({ 
            docId, 
            isCompleted: false, 
            cancelled: false 
        });

        // Get today's appointments
        const today = new Date();
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
        const todayAppointments = await appointmentModel.find({ 
            docId,
            slotDate: todayStr,
            cancelled: false,
            isCompleted: false
        }).sort({ slotTime: 1 }).lean();

        // Get recent appointments
        const recentAppointments = await appointmentModel
            .find({ docId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Fetch user details for appointments
        const appointmentsWithUserDetails = await Promise.all(
            [...todayAppointments, ...recentAppointments].map(async (appointment) => {
                const user = await userModel.findById(appointment.userId)
                    .select('name dob image email phone')
                    .lean();

                // Calculate age
                let age = null;
                if (user?.dob) {
                    const birthDate = new Date(user.dob);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }

                return {
                    _id: appointment._id,
                    patientName: user?.name || 'Unknown',
                    age: age || 'N/A',
                    date: appointment.slotDate,
                    time: appointment.slotTime,
                    fees: appointment.amount,
                    paymentMode: appointment.payment ? 'Online' : 'Cash',
                    status: appointment.cancelled ? 'cancelled' : appointment.isCompleted ? 'completed' : 'pending',
                    userData: {
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                        image: user?.image,
                        age: age
                    }
                };
            })
        );

        const stats = {
            totalAppointments,
            completedAppointments,
            cancelledAppointments,
            pendingAppointments,
            todayAppointments: appointmentsWithUserDetails.slice(0, todayAppointments.length),
            recentAppointments: appointmentsWithUserDetails.slice(todayAppointments.length)
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error in getDoctorDashboardStats:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    changeAvailablity,
    doctorList,
    loginDoctor,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    cancelDoctorAppointment,
    deleteDoctorAppointment,
    completeAppointment,
    getDoctorDashboardStats
}