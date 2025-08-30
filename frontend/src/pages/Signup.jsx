import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // for navigation
import {websiteLogo} from "../assets";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registered, setRegistered] = useState(false);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  const onSubmit = () => {
    setRegistered(true);
  };

  // Generate falling "QUIZCRAFT" letters
  useEffect(() => {
    if (registered) {
      const interval = setInterval(() => {
        const word = "QUIZCRAFT";
        const char = word[Math.floor(Math.random() * word.length)];
        setLetters((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            char,
            x: Math.random() * window.innerWidth,
          },
        ]);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [registered]);

  return (
    <header className="p-0.5 w-full h-full bg-black min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="p-4 relative z-10">
        <img
          src={websiteLogo}
          alt="QuizCraft Logo"
          className="w-28 h-28 rounded-full hover:border-2 border-white"
        />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center flex-grow relative">
        <div
          className={`border-2 border-[#D4A981] w-[500px] p-8 rounded-2xl bg-black/40 shadow-lg transition-all duration-500 ${
            registered ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <h1 className="text-4xl mb-6 font-bold text-center text-[#D4A981]">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block mb-1 text-sm">Username</label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
                className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label className="block mb-1 text-sm">Institution</label>
              <select
                {...register("institution", {
                  required: "Institution is required",
                })}
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              >
                <option value="">Select Institution</option>
                <option value="Harvard">Harvard University</option>
                <option value="TCE">Thiagarajar College of Engineering</option>
              </select>
              {errors.institution && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.institution.message}
                </p>
              )}
            </div>

            {/* Stream */}
            <div>
              <label className="block mb-1 text-sm">Stream</label>
              <select
                {...register("stream", { required: "Stream is required" })}
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              >
                <option value="">Select Stream</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="DS">Data Science</option>
              </select>
              {errors.stream && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stream.message}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D4A981] text-black font-bold rounded-lg hover:bg-[#c99767] transition"
            >
              Register
            </button>
          </form>
        </div>

        {/* Success Popup */}
        <AnimatePresence>
          {registered && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-md overflow-hidden"
            >
              {/* Falling QUIZCRAFT Letters */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {letters.map((l) => (
                  <motion.span
                    key={l.id}
                    initial={{ x: l.x, y: -50, opacity: 1 }}
                    animate={{ y: window.innerHeight + 50, opacity: 0 }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute text-white text-lg font-bold"
                  >
                    {l.char}
                  </motion.span>
                ))}
              </div>

              {/* Success Message */}
              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-3xl font-bold text-[#D4A981] mt-10"
              >
                Registration Complete!
              </motion.h2>

              {/* Continue Button */}
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 px-6 py-2 bg-[#D4A981] text-white font-semibold rounded-lg hover:bg-[#c99767] transition"
                onClick={() => navigate("/dashboard")}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Signup;
