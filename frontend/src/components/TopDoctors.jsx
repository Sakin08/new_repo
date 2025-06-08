import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  // Instant scroll to top and navigate
  const handleNavigate = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="px-6 py-12 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4 text-center tracking-wide">
        Top Doctors to Book
      </h1>
      <p className="text-center text-blue-700 max-w-3xl mx-auto mb-12 text-lg font-light leading-relaxed">
        Browse our trusted doctors and schedule your appointment effortlessly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(`/appointment/${item._id}`)}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer
                       transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-28 object-cover rounded-full mb-5 border-2 border-blue-300"
              loading="lazy"
            />
            <div className="text-center">
              <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Available
              </span>
              <h2 className="text-xl font-semibold text-blue-900 mb-1">{item.name}</h2>
              <p className="text-blue-600 text-sm font-medium">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => handleNavigate('/doctors')}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-semibold
                     shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          More
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
