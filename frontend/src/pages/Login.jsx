import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import websiteLogo from "../assets/websiteLogo.svg";
import FallingLetters from "../components/FallingLetters";
import { Link } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <header className="p-0.5 w-full h-full bg-black min-h-screen text-white relative overflow-hidden">
      {/* Background Animation */}
      <FallingLetters />

      {/* Logo */}
      <div className="p-4 relative z-10">
        <img
          src={websiteLogo}
          alt="QuizCraft Logo"
          className="w-30 h-30 rounded-full hover:border-2 border-white"
        />
      </div>

      {/* Login Section */}
      <div className="relative z-10">
        <div className="flex justify-center items-center text-4xl mb-6 font-bold">
          Login
        </div>

        <div className="flex justify-center items-center">
          {/* Left: Login Form */}
          <div className="w-[300px] h-[350px] border-2 border-gray-600 p-4 rounded-lg bg-black bg-opacity-70">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-500 
                             bg-transparent text-white focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-500 
                               bg-transparent text-white focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 text-black rounded-lg bg-[#AD8B70] hover:bg-white
                           transition-colors font-bold"
              >
                Sign In
              </button>
              <p className="text-sm text-center text-gray-400 hover:text-white">
                Don’t have an account?{" "}
                <Link to="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          {/* Right: Image */}
          <div className="w-[300px] h-[350px] border-2 border-gray-600 flex items-center justify-center rounded-lg bg-black bg-opacity-70">
            <img
              src={websiteLogo}
              alt="QuizCraft Logo"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Login;
