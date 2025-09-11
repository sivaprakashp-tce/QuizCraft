import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { websiteLogo } from "../assets";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [floatAnimation, setFloatAnimation] = useState(true);
  const [details, setDetails] = useState({
    username: "John Doe",
    email: "user@email.com",
    stream: "Computer Science",
    institution: "MIT"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const seasons = [
    { gradient: "linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%)", icon: "🌸" },
    { gradient: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)", icon: "❄️" },
    { gradient: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)", icon: "☀️" },
    { gradient: "linear-gradient(135deg, #c02425 0%, #f0cb35 100%)", icon: "🍂" },
  ];
  const [bgIndex, setBgIndex] = useState(0);

  // Stop floating effect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setFloatAnimation(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Season Background */}
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

      {/* Logo */}
      <div className="absolute top-6 left-8 z-20">
        <img
          src={websiteLogo}
          alt="Logo"
          className="w-32 h-32 rounded-full p-2 transition-all duration-300 hover:border-4 hover:border-white"
        />
      </div>

      {/* Season Selector */}
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

      {/* Profile Card */}
      <motion.div
        className="relative bg-black/70 backdrop-blur-xl rounded-3xl p-10 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl border border-white/30 z-10 bottom-5"
        animate={{ y: floatAnimation ? [0, -15, 0] : [0] }}
        transition={{ duration: 4, repeat: floatAnimation ? Infinity : 0, ease: "easeInOut" }}
      >
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-6 left-6 flex items-center gap-2 text-white font-bold hover:text-amber-300"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <h1 className="text-white text-5xl font-extrabold text-center mb-6">
          Profile
        </h1>

        {/* Rating Stars */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} fill={i < 3 ? "#ffd700" : "none"} stroke="black" />
          ))}
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-10 text-white text-lg">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="uppercase text-gray-300 mb-1">{key}</label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                readOnly={(key == 'email') ? true : !editMode}
                className={`w-full px-3 py-2 rounded-lg border border-gray-500 
                  bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
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
      {/* Separated Links Container */}
      <div className="absolute bottom-5 w-full flex flex-col items-center gap-6 md:flex-row md:justify-center z-10">
        <motion.a
          href="/user/quizzes"
          className="w-11/12 md:w-auto text-center bg-[#8b5cf6] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          My Quizzes
        </motion.a>
        <motion.a
          href="/create/quiz"
          className="w-11/12 md:w-auto text-center bg-[#f59e0b] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Quiz
        </motion.a>
        <motion.a
          href="/leaderboard"
          className="w-11/12 md:w-auto text-center bg-[#10b981] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Leaderboard
        </motion.a>
      </div>
    </div>
  );
};

export default Profile;