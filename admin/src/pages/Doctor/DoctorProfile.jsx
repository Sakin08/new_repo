import React, { useContext, useEffect, useState, useRef } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    name: '',
    speciality: '',
    degree: '',
    experience: '',
    fees: '',
    about: '',
    address: {
      line1: '',
      line2: ''
    }
  });

  useEffect(() => {
    if (doctorInfo) {
      setEditForm({
        name: doctorInfo.name,
        speciality: doctorInfo.speciality,
        degree: doctorInfo.degree,
        experience: doctorInfo.experience,
        fees: doctorInfo.fees,
        about: doctorInfo.about,
        address: {
          line1: doctorInfo.address.line1,
          line2: doctorInfo.address.line2
        }
      });
      setImagePreview(doctorInfo.image);
    }
  }, [doctorInfo]);

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

  useEffect(() => {
    fetchDoctorProfile();
  }, [backendUrl, dToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(editForm[key]));
        } else {
          formData.append(key, editForm[key]);
        }
      });

      if (fileInputRef.current.files[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/doctor/update-profile`,
        formData,
        { 
          headers: { 
            dtoken: dToken,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchDoctorProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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
        <div className="relative h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <img
                src={doctorInfo.image}
                alt={doctorInfo.name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-sm font-medium">Change Photo</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-6 py-2.5 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors font-medium"
          >
            Edit Profile
          </button>
          <div className="absolute bottom-4 left-56">
            <h1 className="text-3xl font-bold text-white">{doctorInfo.name}</h1>
            <p className="text-blue-100 mt-1">{doctorInfo.email}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-8 pb-8">
          {/* Professional Tags */}
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {doctorInfo.speciality}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {doctorInfo.degree}
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {doctorInfo.experience} Experience
            </span>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-lg font-medium text-gray-800">${doctorInfo.fees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Availability Status</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-3 h-3 rounded-full ${doctorInfo.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <p className={`font-medium ${doctorInfo.available ? 'text-green-600' : 'text-red-600'}`}>
                      {doctorInfo.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
              <div className="space-y-2">
                <p className="text-gray-700">{doctorInfo.address.line1}</p>
                <p className="text-gray-700">{doctorInfo.address.line2}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{doctorInfo.about}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-sm font-medium">Change Photo</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">Click to upload new profile picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={doctorInfo.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speciality
                    </label>
                    <select
                      name="speciality"
                      value={editForm.speciality}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="General physician">General physician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatricians">Pediatricians</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={editForm.degree}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={editForm.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={editForm.fees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address.line1"
                    value={editForm.address.line1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address.line2"
                    value={editForm.address.line2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={editForm.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-white bg-blue-600 rounded-full hover:bg-blue-700 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;