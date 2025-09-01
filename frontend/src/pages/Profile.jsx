import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {websiteLogo} from "../assets";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [details, setDetails] = useState({
    username: "John Doe",
    email: "user@email.com",
    stream: "Computer Science",
    description: "Programming and software development",
    institution: "MIT",
    city: "Cambridge",
    country: "USA",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const seasons = [
    {
      gradient: "linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%)",
      icon: "🌸",
    },
    {
      gradient: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
      icon: "❄️",
    },
    {
      gradient: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
      icon: "☀️",
    },
    {
      gradient: "linear-gradient(135deg, #c02425 0%, #f0cb35 100%)",
      icon: "🍂",
    },
  ];
  const [bgIndex, setBgIndex] = useState(0);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
    
      {seasons.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ background: s.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: bgIndex === i ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute top-6 left-8 z-20">
        <img
          src={websiteLogo}
          alt="Logo"
          className="w-32 h-32 rounded-full p-2 transition-all duration-300 hover:border-4 hover:border-white"
        />
      </div>

      <div className="absolute top-6 right-8 flex gap-3 z-20">
        {seasons.map((s, i) => (
          <motion.button
            key={i}
            onClick={() => setBgIndex(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`text-2xl px-3 py-2 rounded-full shadow-md ${
              bgIndex === i ? "bg-white text-black" : "bg-white/80 text-black"
            }`}
          >
            {s.icon}
          </motion.button>
        ))}
      </div>

    
      <motion.div
        className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-12 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl border border-white/30 z-10"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        
        <h1 className="text-black text-5xl font-extrabold text-center">
          {details.username}
        </h1>

   
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} fill={i < 3 ? "#ffd700" : "none"} stroke="black" />
          ))}
        </div>

   
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 text-black text-xl">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="uppercase text-lg text-gray-700">{key}</span>
              {editMode ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="bg-transparent border-b border-black text-xl focus:outline-none"
                />
              ) : (
                <span className="mt-1">{value}</span>
              )}
            </div>
          ))}
        </div>

      
        <div className="mt-12 flex justify-center gap-6">
          {editMode ? (
            <>
              <motion.button
                onClick={() => setEditMode(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-black text-white px-8 py-3 rounded-full font-bold"
              >
                Save
              </motion.button>
              <motion.button
                onClick={() => setEditMode(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-500 text-white px-8 py-3 rounded-full font-bold"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg"
            >
              Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
















