//Navbar for registered users
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {websiteLogo} from "../assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    "Home",
    "About",
    "Quizzes",
    "Contact",
  ];

  return (
    <nav className="relative w-full bg-black text-white shadow-md">
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
              to={
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(" ", "-")}`
              }
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

        <button
          onClick={handleLogout}
          className="hidden md:block px-5 py-2 rounded-lg bg-[#D4A981] text-black font-bold hover:bg-white transition-all"
        >
          Log out
        </button>

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
              to={
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(" ", "-")}`
              }
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

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="px-5 py-2 rounded-lg bg-[#D4A981] text-black font-semibold hover:opacity-90 transition-all"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
