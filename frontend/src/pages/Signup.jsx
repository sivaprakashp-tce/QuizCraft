import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { replace, useNavigate } from "react-router-dom"; // for navigation
import { websiteLogo } from "../assets";
import { setJWTToken } from "../utils";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registered, setRegistered] = useState(false);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState(null);
  const [streams, setStreams] = useState(null);
  const [instutionLoading, setInstitutionLoading] = useState(true);
  const [streamLoading, setStreamLoading] = useState(true);
  const [error, setError] = useState(false);
  const [emailAlreadyPresent, setEmailAlreadyPresent] = useState(false);

  if (localStorage.getItem("token")) {
    navigate("/dashboard", replace);
  }

  const onSubmit = (data) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((res) => {
            if (res.error === "USER_EXISTS") {
              setEmailAlreadyPresent(true);
              throw new Error("Email has already been used");
            } else {
              throw new Error("Signup Failed");
            }
          });
        }
      })
      .then((res) => {
        setJWTToken(res.token);
        setRegistered(true);
      })
      .catch((err) => {
        console.log(err);
      });
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/institutions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
          throw new Error("Institutions Not fetched");
        }
        return res.json();
      })
      .then((res) => {
        setInstitutions(res.data.institutions);
        setInstitutionLoading(false);
      })
      .catch((err) => console.log("Error Found: ", err));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/streams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
          throw new Error("Streams Not fetched");
        }
        return res.json();
      })
      .then((res) => {
        setStreams(res.data.streams);
        setStreamLoading(false);
      })
      .catch((err) => console.log("Error Found: ", err));
  }, []);

  if (instutionLoading || streamLoading)
    return <div className="">Loading...</div>;

  if (error) return <div className="">Error. Please try again!</div>;

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
                {...register("name", {
                  required: "Username is required",
                })}
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
                {...register("email", {
                  required: "Email is required",
                })}
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
                  minLength: {
                    value: 8,
                    message: "Min 8 characters",
                  },
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
                {...register("institutionId", {
                  required: "Institution is required",
                })}
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              >
                <option value="" selected disabled>
                  Select Institution
                </option>
                {institutions.map((institution) => (
                  <option value={institution._id} key={institution._id}>
                    {institution.name}
                  </option>
                ))}
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
                {...register("streamId", {
                  required: "Stream is required",
                })}
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#D4A981] focus:outline-none focus:ring-2 focus:ring-[#D4A981]"
              >
                <option value="" disabled selected>
                  Select Stream
                </option>
                {streams.map((stream) => (
                  <option value={stream._id} key={stream._id}>
                    {stream.streamName}
                  </option>
                ))}
              </select>
              {errors.stream && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stream.message}
                </p>
              )}
            </div>

            {emailAlreadyPresent && (
              <div className="border-2 rounded-xl border-red-400 bg-red-200 text-red-700 font-medium p-5">
                <h4 className="">
                  Another account with the given E-mail exists. <br />
                  Please try again with another E-Mail.
                </h4>
              </div>
            )}

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
                    animate={{
                      y: window.innerHeight + 50,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                    }}
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
                className="mt-6 px-6 py-2 bg-[#D4A981] text-black font-semibold rounded-lg hover:bg-[#c99767] transition"
                onClick={() => navigate("/quiz")}
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
