import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { websiteLogo } from "../assets";
import { useNavigate } from "react-router-dom";
import { getJWTToken } from "../utils";
import { useForm } from "react-hook-form";

const Profile = () => {
  const navigate = useNavigate();
  const JWTToken = getJWTToken();
  const [userId, setUserId] = useState(null)
  const [editMode, setEditMode] = useState(false);
  const [floatAnimation, setFloatAnimation] = useState(true);
  const [institutions, setInstitutions] = useState(null);
  const [streams, setStreams] = useState(null);
  const [instutionLoading, setInstitutionLoading] = useState(true);
  const [streamLoading, setStreamLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [details, setDetails] = useState({
    username: "John Doe",
    email: "user@email.com",
    stream: "Computer Science",
    institution: "MIT",
    stars: 0,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

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

  // Fetch user details and populate form fields
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWTToken}`
          }
        });
        if (!res.ok) {
          setError(true);
          throw new Error('User details not fetched');
        }
        const data = await res.json();
        setUserId(data.data.user._id)
        setDetails({
          username: data.data.user.name,
          email: data.data.user.email,
          stream: data.data.user.streamId._id,
          institution: data.data.user.institutionId._id,
          stars: data.data.user.starsGathered
        });
        // Populate form fields with fetched data
        setValue('name', data.data.user.name);
        setValue('streamId', data.data.user.streamId._id);
        setValue('institutionId', data.data.user.institutionId._id);
        sessionStorage.setItem("user", JSON.stringify(details));
      } catch (err) {
        console.log("Error raised during user details fetch: ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [JWTToken, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch streams and institutions
  useEffect(() => {
    const fetchStreamsAndInstitutions = async () => {
      try {
        const [streamsRes, institutionsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/streams`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/institutions`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
        ]);

        if (!streamsRes.ok || !institutionsRes.ok) {
          throw new Error("Failed to fetch streams or institutions");
        }

        const streamsData = await streamsRes.json();
        const institutionsData = await institutionsRes.json();

        setStreams(streamsData.data.streams);
        setInstitutions(institutionsData.data.institutions);
      } catch (err) {
        console.log("Error fetching streams and institutions: ", err);
        setError(true);
      } finally {
        setStreamLoading(false);
        setInstitutionLoading(false);
      }
    };

    fetchStreamsAndInstitutions();
  }, []);

  const handleEditedDataSubmit = (data) => {
    setUpdating(true);
    setError(false);

    const updateData = {
      name: data.name,
      streamId: data.streamId,
      institutionId: data.institutionId
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWTToken}`
      },
      body: JSON.stringify(updateData)
    })
    .then((res) => {
      if (!res.ok) {
        setUpdating(false);
        setError(true);
        throw new Error('Profile update failed');
      } else {
        return res.json();
      }
    })
    .then((res) => {
      setUpdating(false);
      setUpdateSuccess(true);
      setEditMode(false);
      
      // Update local state with new data
      setDetails({
        username: res.data.user.name,
        email: res.data.user.email,
        stream: res.data.user.streamId._id,
        institution: res.data.user.institutionId._id,
        stars: res.data.user.starsGathered
      });

      // Show success message briefly
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    })
    .catch((err) => {
      setUpdating(false);
      setError(true);
      console.log("Error updating profile: ", err);
    });
  }

  const handleCancel = () => {
    setEditMode(false);
    setError(false);
    // Reset form to current values
    reset({
      name: details.username,
      streamId: details.stream,
      institutionId: details.institution,
    });
  }

  if (loading || instutionLoading || streamLoading) {
    return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-gray-300 bg-black">Loading...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-500 bg-black">Error Raised</div>;
  }

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
        className="relative bg-black/70 backdrop-blur-xl rounded-3xl p-10 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl border border-white/30 z-10"
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
        <div className="flex justify-center mt-4 gap-2 font-bold text-xl items-center">
            <Star fill="#ffff00" stroke="black" /> {details.stars}
        </div>

        {/* Profile Fields */}
        <div className="">
            <form id="profile-form" onSubmit={handleSubmit(handleEditedDataSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 m-10 text-white text-lg">
                <div className="flex flex-col">
                  <label className="uppercase text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    {...register("name", {
                        required: "Username is required",
                    })}
                    defaultValue={details.username}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-500
                      bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
                  />
                  {errors.name && (
                    <span className="text-red-400 text-sm mt-1">{errors.name.message}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="uppercase text-gray-300 mb-1">EMail</label>
                  <input
                    type="email"
                    value={details.email}
                    readOnly
                    className={`w-full px-3 py-2 rounded-lg border border-gray-500
                      bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                      cursor-not-allowed`}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="uppercase text-gray-300 mb-1">Stream</label>
                  <select
                    disabled={!editMode}
                    {...register("streamId", {
                      required: "Stream is required",
                    })}
                    defaultValue={details.stream}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-500
                      bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
                  >
                    {streams?.map((stream) => (
                      <option value={stream._id} key={stream._id}>
                        {stream.streamName}
                      </option>
                    ))}
                  </select>
                  {errors.streamId && (
                    <span className="text-red-400 text-sm mt-1">{errors.streamId.message}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="uppercase text-gray-300 mb-1">Institution</label>
                  <select
                    disabled={!editMode}
                    {...register("institutionId", {
                      required: "Institution is required",
                    })}
                    defaultValue={details.institution}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-500
                      bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${!editMode ? "cursor-not-allowed" : "bg-black/70"}`}
                  >
                    {institutions?.map((institution) => (
                      <option value={institution._id} key={institution._id}>
                        {institution.name}
                      </option>
                    ))}
                  </select>
                  {errors.institutionId && (
                    <span className="text-red-400 text-sm mt-1">{errors.institutionId.message}</span>
                  )}
                </div>
            </form>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col items-center gap-4">
          {updateSuccess && (
            <div className="text-green-400 text-center">
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="text-red-400 text-center">
              Failed to update profile. Please try again.
            </div>
          )}
          <div className="flex gap-6">
            {editMode ? (
              <>
                <motion.button
                  type="button"
                  onClick={handleSubmit(handleEditedDataSubmit)}
                  disabled={updating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={updating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-500 text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => setEditMode(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg cursor-pointer"
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/attempts/${userId}`)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg cursor-pointer"
                >
                  My Attempts
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;