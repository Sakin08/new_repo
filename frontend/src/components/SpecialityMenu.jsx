import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  
  return (
    <div id="speciality" className="px-6 py-10 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-3 text-center">Find by Speciality</h1>
      <p className="text-center text-blue-700 max-w-3xl mx-auto mb-10 text-lg">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => {
    window.scrollTo(0,0);
  }}
            className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 w-[200px] hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
          
          >
            
            <img src={item.image} alt={item.speciality} className="h-24 w-24 object-contain mb-4" />
            <p className="text-blue-600 font-semibold text-lg tracking-wide text-center break-words">
              {item.speciality}
            </p>
          </Link>
          
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
