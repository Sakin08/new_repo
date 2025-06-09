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

  useEffect(() => {
    if (token) {
      getUserAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Appointments</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading appointments...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex gap-6 items-start hover:shadow-xl transition-all">
                {/* Doctor Image */}
                <div className="w-24 h-24 shrink-0">
                  <img
                    src={item.docData.image}
                    alt={item.docData.name}
                    className="w-full h-full object-cover rounded-full border-4 border-blue-100"
                  />
                </div>

                {/* Appointment Info */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold text-gray-800">{item.docData.name}</h3>
                  <p className="text-blue-600 font-medium">{item.docData.speciality}</p>
                  <div className="text-gray-600 text-sm mt-2">
                    <p><span className="font-semibold">Address:</span></p>
                    <p>{item.docData.address.line1}</p>
                    <p>{item.docData.address.line2}</p>
                    <p className="mt-1">
                      <span className="font-semibold">Date & Time:</span> {new Date(item.slotDate).toLocaleDateString('en-GB')} | {item.slotTime}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm">
                    Pay Online
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No appointments booked yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;