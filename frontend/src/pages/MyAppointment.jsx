import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log("Appointments fetched:", data.appointments);
      } else {
        toast.error(data.message || "Failed to fetch appointments");
        setAppointments([]);
      }
    } catch (error) {
      console.error("Axios error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || "An error occurred");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        await getUserAppointments();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 underline underline-offset-8 decoration-indigo-500">
        My Appointments
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading appointments...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg p-6 flex gap-6 items-start transition-all duration-300 hover:shadow-2xl"
              >
                {/* Doctor Image */}
                <div className="w-24 h-24 shrink-0">
                  <img
                    src={item.docData.image}
                    alt={item.docData.name}
                    className="w-full h-full object-cover rounded-full border-4 border-blue-200 hover:border-indigo-400 transition duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-800">{item.docData.name}</h3>
                  <p className="text-indigo-600 font-medium">{item.docData.speciality}</p>
                  <div className="text-gray-700 text-sm mt-3 space-y-1">
                    <p><span className="font-semibold">Address:</span></p>
                    <p>{item.docData.address.line1}</p>
                    <p>{item.docData.address.line2}</p>
                  </div>

                 <div className="mt-4 bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-200 inline-flex items-center text-sm tracking-wide transform hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
  <span>{new Date(item.slotDate).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}</span>
  <span className="mx-2 text-gray-400">|</span>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{item.slotTime}</span>
</div>

                  
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300">
                    Pay Online
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">No appointments booked yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
