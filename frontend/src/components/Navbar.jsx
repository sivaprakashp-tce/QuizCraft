import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Home, Info, Mail, BookCheck } from "lucide-react";
import { websiteLogo } from "../assets";
import { getJWTToken } from "../utils";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Directly check token on every render
  const isLoggedIn = !!getJWTToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const commonMenu = [
    { name: "Home", icon: Home, path: "/" },
    { name: "About", icon: Info, path: "/about" },
    { name: "Contact", icon: Mail, path: "/contact" },
  ];
  const registeredMenu = [...commonMenu, { name: "Quizzes", icon: BookCheck, path: "/quizzes" }];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50">
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <img
          src={websiteLogo}
          alt="QuizCraft Logo"
          className="w-16 h-16 rounded-full hover:border-2 border-white cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12 text-lg font-semibold">
          {(isLoggedIn ? registeredMenu : commonMenu).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-3 py-1 group flex flex-col items-center"
              >
                <div className="flex items-center space-x-2 relative z-20">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
                <span className="absolute -top-3 w-10 h-1 bg-[#D4A981] rounded opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <span className="absolute -top-1 w-24 h-24 scale-0 group-hover:scale-100 bg-gradient-to-b from-[#D4A981]/90 via-[#D4A981]/30 to-transparent rounded-b-full opacity-90 blur-md transition-transform duration-500" />
              </Link>
            );
          })}
        </div>

        {/* Right side buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D4A981] text-black hover:bg-white transition-all cursor-pointer"
              >
                <User size={22} />
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-[#D4A981] text-black font-bold hover:bg-white transition-all"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-white text-[#AD8B70] font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full border border-white text-[#AD8B70] font-semibold"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black flex flex-col items-center space-y-6 py-6">
          {(isLoggedIn ? registeredMenu : commonMenu).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="relative px-3 py-1 group flex flex-col items-center text-lg"
              >
                <div className="flex items-center space-x-2 relative z-20">
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
                <span className="absolute -top-3 w-10 h-1 bg-[#D4A981] rounded opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <span className="absolute -top-1 w-24 h-24 scale-0 group-hover:scale-100 bg-gradient-to-b from-[#D4A981]/90 via-[#D4A981]/30 to-transparent rounded-b-full opacity-90 blur-md transition-transform duration-500" />
              </Link>
            );
          })}

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 text-lg hover:text-[#D4A981]"
              >
                <User size={24} /> <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="px-5 py-2 rounded-lg bg-[#D4A981] text-black font-semibold"
              >
                Log out
              </button>
            </>
          ) : (
            <>
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
                className="px-5 py-2 rounded-full border border-white text-[#AD8B70] w-25 text-center"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;