import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // 1. Check for logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  // 2. Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/"); // Redirect to landing page
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Detect", path: "/detect" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="
        w-full backdrop-blur-md bg-black/80 text-white_custom 
        py-4 px-6 flex justify-between items-center 
        border-b border-yellow-500/20 shadow-lg sticky top-0 z-50
      "
    >
      {/* Logo */}
      <Link to="/">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold tracking-wide text-white flex items-center gap-2 select-none cursor-pointer"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b8860b]">
            News
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] to-[#d4af37]">
            Sherlock
          </span>
        </motion.div>
      </Link>

      {/* Center Nav Links */}
      <ul className="hidden md:flex gap-8 text-lg font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <Link
                to={item.path}
                className={`
                  px-2 py-1 rounded-md transition-all duration-300
                  ${isActive ? "text-[#f7d774]" : "text-white_custom/70"}
                `}
              >
                {item.name}
              </Link>
              <span
                className={`
                  absolute left-0 -bottom-1 h-[3px] rounded-full transition-all duration-300
                  ${isActive
                    ? "w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b]"
                    : "w-0 bg-white/60 group-hover:w-full"
                  }
                `}
              ></span>
            </motion.li>
          );
        })}
      </ul>

      {/* Right Side: User Menu */}
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 focus:outline-none"
        >
          {user ? (
             <div className="hidden md:block text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Welcome</p>
                <p className="text-sm font-bold text-[#d4af37]">{user.name?.split(" ")[0]}</p>
             </div>
          ) : null}

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
               {/* User Icon SVG */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
          </div>
        </motion.button>

        {/* Dropdown Menu with Animation */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-4 w-56 bg-[#0a1120] border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5"
            >
              {user ? (
                // LOGGED IN MENU
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-xs text-gray-500 uppercase">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-[#d4af37] transition-colors"
                  >
                    <span>📜</span> History
                  </Link>

                  <Link
                    to="/detect"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-[#d4af37] transition-colors"
                  >
                    <span>🔍</span> New Scan
                  </Link>

                  <div className="border-t border-gray-800 mt-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              ) : (
                // LOGGED OUT MENU
                <div className="py-2">
                  <Link
                    to="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-[#d4af37] transition-colors"
                  >
                    <span>🔐</span> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-[#d4af37] transition-colors"
                  >
                    <span>📝</span> Register
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}