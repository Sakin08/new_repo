import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
          headers: { dtoken: dToken }
        });
        if (data.success) {
          setDoctorInfo(data.doctor);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [backendUrl, dToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!doctorInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No profile information available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section with Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-16 left-8">
            <img
              src={doctorInfo.image}
              alt={doctorInfo.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-8 pb-8">
          {/* Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{doctorInfo.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {doctorInfo.speciality}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {doctorInfo.degree}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {doctorInfo.experience} Experience
              </span>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-lg font-medium text-gray-800">${doctorInfo.fees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Availability Status</p>
                  <p className={`text-lg font-medium ${doctorInfo.available ? 'text-green-600' : 'text-red-600'}`}>
                    {doctorInfo.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-medium text-gray-800">{doctorInfo.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
              <div className="space-y-2">
                <p className="text-gray-700">{doctorInfo.address.line1}</p>
                <p className="text-gray-700">{doctorInfo.address.line2}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{doctorInfo.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;