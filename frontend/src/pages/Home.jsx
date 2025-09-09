import { useEffect, useState } from "react";
import boyImage from "../assets/boy.svg";
import { websiteLogo } from "../assets";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbarhome from "../components/Navbarhome";
import { replace, useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const fullText = "QuizCraft";

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const hasLoaded = sessionStorage.getItem("hasLoaded");
    const [loading, setLoading] = useState(!hasLoaded);
    const [progress, setProgress] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [showHome, setShowHome] = useState(hasLoaded);

    // Parallax & Dynamic Motion Setup
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], ["0%", "30%"]);
    const castleY = useTransform(scrollY, [0, 500], ["0%", "15%"]);
    const fogY = useTransform(scrollY, [0, 500], ["0%", "5%"]);

    // Motion for the hero section, creating a "pull" effect
    const heroY = useTransform(scrollY, [0, 500], ["0%", "-50%"]);
    const heroOpacity = useTransform(scrollY, [0, 500], ["100%", "0%"]);

    // Mouse-based Parallax for hero section
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const springMouseX = useSpring(mousePosition.x, { damping: 100, stiffness: 500 });
    const springMouseY = useSpring(mousePosition.y, { damping: 100, stiffness: 500 });

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const x = clientX - window.innerWidth / 2;
        const y = clientY - window.innerHeight / 2;
        setMousePosition({ x, y });
    };

    // Calculate parallax offsets for hero text
    const textX = useTransform(springMouseX, [-window.innerWidth / 2, window.innerWidth / 2], ["-3%", "3%"]);
    const textY = useTransform(springMouseY, [-window.innerHeight / 2, window.innerHeight / 2], ["-3%", "3%"]);

    // NEW: Parallax for floating Marauder's Map
    const mapY = useTransform(scrollY, [0, 500], ["0%", "-50%"]);


    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        if (!loading && !hasLoaded) {
            let i = 0;
            const typing = setInterval(() => {
                setTypedText(fullText.slice(0, i + 1));
                i++;
                if (i === fullText.length) {
                    clearInterval(typing);
                    sessionStorage.setItem("hasLoaded", "true");
                    setTimeout(() => setShowHome(true), 1000);
                }
            }, 150);
            return () => clearInterval(typing);
        }
    }, [loading, hasLoaded]);

    return (
        <div className="relative w-full h-screen overflow-x-hidden" onMouseMove={handleMouseMove}>
            {showHome ? (
                <motion.div
                    className="relative min-h-screen bg-gradient-to-br from-black via-[#120f28] to-[#2c1e1e] overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Navbarhome />

                    {/* Background layers: Stars, Fog, and Castle */}
                    <motion.div
                        className="absolute inset-0 bg-[url('/bg-stars.png')] bg-cover bg-center opacity-20"
                        style={{ y: backgroundY }}
                    />
                    {/* Magical Fog layer */}
                    <motion.div
                        className="absolute inset-0 bg-[url('/magic-fog.png')] bg-contain bg-no-repeat bg-bottom opacity-50"
                        style={{ y: fogY, scale: 1.2 }}
                    />
                    {/* Hogwarts castle silhouette with more prominent parallax */}
                    <motion.div
                        className="absolute bottom-0 w-full h-1/2 md:h-2/3 bg-[url('/hogwarts-silhouette.png')] bg-contain bg-center bg-no-repeat"
                        style={{ y: castleY }}
                    />

                    {/* Floating magical particles (Embers) - More of them now! */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: 8,
                                height: 8,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                background: 'radial-gradient(circle, #ffe1a8 0%, #ffc47a 50%, transparent 100%)',
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}

                    {/* Changed: Marauder's Map SVG instead of the book, floating */}
                    <motion.img
                        src="/src/assets/MaraudersMap.svg" // Updated source to MaraudersMap.svg
                        alt="The Marauder's Map floating" // Updated alt text
                        className="absolute right-[-10%] top-[40%] md:right-[5%] md:top-[25%] w-1/2 md:w-1/4 z-10 filter drop-shadow-[0_0_15px_#C0C0C0]" // Adjusted shadow for map
                        style={{ y: mapY }} // Apply scroll parallax
                        animate={{
                            rotate: [0, 2, -2, 0], // Gentle rotation
                            x: [0, 15, -15, 0],   // Subtle floating motion
                            y: [0, -10, 10, 0],   // Added up/down motion
                        }}
                        transition={{
                            duration: 12, // Slightly longer duration for a subtle float
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Hero Section - now with subtle mouse parallax and scroll fade */}
                    <motion.div
                        className="flex flex-col items-center justify-center h-screen text-center relative z-20"
                        style={{ y: heroY, opacity: heroOpacity }}
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-bold text-[#E5C397] drop-shadow-lg font-serif"
                            style={{ x: textX, y: textY }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            Welcome to Wizarding World
                        </motion.h1>

                        <motion.p
                            className="mt-4 text-xl md:text-2xl text-gray-300 max-w-2xl font-sans"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            Take the quiz and find your place among the great houses of Hogwarts.
                        </motion.p>

                        <motion.button
                            onClick={() => navigate("/quiz")}
                            className="mt-8 px-8 py-3 bg-[#AD8B70] text-black font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform relative overflow-hidden group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            <span className="relative z-10">Enter the Great Hall</span>
                            <div className="absolute inset-0 bg-[url('/spell_particles.png')] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                        </motion.button>
                    </motion.div>

                    {/* Scroll-triggered "Spells" Section with reveal animation */}
                    <div className="relative py-20 px-6 md:px-20 z-10 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                            className="text-center"
                        >
                            <h2 className="text-4xl font-bold text-[#E5C397]">
                                The Secrets of the Quiz
                            </h2>
                            <p className="text-gray-300 max-w-4xl mx-auto mt-4 text-lg italic">
                                "I solemnly swear that I am up to no good." Reveal the hidden pathways of your mind.
                            </p>
                        </motion.div>
                    </div>

                    {/* About Sections with parallax feel - more detailed content */}
                    <div className="relative bg-black/40 backdrop-blur-md py-20 px-6 md:px-20 flex flex-col gap-16 text-center z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-3xl font-bold text-[#AD8B70]">About the Wizarding World</h2>
                            <p className="text-gray-300 max-w-3xl mx-auto mt-2">
                                Dive into the magical universe with our curated quizzes. From spells and potions to magical creatures, test your knowledge and see if you have what it takes to be a true wizard.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-[#AD8B70]">How the Sorting Works</h2>
                            <p className="text-gray-300 max-w-3xl mx-auto mt-2">
                                Each question is a riddle, a challenge to your wit and courage. Answer wisely, as the Sorting Hat will place you in the house that best suits your deepest qualities.
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom-of-page crests and motto - More pronounced */}
                    <div className="relative z-10 py-10 text-center text-gray-400">
                        <h3 className="text-2xl font-bold text-white mb-2">Hogwarts School of Witchcraft and Wizardry</h3>
                        <p className="italic text-lg">"Draco dormiens nunquam titillandus"</p>
                    </div>
                </motion.div>
            ) : (
                <>
                    {!loading && (
                        <img src={boyImage} alt="Boy at monitor" className="absolute w-full h-full object-cover" />
                    )}

                    {loading && (
                        <div className="flex items-center justify-center h-screen bg-black">
                            <div className="flex items-center space-x-4">
                                <img src={websiteLogo} alt="QuizCraft Logo" className="w-16 h-16 rounded-full" />
                                <motion.div className="w-64 h-4 rounded-full overflow-hidden bg-white/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%`, backgroundColor: progress < 100 ? "#ffffff" : "#AD8B70" }} transition={{ duration: 0.4, ease: "easeInOut" }} />
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {!loading && !showHome && (
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <motion.h1 className="text-5xl font-bold text-[#AD8B70]">
                                {typedText}
                                <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>|
                                </motion.span>
                            </motion.h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}