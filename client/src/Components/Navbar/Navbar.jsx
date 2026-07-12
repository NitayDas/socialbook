import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBell, FaComments, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Logo from '../../assets/images/logo.svg'
import profile from '../../assets/images/f2.png'
import { useUser } from "../../Provider/UserProvider";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, user } = useUser();

  const handleLogout = () => {
    signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="_header_nav _header_nav_shadow w-full bg-white fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-12 h-[70px]">

        {/* Left: Logo */}
        <div className="_logo_wrap flex items-center">
          <img src={Logo} alt="Logo" className="h-7 w-auto" />
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Middle: Search Bar (desktop only) */}
        <div className="hidden md:flex flex-1 px-10">
          <div className="relative w-full">
            <svg
              className="_header_form_svg absolute left-3 mt-2 top-1 -translate-y-1/2"
              width="20"
              height="20"
              fill="none"
              stroke="#999"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>

            <input
              type="text"
              placeholder="input search text"
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-gray-700 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 outline-none transition"
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className="_header_nav_link relative">
            <IoHomeOutline size={22} className="text-gray-500 _home" />
          </NavLink>
          <NavLink to="/users" className="_header_nav_link relative">
            <FaUsers size={20} className="text-gray-500" />
          </NavLink>
          <div className="_header_nav_link relative cursor-pointer">
            <FaBell size={20} className="text-gray-500" />
            <span className="_counting">6</span>
          </div>
          <div className="_header_nav_link relative cursor-pointer">
            <FaComments size={20} className="text-gray-500" />
            <span className="_counting">2</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="_header_nav_profile cursor-pointer flex items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={profile} alt="Profile" className="_header_nav_profile_image rounded-full h-8 w-8 object-cover" />
              {user && (
                <p className="_header_nav_para ml-2 font-medium">{user.first_name}</p>
              )}
              <IoIosArrowDown size={18} className="text-gray-600 ml-1" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white w-full shadow-lg border-t border-gray-200">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <NavLink to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <IoHomeOutline size={22} /> Home
            </NavLink>
            <NavLink to="/users" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <FaUsers size={20} /> Users
            </NavLink>
            <div className="flex items-center gap-2 cursor-pointer">
              <FaBell size={20} /> Notifications <span className="ml-auto bg-red-500 text-white rounded-full px-2 text-xs">6</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <FaComments size={20} /> Messages <span className="ml-auto bg-red-500 text-white rounded-full px-2 text-xs">2</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={profile} alt="Profile" className="rounded-full h-8 w-8 object-cover" />
                {user && <span>{user.first_name}</span>}
                <IoIosArrowDown size={16} />
              </div>
              {dropdownOpen && (
                <div className="mt-2 bg-white rounded-md border border-gray-200 shadow-md">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
