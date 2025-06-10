import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid Email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new userModel({ name, email, password: hashedPassword }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, dob, gender, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id;

    if (!slotTime) {
      return res.json({ success: false, message: "Please select a time slot." });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available for booking." });
    }

    let slots_booked = docData.slots_booked || {};

    // Ensure slots_booked[slotDate] is an array, initialize if undefined or not an array
    if (!Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = [];
    }

    // Check if the slot is already booked
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot is not available" });
    }

    // Add the new slot
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User data not found." });
    }

    const docInfoForAppointment = { ...docData.toObject() };
    delete docInfoForAppointment.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData: userData.toObject(),
      docData: docInfoForAppointment,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: new Date(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update doctor's slots_booked
    await doctorModel.findByIdAndUpdate(docId, { slots_booked }, { new: true });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.json({ success: false, message: "Failed to book appointment: " + error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found in request" });
    }
    
    // Only fetch appointments that should be shown to the user
    const appointments = await appointmentModel.find({ 
      userId,
      showToUser: true  // Only show appointments that haven't been cancelled by admin
    })
    .sort({ createdAt: -1 }) // Sort by creation time, newest first
    .lean();

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error in listAppointment:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments: " + error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;

    // Find and delete the appointment
    const appointment = await appointmentModel.findOneAndDelete({
      _id: appointmentId,
      userId,
    });
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found or unauthorized" });
    }

    // Update doctor's slots_booked to remove the canceled slot
    const { docId, slotDate, slotTime } = appointment;

    // First, pull the slot from the array
    await doctorModel.updateOne(
      { _id: docId },
      { $pull: { [`slots_booked.${slotDate}`]: slotTime } }
    );

    // Check if the slotDate array is empty or undefined, and unset it if empty
    const doctor = await doctorModel.findById(docId);
    if (doctor.slots_booked && doctor.slots_booked[slotDate]?.length === 0) {
      await doctorModel.updateOne(
        { _id: docId },
        { $unset: { [`slots_booked.${slotDate}`]: "" } }
      );
    }

    res.json({ success: true, message: "Appointment canceled successfully" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.json({ success: false, message: "Failed to cancel appointment: " + error.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };