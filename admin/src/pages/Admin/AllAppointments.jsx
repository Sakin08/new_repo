import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { appointments, getAllAppointments, loading, cancelAppointment, deleteAppointment } = useContext(AdminContext);

  useEffect(() => {
    getAllAppointments();
  }, []);

  const formatDOB = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const success = await cancelAppointment(appointmentId);
      if (success) {
        getAllAppointments();
      }
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to permanently delete this appointment? This action cannot be undone.')) {
      const success = await deleteAppointment(appointmentId);
      if (success) {
        getAllAppointments();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Appointments</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-200" 
                        src={appointment.userData?.image || 'https://via.placeholder.com/40'} 
                        alt={appointment.userData?.name || 'Patient'} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.userData?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.userData?.age 
                          ? `${appointment.userData.age} years (DOB: ${formatDOB(appointment.userData.dob)})` 
                          : 'Age not specified'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.userData?.phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-200" 
                        src={appointment.docData.image || 'https://via.placeholder.com/40'} 
                        alt={appointment.docData.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {appointment.docData.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.docData.speciality}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.docData.experience || 'Experience not specified'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.slotDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.slotTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Tk {appointment.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${appointment.cancelled 
                      ? 'bg-red-100 text-red-800' 
                      : appointment.isCompleted 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'}`}>
                    {appointment.cancelled 
                      ? 'Cancelled'
                      : appointment.isCompleted 
                        ? 'Completed'
                        : 'Scheduled'}
                  </span>
                  {appointment.payment && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div className="flex flex-col space-y-2">
                    {!appointment.cancelled && !appointment.isCompleted && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="text-yellow-600 hover:text-yellow-900 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                    {appointment.cancelled && (
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;