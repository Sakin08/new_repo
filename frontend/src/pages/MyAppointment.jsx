import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointment = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Appointments</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {doctors.slice(0, 2).map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex gap-6 items-start hover:shadow-xl transition-all">
            {/* Doctor Image */}
            <div className="w-24 h-24 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full border-4 border-blue-100"
              />
            </div>

            {/* Appointment Info */}
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-blue-600 font-medium">{item.speciality}</p>
              <div className="text-gray-600 text-sm mt-2">
                <p><span className="font-semibold">Address:</span></p>
                <p>{item.address.line1}</p>
                <p>{item.address.line2}</p>
                <p className="mt-1">
                  <span className="font-semibold">Date & Time:</span> 25 July, 2024 | 8:30 PM
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
        ))}
      </div>
    </div>
  )
}

export default MyAppointment