import { useEffect, useState } from "react";
import boyImage from "../assets/boy.svg";
import { websiteLogo } from "../assets";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import NewHome from "./NewHome";
import { replace, useNavigate } from "react-router-dom";

export default function Home() {
    const fullText = "QuizCraft";
    const navigate = useNavigate()

    const hasLoaded = sessionStorage.getItem("hasLoaded");
    const [loading, setLoading] = useState(!hasLoaded);
    const [progress, setProgress] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [showHome, setShowHome] = useState(hasLoaded);

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
                    setTimeout(() => navigate('/home', replace), 1000);
                }
            }, 150);
            return () => clearInterval(typing);
        } else {
            navigate('/home', replace)
        }
    }, [loading, hasLoaded, navigate]);

    return (
        <div className="relative w-full h-screen overflow-x-hidden">
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
        </div>
    );
}