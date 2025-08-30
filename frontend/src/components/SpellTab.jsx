import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";

// ---------------------- Spell Animations ----------------------
const SpellAnimations = ({ spell, onComplete }) => {
    useEffect(() => {
        if (spell) {
            const timer = setTimeout(() => {
                onComplete(); // clear after animation ends
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [spell, onComplete]);

    if (!spell) return null;

    return (
        <div className="fixed inset-0 pointer-events-none flex justify-center items-center z-40">

            {/* Lumos: glowing white orb */}
            {spell === "lumos" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: [0, 1, 0.8, 0.6, 0.9, 0.7], 
                        scale: [0.5, 1.2, 1.5] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                    className="w-40 h-40 rounded-full bg-white blur-3xl shadow-[0_0_80px_rgba(255,255,255,0.95)]"
                />
            )}

            {/* Lumos Maxima: intense flash of light */}
            {spell === "lumos maxima" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{
                        opacity: [0, 1, 0.9, 0],
                        scale: [0.2, 3, 4, 0],
                    }}
                    transition={{ duration: 2 }}
                    className="w-96 h-96 rounded-full bg-white blur-3xl shadow-[0_0_200px_rgba(255,255,255,1)]"
                />
            )}

            {/* Nox: darkness overlay */}
            {spell === "nox" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0.9, 0] }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-black"
                />
            )}

            {/* Incendio: Realistic fiery explosion */}
            {spell === "incendio" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Central rising core of the flame - less of a circle, more of an upward burst */}
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0.1, scaleX: 0.8, y: 100 }} // Start low, thin, and wide
                        animate={{
                            opacity: [0, 0.9, 0.7, 0], // Burst then fade
                            scaleY: [0.1, 1.2, 0.8], // Grow upwards, then settle/dissipate
                            scaleX: [0.8, 1, 0.9], // Slightly expand horizontally
                            y: [100, -50, -100], // Rise significantly
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute w-40 h-40 rounded-full bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300 blur-xl opacity-0"
                        style={{
                            transformOrigin: 'bottom center', // Ensure it scales from the bottom
                            boxShadow: "0 0 100px 40px rgba(255,100,0,0.9), 0 0 180px 80px rgba(255,180,50,0.7)"
                        }}
                    />

                    {/* Individual flame particles - these form the bulk of the flickering fire */}
                    {[...Array(60)].map((_, i) => ( // Increased particles for density and detail
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0.8,
                                y: 80, // Start close to the base
                                x: (Math.random() - 0.5) * 60, // Start clustered horizontally
                                scale: 0.4 + Math.random() * 0.6, // Varied small initial sizes
                                rotate: Math.random() * 360,
                                filter: `blur(${1 + Math.random() * 3}px)` // Initial blur for soft start
                            }}
                            animate={{
                                opacity: [0.8, 1, 0.6, 0], // Flicker and fade
                                y: [80, -50 - Math.random() * 200, -250 - Math.random() * 150], // Rise and dissipate, with more upward motion
                                x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300], // More erratic horizontal drift
                                scale: [0.8, 1.2 + Math.random() * 1, 0.5], // Grow then shrink
                                rotate: [Math.random() * 360, Math.random() * 360 + 180], // Continue rotation for turbulence
                                filter: [`blur(${1 + Math.random() * 3}px)`, `blur(${0 + Math.random() * 2}px)`, `blur(${5 + Math.random() * 5}px)`] // Dynamic blurring for heat haze
                            }}
                            transition={{
                                duration: 1.5 + Math.random() * 0.8, // Varied duration for natural look
                                ease: "easeOut",
                                delay: Math.random() * 0.3 // Staggered start
                            }}
                            className={`absolute rounded-full`} // No pre-defined size for more variability
                            style={{
                                width: `${8 + Math.random() * 18}px`, // Dynamic width
                                height: `${8 + Math.random() * 25}px`, // Dynamic height (can be taller than wide)
                                backgroundColor: [
                                    "#FF4500", // Red-orange
                                    "#FF8C00", // Dark Orange
                                    "#FFA500", // Orange
                                    "#FFD700", // Gold
                                    "#FFFF00", // Yellow
                                    "#FFFACD", // Near white for hottest parts
                                ][Math.floor(Math.random() * 6)],
                                boxShadow: `0 0 ${15 + Math.random() * 25}px rgba(255,140,0,0.9)` // Varied glow for each particle
                            }}
                        />
                    ))}

                    {/* Smoke/embers rising (subtle dark elements) */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`smoke-${i}`}
                            initial={{ opacity: 0, y: 150, scale: 0.3 }}
                            animate={{
                                opacity: [0, 0.15, 0], // Faint, quick appearance
                                y: [150, -100 - Math.random() * 100], // Rise slowly
                                x: (Math.random() - 0.5) * 100,
                                scale: [0.3, 0.8 + Math.random() * 0.5],
                                filter: [`blur(${5 + Math.random() * 5}px)`, `blur(${10 + Math.random() * 10}px)`]
                            }}
                            transition={{ duration: 2 + Math.random() * 1, delay: 0.5 + Math.random() * 0.5, ease: "easeOut" }}
                            className="absolute w-10 h-10 rounded-full bg-gray-800 opacity-0"
                            style={{ boxShadow: "0 0 5px rgba(0,0,0,0.5)" }}
                        />
                    ))}
                </div>
            )}

           {/* Expelliarmus: forceful magical blast effect */}
            {spell === "expelliarmus" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Core intense magical energy - more dynamic and concentrated */}
                    <motion.div
                        initial={{ scale: 0.1, opacity: 0 }}
                        animate={{ scale: [0.1, 1.5, 0.8], opacity: [0, 1, 0.5, 0] }} // Faster expansion, quick fade
                        transition={{ duration: 0.5, ease: "easeOut" }} // Shorter duration for impact
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 via-orange-400 to-red-600 blur-3xl opacity-0
                                   shadow-[0_0_180px_60px_rgba(255,200,0,0.9),_0_0_300px_100px_rgba(255,100,0,0.7)]" // Enhanced shadow
                    />

                    {/* Concentric rings of outward force - more defined and faster */}
                    {[...Array(4)].map((_, i) => ( // More rings for a fuller effect
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 3], opacity: [1, 0] }} // Expand further and fade faster
                            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }} // Shorter duration, tighter delay
                            className="absolute w-24 h-24 rounded-full border-4 border-yellow-300 opacity-0
                                       shadow-[0_0_60px_rgba(255,230,150,0.9)]" // Brighter shadow
                        />
                    ))}

                    {/* Disarming flash (brief and impactful) - more blinding */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.1, delay: 0.05, ease: "easeOut" }} // Very quick flash
                        className="absolute w-full h-full bg-white opacity-0" // Removed mix-blend-overlay for a starker flash
                        style={{ filter: "blur(40px)" }} // Added blur for a more ethereal, blinding effect
                    />

                    {/* Debris/sparkle effect (for a magical impact) - more numerous and energetic */}
                    {[...Array(30)].map((_, i) => ( // More particles for a richer effect
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                            animate={{
                                x: (Math.random() - 0.5) * 400, // Greater spread
                                y: (Math.random() - 0.5) * 400,
                                opacity: [1, 0],
                                scale: [0.5, 1.5], // Grow slightly as they move
                            }}
                            transition={{ duration: 0.5 + Math.random() * 0.2, delay: 0.1 + i * 0.015, ease: "easeOut" }} // Faster, more varied duration and delay
                            className="absolute w-1 h-1 bg-yellow-50 rounded-full blur-sm" // Lighter core color for sparks
                            style={{
                                boxShadow: `0 0 15px rgba(255,255,200,0.9), 0 0 30px rgba(255,200,0,0.7)` // Brighter, larger glow
                            }}
                        />
                    ))}

                    {/* Additional streaky particles for more motion blur feel */}
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={`streak-${i}`}
                            initial={{ x: 0, y: 0, opacity: 0, scaleY: 0.1 }}
                            animate={{
                                x: (Math.random() - 0.5) * 350,
                                y: (Math.random() - 0.5) * 350,
                                opacity: [0, 0.8, 0],
                                scaleY: [0.1, 1],
                                rotate: Math.random() * 360,
                            }}
                            transition={{ duration: 0.4 + Math.random() * 0.2, delay: 0.15 + i * 0.03, ease: "easeOut" }}
                            className="absolute w-1 h-10 bg-white blur-sm opacity-0"
                            style={{
                                boxShadow: "0 0 10px rgba(255,255,255,0.7)"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Wingardium Leviosa: floating owl feather */}
            {spell === "wingardium leviosa" && (
                <motion.img
                    src="/src/assets/White_Feather.svg"   // from public folder
                    alt="Owl Feather"
                    initial={{ y: 200, opacity: 0, rotate: 0 }}
                    animate={{
                        y: -250,
                        opacity: [0, 1, 0],
                        x: [0, 80, -80, 60, -60, 0],   // stronger right-left sway
                        rotate: [0, 10, -10, 8, -8, 0], // gentle tilt like floating
                    }}
                    transition={{ duration: 6, ease: "easeInOut" }}
                    className="w-80 h-80 object-contain drop-shadow-lg" // big + soft glow
                />
            )}

            {/* Expecto Patronum: Patronus deer with glowing effect */}
            {spell === "expecto patronum" && (
            <motion.div
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Glowing aura behind */}
                <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: [0.5, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                className="absolute w-96 h-96 rounded-full bg-blue-400 blur-3xl shadow-[0_0_120px_rgba(180,220,255,0.9)]"
                />

                {/* Patronus deer image */}
                <motion.img
                src="/src/assets/Patronus_Deer.svg"   // 👉 Put a glowing deer silhouette PNG/SVG in your public folder
                alt="Patronus Deer"
                className="w-80 drop-shadow-[0_0_25px_rgba(200,240,255,0.9)]"
                initial={{ rotate: -5 }}
                animate={{ rotate: [ -5, 5, -5 ], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
            )}


            {/* Avada Kedavra – The Killing Curse: Central Flash followed by 5-Second Full Screen Green Overlay */}
            {spell === "avada kedavra" && (
            <motion.div
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden" // Main container for all effects
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05 }} // Near-instantaneous appearance of the initial effect
            >
                {/* Initial Quick Central Green Flash - this is the only active visual effect before the screen goes fully green */}
                <motion.div
                    initial={{ scale: 0.05, opacity: 0 }}
                    animate={{ scale: [0.05, 1.2, 0.8], opacity: [0, 1, 0.7, 0] }} // Quick, powerful expansion and fade
                    transition={{ duration: 0.2, ease: "easeOut" }} // This flash lasts only 0.2 seconds
                    className="absolute w-24 h-24 rounded-full bg-green-300 blur-3xl opacity-0"
                    style={{ boxShadow: "0 0 150px 50px rgba(0,255,0,1), 0 0 250px 100px rgba(0,200,0,0.8)" }} // Overwhelming green light
                />

                {/* Full-Screen Deadly Green Overlay (5 seconds) - appears immediately after the initial flash and dominates */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }} // Fades in, stays at 1 for duration, then fades out
                    // Starts *after* the initial flash (approx. 0.2s) and lasts for the remainder of 5s
                    transition={{ duration: 5, times: [0, 0.04, 0.96, 1], ease: "linear", delay: 0.2 }}
                    className="absolute inset-0 bg-green-600 opacity-0" // The solid green background
                />
            </motion.div>
            )}


            {/* Accio: High-Resolution, Clear Pull Effect */}
            {spell === "accio" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Central point of attraction - a more defined, crisp pulse */}
                    <motion.div
                        initial={{ scale: 0.1, opacity: 0 }}
                        animate={{ scale: [0.1, 0.9, 0.7, 1.1], opacity: [0, 1, 0.8, 0] }} // Stronger, clearer pulse
                        transition={{ duration: 1.2, ease: "easeOut" }} // Slightly faster for sharpness
                        className="absolute w-24 h-24 rounded-full bg-purple-200 blur-lg opacity-0" // Reduced blur, brighter base color
                                   // Stronger, clearer shadow without excessive blur
                        style={{ boxShadow: "0 0 100px 30px rgba(200,150,255,1), 0 0 200px 60px rgba(150,100,255,0.8)" }}
                    />

                    {/* Numerous, highly visible, fast-moving converging magical streaks/trails */}
                    {[...Array(80)].map((_, i) => ( // Increased count for much denser, more substantial trails
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                scaleX: 0.05, // Start as very thin, long streaks
                                x: (Math.random() - 0.5) * 800, // Start much farther out for longer trails
                                y: (Math.random() - 0.5) * 800,
                                rotate: Math.random() * 360,
                            }}
                            animate={{
                                opacity: [0, 1, 0.9, 0], // Appear sharply, maintain visibility, then fade
                                scaleX: [0.05, 1.5, 0.3], // Streaks get very long and prominent, then shorten at center
                                x: [
                                    (Math.random() - 0.5) * 800, // Initial random start
                                    (Math.random() - 0.5) * 150, // Converge closer
                                    0 // Meet sharply at the center
                                ],
                                y: [
                                    (Math.random() - 0.5) * 800,
                                    (Math.random() - 0.5) * 150,
                                    0
                                ],
                            }}
                            transition={{
                                duration: 1 + Math.random() * 0.6, // Slightly longer, varied speed for clear movement
                                delay: Math.random() * 0.6, // Staggered entry
                                ease: "easeIn" // Accelerate rapidly towards the center
                            }}
                            className="absolute h-3 w-60 rounded-full bg-gradient-to-r from-transparent via-purple-300 to-blue-200 blur-xs opacity-0" // Wider, longer streaks, significantly reduced blur
                            style={{
                                transformOrigin: 'center center', // Rotate around its center
                                boxShadow: `0 0 20px rgba(200,150,255,1), 0 0 40px rgba(150,100,255,0.9)` // Clearer, brighter glow
                            }}
                        />
                    ))}

                    {/* Final sharp, bright flash at the moment of convergence/arrival */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.1, 1.5, 1] }} // Stronger, larger final flash
                        transition={{ duration: 0.2, delay: 1.2, ease: "easeOut" }} // Appears after most streaks converge
                        className="absolute w-20 h-20 rounded-full bg-white blur-xl opacity-0" // Brighter, clearer flash
                        style={{ boxShadow: "0 0 80px rgba(255,255,255,1)" }} // Very intense white glow
                    />
                </div>
            )}

            {/* Crucio: red-black crackling curse */}
            {spell === "crucio" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Central pulsating red energy */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0.7, 0.9, 0], scale: [0.5, 1.2] }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-40 h-40 rounded-full bg-red-800 blur-3xl"
                        style={{ boxShadow: `0 0 80px 20px rgba(255,0,0,0.8), 0 0 150px 50px rgba(100,0,0,0.6)` }}
                    />

                    {/* Chaotic, fast-moving black and red particles */}
                    {[...Array(70)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                                x: 0,
                                y: 0
                            }}
                            animate={{
                                opacity: [0, 1, 0.5, 0],
                                scale: [0.5, 1.2],
                                x: (Math.random() - 0.5) * 400,
                                y: (Math.random() - 0.5) * 400
                            }}
                            transition={{ duration: 1 + Math.random(), delay: i * 0.02, ease: "easeOut" }}
                            className={`absolute w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-red-900' : 'bg-black'} blur-sm`}
                            style={{ boxShadow: `0 0 10px rgba(0,0,0,0.8)` }}
                        />
                    ))}
                </div>
            )}

            {/* Petrificus Totalus: grey frozen figure */}
            {spell === "petrificus totalus" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* The core figure that hardens */}
                    <motion.div
                        initial={{ opacity: 1, color: '#f3f4f6' }} // Light gray/white start
                        animate={{
                            opacity: [1, 0.8, 1, 0],
                            color: ['#f3f4f6', '#9ca3af', '#6b7280'], // Fade to a solid gray/stone color
                            scale: [1, 1.1, 1.2],
                        }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="text-7xl drop-shadow-[0_0_20px_silver]"
                    >
                        🗿
                    </motion.div>

                    {/* "Cracking" line particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                scaleX: 0.05,
                                x: (Math.random() - 0.5) * 300,
                                y: (Math.random() - 0.5) * 300,
                                rotate: Math.random() * 360,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scaleX: [0.05, 1, 0.8],
                                x: (Math.random() - 0.5) * 200,
                                y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                            className="absolute h-1 w-10 bg-gray-400 opacity-0 rounded-full"
                        />
                    ))}
                </div>
            )}

            {/* Stupefy: stunning red flash */}
            {spell === "stupefy" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Central intense red core */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 2, 3], opacity: [1, 0.7, 0] }}
                        transition={{ duration: 1 }}
                        className="absolute w-32 h-32 rounded-full bg-red-500 blur-2xl shadow-[0_0_50px_rgba(255,0,0,0.9)]"
                    />

                    {/* Concentric red shockwaves */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: [0, 4], opacity: [1, 0] }}
                            transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                            className="absolute w-40 h-40 rounded-full border-4 border-red-400 opacity-0"
                        />
                    ))}

                    {/* Outward streaking particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                            animate={{
                                x: (Math.random() - 0.5) * 500,
                                y: (Math.random() - 0.5) * 500,
                                opacity: [1, 0],
                                scale: [0.5, 1.5],
                            }}
                            transition={{ duration: 0.8 + Math.random() * 0.4, delay: i * 0.03, ease: "easeOut" }}
                            className="absolute w-1 h-1 bg-red-200 rounded-full blur-sm"
                            style={{ boxShadow: `0 0 10px rgba(255,150,150,0.9)` }}
                        />
                    ))}
                </div>
            )}

            {/* Riddikulus: funny balloon pop */}
            {spell === "riddikulus" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* The balloon itself */}
                    <motion.div
                        initial={{ y: 100, scale: 0, opacity: 1 }}
                        animate={{
                            y: -200,
                            scale: [0, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            onComplete: () => {
                                // Pop animation starts
                            }
                        }}
                        className="text-6xl absolute"
                    >
                        🎈
                    </motion.div>

                    {/* Pop and confetti animation */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                scale: 0,
                                y: -200,
                                x: 0
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0.8],
                                y: [-200, -250 - Math.random() * 50],
                                x: (Math.random() - 0.5) * 200,
                            }}
                            transition={{
                                duration: 1.5,
                                delay: 2.1 + i * 0.03,
                                ease: "easeOut"
                            }}
                            className={`absolute w-3 h-3 rounded-full ${Math.random() > 0.5 ? 'bg-pink-400' : 'bg-yellow-200'}`}
                        />
                    ))}
                </div>
            )}

            {/* Reparo: shattered glass pieces reform */}
            {spell === "reparo" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: (Math.random() - 0.5) * 400,
                                y: (Math.random() - 0.5) * 400,
                                opacity: 0,
                                scale: 0.5
                            }}
                            animate={{
                                x: 0,
                                y: 0,
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.05,
                                ease: "easeIn"
                            }}
                            className="absolute w-6 h-6 bg-blue-200 rounded-sm shadow-[0_0_15px_skyblue]"
                            style={{
                                transformOrigin: "center"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Imperio: hypnotic green swirl */}
            {spell === "imperio" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: [0, 2, 1.5], rotate: 360 * (i + 1) }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                            className="absolute w-40 h-40 rounded-full bg-green-400/80 blur-xl"
                            style={{
                                boxShadow: "0 0 70px rgba(0,255,150,0.9)",
                                border: `2px solid rgba(0,255,150,0.5)`,
                                transform: "scale(0) rotate(0)"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Confringo: fiery explosion */}
            {spell === "confringo" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Central explosive core */}
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: [0, 3, 5], opacity: [1, 0.8, 0] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute w-48 h-48 rounded-full bg-orange-500 blur-3xl shadow-[0_0_100px_rgba(255,120,0,0.9)]"
                    />

                    {/* Fast, chaotic fire particles */}
                    {[...Array(60)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                x: 0,
                                y: 0,
                                scale: 0.5
                            }}
                            animate={{
                                opacity: [0, 1, 0.5, 0],
                                scale: [0.5, 1.2],
                                x: (Math.random() - 0.5) * 600,
                                y: (Math.random() - 0.5) * 600
                            }}
                            transition={{ duration: 0.8 + Math.random() * 0.4, delay: i * 0.02, ease: "easeOut" }}
                            className={`absolute w-3 h-3 rounded-full ${Math.random() > 0.5 ? 'bg-red-500' : 'bg-yellow-300'} blur-sm`}
                            style={{ boxShadow: `0 0 10px rgba(255,100,0,0.8)` }}
                        />
                    ))}
                </div>
            )}

            {/* Ascendio: person flying up */}
            {spell === "ascendio" && (
                <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                    {/* Person with a slight float and upward movement */}
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{
                            y: -300,
                            opacity: [0, 1, 0.9, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3 }}
                        className="text-7xl absolute"
                    >
                        🧍‍♂️
                    </motion.div>

                    {/* Trailing light particles */}
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                y: 200,
                                opacity: 0,
                                scale: 0.5
                            }}
                            animate={{
                                y: [-100, -300],
                                opacity: [0.5, 1, 0],
                                scale: [0.5, 1],
                                x: (Math.random() - 0.5) * 50
                            }}
                            transition={{ duration: 2.5 + Math.random(), delay: i * 0.05, ease: "easeOut" }}
                            className="absolute w-2 h-2 rounded-full bg-white blur-sm"
                            style={{ boxShadow: "0 0 15px rgba(255,255,255,0.8)" }}
                        />
                    ))}
                </div>
            )}

            {/* Default unknown spell */}
            {spell === "unknown" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 2 }}
                    className="text-2xl font-bold text-red-600"
                >
                    ❓ Unknown Spell!
                </motion.div>
            )}
        </div>
    );
};

// ---------------------- Spell Input Tab ----------------------
const SpellTab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [spell, setSpell] = useState("");
    const [activeSpell, setActiveSpell] = useState(null);

    const castSpell = () => {
        const spellKey = spell.toLowerCase().trim();
        if (
            [
            "lumos",
            "lumos maxima",
            "nox",
            "incendio",
            "expelliarmus",
            "wingardium leviosa",
            "expecto patronum",
            "avada kedavra",
            "accio",
            "crucio",
            "petrificus totalus",
            "stupefy",
            "riddikulus",
            "reparo",
            "imperio",
            "confringo",
            "ascendio"
            ].includes(
                spellKey
            )
        ) {
            setActiveSpell(spellKey);
        } else {
            setActiveSpell("unknown");
        }
        setSpell("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Magical animations */}
            <SpellAnimations spell={activeSpell} onComplete={() => setActiveSpell(null)} />

            {/* Input box */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="spellbox"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg flex gap-2"
                    >
                        <input
                        type="text"
                        value={spell}
                        onChange={(e) => setSpell(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") castSpell();
                        }}
                        placeholder="Type a spell..."
                        className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black bg-white"
                        />
                        <button
                            onClick={castSpell}
                            className="bg-amber-400 hover:bg-amber-500 text-black px-3 py-1 rounded-md text-sm font-bold"
                        >
                            Cast
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-xl"
            >
                <Wand2 className="w-6 h-6" />
            </button>
        </div>
    );
};

export default SpellTab;