import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { websiteLogo } from "../assets";
import { useNavigate } from "react-router-dom";
import { getJWTToken } from "../utils";

const Profile = () => {
  const navigate = useNavigate();
  const JWTToken = getJWTToken();
  const [editMode, setEditMode] = useState(false);
  const [floatAnimation, setFloatAnimation] = useState(true);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWTToken}`
      }
    }).then((res) => {
      if (!res.ok) {
        setLoading(false)
        setError(true);
        throw new Error('User details not fetched')
      } else {
        return res.json();
      }
    }).then((res) => {
      setLoading(false)
      setDetails({
        username: res.data.user.name,
        email: res.data.user.email,
        stream: res.data.user.streamId.streamName,
        institution: res.data.user.institutionId.name
      })
    }).catch((err) => {
      setLoading(false)
      setError(true)
      console.log("Error raised during user details fetch: ", err)
    })
  }, [JWTToken])

  const handleEditedDataSubmit = () => {
    setEditMode(false)
  }

  if (loading) return <div className="">Loading...</div>
  if (error) return <div className="">Error Raised</div>

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
        className="relative bg-black/70 backdrop-blur-xl rounded-3xl p-12 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl border border-white/30 z-10"
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
            <div className="flex flex-col">
              <label className="uppercase text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name='Name'
                value={details.username}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-3 py-2 rounded-lg border border-gray-500 
                  bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
              />
            </div>
            <div className="flex flex-col">
              <label className="uppercase text-gray-300 mb-1">EMail</label>
              <input
                type="email"
                name='email'
                value={details.email}
                onChange={handleChange}
                readOnly={false}
                className={`w-full px-3 py-2 rounded-lg border border-gray-500 
                  bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                  cursor-not-allowed`}
              />
            </div>
            <div className="flex flex-col">
              <label className="uppercase text-gray-300 mb-1">Stream</label>
              <input
                type="text"
                name='Name'
                value={details.stream}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-3 py-2 rounded-lg border border-gray-500 
                  bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
              />
            </div>
            <div className="flex flex-col">
              <label className="uppercase text-gray-300 mb-1">Institution</label>
              <input
                type="text"
                name='Name'
                value={details.institution}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-3 py-2 rounded-lg border border-gray-500 
                  bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
              />
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          {editMode ? (
            <>
              <motion.button
                onClick={() => handleEditedDataSubmit()}
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
      <div className="other-links w-full flex justify-evenly items-center p-10">
        <a className="profile-links" href="/user/quizzes">My Quizzes</a>
        <a className="profile-links" href="/create/quiz">Create Quiz</a>
        <a className="profile-links" href="/leaderboard">Leaderboard</a>
      </div>
      </motion.div>
    </div>
  );
};

export default Profile;


















