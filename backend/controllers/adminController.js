import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import { Suspense } from "react";
import appointmentModel from "../models/appointmentModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    //checking for all data to doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Please provide all required fields.",
      });
    }
    //validation email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please  enter a valid email.",
      });
    }
    //validating password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please  enter a strong password.",
      });
    }
    //hassing doctor password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
        const token=jwt.sign(email+password,process.env.JWT_SECRET )
        res.json({success:true,token})

    }else{
        res.json({success:false,message:"Invalid  credentials"})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get all doctors list for admin panel
const allDoctors=async (req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select('-password')
     res.json({success:true,doctors})
  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const appointmentAdmin = async (req, res) => {
    try {
        // First verify if the model exists and is properly imported
        if (!appointmentModel) {
            console.error('Appointment model is not properly imported');
            return res.status(500).json({
                success: false,
                message: "Internal server error: Model not found"
            });
        }

        // Log the model structure
        console.log('Appointment Model:', appointmentModel.schema.paths);

        const appointments = await appointmentModel.find({})
            .sort({ date: -1 })
            .lean()
            .exec();

        console.log('Found appointments:', appointments);

        return res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Full error details:', error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const cancelAppointmentAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment is already cancelled"
            });
        }

        if (appointment.isCompleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel completed appointment"
            });
        }

        // Update the appointment
        appointment.cancelled = true;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.error('Error in cancelAppointmentAdmin:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel appointment"
        });
    }
};

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, cancelAppointmentAdmin };
