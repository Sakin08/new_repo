import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary"

const changeAvailablity=async(req,res)=>{
    try{
        const {docId}=req.body

        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true,message:'Availability changed'})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
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

export {changeAvailablity,doctorList,loginDoctor, getDoctorProfile, updateDoctorProfile}