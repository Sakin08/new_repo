import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Banner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
    window.scrollTo(0, 0)
  };

  return (
    <div className="min-h-[300px] w-full bg-gradient-to-r from-blue-100 via-blue-50 to-white px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 py-12 rounded-lg shadow-lg font-sans">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
        <p className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-snug">
          Book Appointment
        </p>
        <p className="text-xl text-blue-700 font-semibold">
          With 100+ Trusted Doctors
        </p>

        <button
          onClick={handleClick}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-md font-semibold transition duration-300 cursor-pointer"
        >
          Create Account
        </button>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={assets.appointment_img}
          alt="Appointment"
          className="max-w-full h-auto rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Banner;
