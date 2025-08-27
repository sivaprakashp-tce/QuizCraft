import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { websiteLogo } from "../assets";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = ["Home", "About", "Contact"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50">
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        
        <img
          src={websiteLogo}
          alt="QuizCraft Logo"
          className="w-16 h-16 rounded-full hover:border-2 border-white cursor-pointer"
        />

        <div className="hidden md:flex items-center space-x-12 text-lg font-semibold">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative px-3 py-1 group flex flex-col items-center"
            >
              <span className="relative z-20">{item}</span>

              {/* Small highlight bar */}
              <span
                className="absolute -top-3 w-10 h-1 bg-[#D4A981] rounded 
                           opacity-0 group-hover:opacity-100 transition-all duration-300"
              ></span>

              {/* Spotlight effect */}
              <span
                className="absolute -top-1 w-24 h-24 scale-0 group-hover:scale-100 
                           bg-gradient-to-b from-[#D4A981]/90 via-[#D4A981]/30 to-transparent
                           rounded-b-full opacity-90 blur-md transition-transform duration-500"
              ></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border border-white text-[#AD8B70] font-semibold relative overflow-hidden group"
          >
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 border-2 border-transparent rounded-full group-hover:border-white transition-all duration-500"></span>
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-full border border-white text-[#AD8B70] font-semibold relative overflow-hidden group"
          >
            <span className="relative z-10">Signup</span>
            <span className="absolute inset-0 border-2 border-transparent rounded-full group-hover:border-white transition-all duration-500"></span>
          </Link>
        </div>

        
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     
      {menuOpen && (
        <div className="md:hidden bg-black flex flex-col items-center space-y-6 py-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative px-3 py-1 group flex flex-col items-center text-lg"
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative z-20">{item}</span>

              <span
                className="absolute -top-3 w-10 h-1 bg-[#D4A981] rounded 
                           opacity-0 group-hover:opacity-100 transition-all duration-300"
              ></span>

              <span
                className="absolute -top-1 w-24 h-24 scale-0 group-hover:scale-100 
                           bg-gradient-to-b from-[#D4A981]/90 via-[#D4A981]/30 to-transparent
                           rounded-b-full opacity-90 blur-md transition-transform duration-500"
              ></span>
            </Link>
          ))}

          
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2 rounded-full border border-white text-[#AD8B70] w-25 text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2 rounded-full border border-white text-[#AD8B70]  w-25 text-center"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;




