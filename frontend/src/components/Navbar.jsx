import React, { useState, useRef, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";


const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // Mobile menu
  const { token, userData, setToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Profile dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage and update state
    setToken(false);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 hover:scale-105 transform transition duration-300"
        >
          <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-blue-600">MediCare</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex space-x-6 items-center">
          {["/", "/doctors", "/about", "/contact"].map((path, idx) => (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `text-md font-medium hover:text-blue-600 transition duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
                }`
              }
            >
              {path === "/" ? "Home" : path === "/doctors" ? "All Doctors" : path === "/about" ? "About" : "Contact"}
            </NavLink>
          ))}
        </ul>

        {/* Right-side buttons */}
        <div className="hidden sm:block relative" ref={dropdownRef}>
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Create Account
            </button>
          ) : (
            <div>
              <img
                src={userData?.image || "https://i.pravatar.cc/32"}
                alt="Profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => {
                      navigate("/my-profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/my-appointment");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Appointment
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="sm:hidden" onClick={() => setShowMenu(!showMenu)}>
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="sm:hidden mt-4 space-y-3">
          {["/", "/doctors", "/about", "/contact"].map((path, idx) => (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `block text-md font-medium hover:text-blue-600 transition duration-300 ${isActive ? "text-blue-600" : "text-gray-700"
                }`
              }
              onClick={() => setShowMenu(false)} // close menu after click
            >
              {path === "/" ? "Home" : path === "/doctors" ? "All Doctors" : path === "/about" ? "About" : "Contact"}
            </NavLink>
          ))}
          {!token ? (
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/login");
              }}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Create Account
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/appointments");
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Appointment
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;