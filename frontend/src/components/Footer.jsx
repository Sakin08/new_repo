import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  // Scroll to top on link click
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <footer className="bg-gray-100 text-gray-700 px-6 md:px-20 py-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap gap-10">
        {/* Left Section */}
        <div className="md:w-1/3 space-y-4">
          <img src={assets.logo} alt="Logo" className="h-12" />
          <p className="text-gray-600 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...
          </p>
        </div>

        {/* Middle Section */}
        <div className="md:w-1/3 space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">COMPANY</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <Link to="/" onClick={scrollToTop} className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={scrollToTop} className="hover:text-blue-600 transition">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollToTop} className="hover:text-blue-600 transition">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-blue-600 transition">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="md:w-1/3 space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">GET IN TOUCH</h3>
          <ul className="space-y-3 text-blue-700 text-sm break-words">
            <li>📞 +1-212-456-7890</li>
            <li>✉️ greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-gray-500 text-xs select-none">
        © 2025 GreatStack - All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
