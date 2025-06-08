import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <section className="bg-gray-50 text-gray-800 py-16 px-6 lg:px-20">
      {/* About Us Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">
          About <span className="text-blue-600">Us</span>
        </h2>
        <p className="mt-2 text-gray-600">Learn more about our mission and what makes us different.</p>
      </div>

      {/* About Content */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
        <div className="w-full lg:w-1/2">
          <img
            src={assets.about_image}
            alt="About Prescripto"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-6 text-lg">
          <p>
            Welcome to <span className="font-semibold text-blue-600">Prescripto</span>, your trusted partner in managing your healthcare needs. We understand the challenges individuals face when scheduling appointments or keeping health records organized.
          </p>
          <p>
            Our commitment is to deliver a smooth, tech-powered experience. We constantly improve our platform to bring you the best service, whether you’re booking your first visit or managing ongoing care.
          </p>
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-1">Our Vision</h3>
            <p>
              We aim to bridge the gap between patients and healthcare providers, ensuring you have seamless access to care—anytime, anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">
          Why <span className="text-blue-600">Choose Us</span>
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">Efficiency</h4>
          <p className="text-gray-600">Streamlined appointment scheduling that fits your lifestyle.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">Convenience</h4>
          <p className="text-gray-600">Access to trusted healthcare professionals in your area.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h4 className="text-xl font-semibold text-blue-600 mb-2">Personalization</h4>
          <p className="text-gray-600">Health reminders and suggestions tailored just for you.</p>
        </div>
      </div>
    </section>
  )
}

export default About
