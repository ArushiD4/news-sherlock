import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

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
        w-full backdrop-blur-md bg-black/30 text-white_custom 
        py-4 px-6 flex justify-between items-center 
        border-b border-yellow-500/20 shadow-lg sticky top-0 z-50
      "
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-extrabold tracking-wide text-white flex items-center gap-2 select-none"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b8860b]">
          News
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] to-[#d4af37]">
          Sherlock
        </span>
      </motion.div>

      {/* Nav Links */}
      <ul className="flex gap-8 text-lg font-medium">
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
                state={item.state}
                className={`
                  px-2 py-1 rounded-md transition-all duration-300
                  ${isActive ? "text-[#f7d774]" : "text-white_custom/70"}
                `}
              >
                {item.name}
              </Link>

              {/* underline */}
              <span
                className={`
                  absolute left-0 -bottom-1 h-[3px] rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b]"
                      : "w-0 bg-white/60 group-hover:w-full"
                  }
                `}
              ></span>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
