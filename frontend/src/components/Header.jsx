import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {

  // Smooth scroll handler for Book Appointment button
  const handleScroll = (e) => {
    e.preventDefault();
    const specialitySection = document.getElementById('speciality');
    if (specialitySection) {
      specialitySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 md:px-16 flex flex-col-reverse md:flex-row items-center justify-center gap-12 font-sans">
      {/* Left Side */}
      <div className="md:w-1/2 space-y-5 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Book Appointment <br />
          with <span className="text-blue-600">Trusted Doctors</span>
        </h1>

        <div className="flex items-center justify-center md:justify-start gap-4">
          <img src={assets.group_profiles} alt="Group Profiles" className="w-12 h-12 rounded-full shadow-md" />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Explore our list of verified doctors and schedule your appointments with ease.
          </p>
        </div>

        <button
          onClick={handleScroll}
          className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg 
                     hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer w-fit mx-auto md:mx-0 text-base font-medium"
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
        </button>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={assets.header_img}
          alt="Header Illustration"
          className="w-[80%] max-w-md rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Header;
