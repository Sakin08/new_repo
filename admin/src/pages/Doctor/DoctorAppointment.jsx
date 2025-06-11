import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaUserAlt,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaSearch,
  FaSpinner,
  FaTrash,
} from 'react-icons/fa';

const DoctorAppointment = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingAppointments, setProcessingAppointments] = useState(new Set());

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus, patientName) => {
    if (newStatus === 'cancelled') {
      // Show confirmation toast
      toast.warn(
        <div>
          <p className="font-medium mb-2">Cancel Appointment?</p>
          <p className="text-sm mb-4">Are you sure you want to cancel the appointment with {patientName}?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(); // Close the confirmation toast
                processStatusChange(appointmentId, newStatus);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
              No, Keep
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
          className: "confirmation-toast"
        }
      );
    } else {
      // For confirmation, proceed directly
      await processStatusChange(appointmentId, newStatus);
    }
  };

  const processStatusChange = async (appointmentId, newStatus) => {
    try {
      setProcessingAppointments(prev => new Set([...prev, appointmentId]));

      if (newStatus === 'confirmed') {
        const { data } = await axios.put(
          `${backendUrl}/api/doctor/complete-appointment`,
          { appointmentId },
          { headers: { dtoken: dToken } }
        );
        
        if (data.success) {
          toast.success('Appointment confirmed successfully');
          await fetchAppointments();
        } else {
          toast.error(data.message || 'Failed to confirm appointment');
        }
      } else if (newStatus === 'cancelled') {
        const { data } = await axios.put(
          `${backendUrl}/api/doctor/cancel-appointment`,
          { appointmentId },
          { headers: { dtoken: dToken } }
        );

        if (data.success) {
          toast.success('Appointment cancelled successfully');
          await fetchAppointments();
        } else {
          toast.error(data.message || 'Failed to cancel appointment');
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to update appointment status. Please try again.'
      );
    } finally {
      setProcessingAppointments(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const handleDelete = async (appointmentId, patientName) => {
    // Show confirmation toast
    toast.warn(
      <div>
        <p className="font-medium mb-2">Delete Appointment Record?</p>
        <p className="text-sm mb-4">Are you sure you want to delete the appointment record with {patientName}? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss();
              processDelete(appointmentId);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            No, Keep
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "confirmation-toast"
      }
    );
  };

  const processDelete = async (appointmentId) => {
    try {
      setProcessingAppointments(prev => new Set([...prev, appointmentId]));

      const { data } = await axios.delete(
        `${backendUrl}/api/doctor/delete-appointment/${appointmentId}`,
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success('Appointment record deleted successfully');
        setAppointments(prev => prev.filter(app => app._id !== appointmentId));
      } else {
        toast.error(data.message || 'Failed to delete appointment record');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to delete appointment record. Please try again.'
      );
    } finally {
      setProcessingAppointments(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchAppointments();
      const refreshInterval = setInterval(fetchAppointments, 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [dToken]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('_');
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeString) => {
    return timeString || '';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.userData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.userData?.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          📅 My Appointments
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaCalendarAlt className="text-6xl text-gray-300" />
            <p className="text-xl text-gray-500">No appointments found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    {/* Patient Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {appointment.userData?.image ? (
                          <img
                            src={appointment.userData.image}
                            alt={appointment.patientName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-400">
                            <FaUserAlt className="text-blue-600 text-xl" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">Age: {appointment.age} years</div>
                          {appointment.userData?.email && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]" title={appointment.userData.email}>
                              {appointment.userData.email}
                            </div>
                          )}
                          {appointment.userData?.phone && (
                            <div className="text-sm text-gray-500">{appointment.userData.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Appointment Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-blue-500" />
                          {formatTime(appointment.time)}
                        </div>
                      </div>
                    </td>

                    {/* Payment Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FaMoneyBillWave className="mr-2 text-blue-500" />
                          Tk {appointment.fees}
                        </div>
                        <div className="flex items-center">
                          <FaCreditCard className="mr-2 text-blue-500" />
                          {appointment.paymentMode}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeClass(appointment.status)} capitalize`}>
                        {appointment.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {appointment.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(appointment._id, 'confirmed', appointment.patientName)}
                            disabled={processingAppointments.has(appointment._id)}
                            className={`flex items-center justify-center px-3 py-1 rounded-lg transition-colors duration-200 ${
                              processingAppointments.has(appointment._id)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                          >
                            {processingAppointments.has(appointment._id) ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              'Confirm'
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment._id, 'cancelled', appointment.patientName)}
                            disabled={processingAppointments.has(appointment._id)}
                            className={`flex items-center justify-center px-3 py-1 rounded-lg transition-colors duration-200 ${
                              processingAppointments.has(appointment._id)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                          >
                            {processingAppointments.has(appointment._id) ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        </div>
                      )}
                      {appointment.status === 'cancelled' && (
                        <button
                          onClick={() => handleDelete(appointment._id, appointment.patientName)}
                          disabled={processingAppointments.has(appointment._id)}
                          className={`flex items-center justify-center px-3 py-1 rounded-lg transition-colors duration-200 ${
                            processingAppointments.has(appointment._id)
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {processingAppointments.has(appointment._id) ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-2" />
                              Delete
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;
