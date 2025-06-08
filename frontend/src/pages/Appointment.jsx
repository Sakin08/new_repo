import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    const today = new Date();
    const allSlots = [];
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      if (i === 0) {
        const now = new Date();
        currentDate.setHours(Math.max(now.getHours() + 1, 10));
        currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.error("Please login to book an appointment");
      return navigate('/login');
    }
    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      const selectedSlot = docSlots[slotIndex][0].datetime;
      const slotDate = selectedSlot.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const response = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime: slotTime.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setSlotTime(""); // Reset selected time
        await getAvailableSlots(); // Refresh slots
        navigate("/my-appointment"); // Navigate to my-appointment
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-5 flex items-center justify-center">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="md:w-2/3 p-5 flex flex-col justify-between space-y-4 text-gray-800">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{docInfo.name}</h2>
              <img
                src={assets.verified_icon}
                alt="Verified"
                className="w-4 h-4"
                title="Verified Doctor"
              />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-semibold">
                {docInfo.degree} • {docInfo.speciality}
              </p>
              <p className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                {docInfo.experience} experience
              </p>
            </div>
            <section>
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <img
                  src={assets.info_icon}
                  alt="Info"
                  className="w-4 h-4 opacity-80"
                  title="More Information"
                />
              </div>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {docInfo.about}
              </p>
            </section>
            <div className="mt-3 text-sm font-semibold text-gray-900">
              Appointment fee:{" "}
              <span className="text-blue-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 font-semibold text-gray-800 max-w-xl mx-auto">
          <p className="text-2xl font-bold mb-6 text-center tracking-wide">
            Booking slots
          </p>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar px-4 py-2">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`
                    flex flex-col items-center justify-center min-w-[72px] cursor-pointer rounded-xl 
                    border transition-all duration-300 select-none
                    ${
                      slotIndex === index
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                    }
                  `}
                  style={{ padding: "12px 16px" }}
                >
                  <p className="text-sm font-semibold tracking-wide">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {item[0] && item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-10 max-w-xl mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {docSlots.length > 0 &&
                docSlots[slotIndex].map((item, index) => (
                  <label
                    key={index}
                    htmlFor={`timeslot-${index}`}
                    className="cursor-pointer min-w-[80px] text-sm font-semibold shadow-sm whitespace-nowrap
                      border border-blue-300 rounded-xl
                      flex justify-center items-center
                      transition duration-300 ease-in-out
                      hover:bg-blue-100 hover:text-blue-900"
                  >
                    <input
                      type="radio"
                      id={`timeslot-${index}`}
                      name="timeslot"
                      className="hidden peer"
                      onChange={() => setSlotTime(item.time)}
                    />
                    <span
                      className={`
                        block w-full px-4 py-2 rounded-xl
                        text-blue-700
                        ${
                          slotTime === item.time
                            ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300"
                            : "peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300"
                        }
                        transition-colors duration-300
                      `}
                    >
                      {item.time.toLowerCase()}
                    </span>
                  </label>
                ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleBookAppointment}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-bold
                  shadow-md hover:bg-blue-700 active:bg-blue-800
                  transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Book an Appointment
              </button>
            </div>
          </div>
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;