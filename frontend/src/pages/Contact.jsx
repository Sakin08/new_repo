import React from 'react'
import { Briefcase } from 'lucide-react' 
import { assets } from '../assets/assets'
// Add at the top with other imports


const Contact = () => {
  return (
    <section className="bg-gray-50 text-gray-800 py-16 px-6 lg:px-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          CONTACT <span className="text-blue-600">US</span>
        </h2>
        <p className="mt-2 text-gray-600">We’d love to hear from you — here’s how you can reach us.</p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Contact Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={assets.contact_image}
            alt="Contact"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 space-y-6 text-lg">
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-1">Our Office</h3>
            <p className="text-gray-700">
              House #12, Road #4,<br />
              Dhanmondi, Dhaka 1205, Bangladesh
            </p>
          </div>
          <div>
            <p className="text-gray-700"><span className="font-medium">Tel:</span> +880 1700-123456</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> 2021331008@student.sust.edu</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-1">Careers at PRESCRIPTO</h3>
            <p className="text-gray-700 mb-4">Learn more about our teams and job openings.</p>
            <button className="group flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300">
              <Briefcase className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
