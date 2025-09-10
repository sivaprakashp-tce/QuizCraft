import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { getJWTToken } from "../utils";
import anime from "animejs";
import Navbar from "../components/Navbar";

const ACCENT_COLOR = "#D2A679";

const UserAttempts = () => {
    return (
        <>
            <Navbar />
            <div className="mt-28 w-screen min-h-screen flex justify-center items-center bg-[#0E0E0E]">
                <Attempts />
            </div>
            <Footer />
        </>
    );
};

const Attempts = () => {
    const { userId } = useParams();
    const JWTToken = getJWTToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/attended/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWTToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    setError(true);
                    throw new Error("Error Raised");
                }
                return res.json();
            })
            .then((res) => {
                setAttempts(res.data.attempts);
                setLoading(false);
            })
            .catch((err) => {
                setError(true);
                console.log("Error Raised: ", err);
            });
    }, [JWTToken, userId]);

    useEffect(() => {
        if (!loading && !error && containerRef.current) {
            anime.timeline()
                .add({
                    targets: containerRef.current,
                    opacity: [0, 1],
                    scale: [0.85, 1],
                    duration: 700,
                    easing: "easeOutBack"
                })
                .add({
                    targets: ".attempt-card",
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: anime.stagger(150),
                    easing: "easeOutCubic",
                    duration: 600
                }, "-=200");

            anime({
                targets: containerRef.current,
                backgroundColor: [
                    "rgba(26, 26, 26, 0.9)",
                    "rgba(35, 28, 20, 0.95)"
                ],
                direction: "alternate",
                loop: true,
                duration: 5000,
                easing: "easeInOutSine"
            });
        }
    }, [loading, error]);

    if (loading)
        return <div className="text-lg text-[#D2A679] font-semibold animate-pulse">Loading your attempts...</div>;

    if (error)
        return <div className="text-lg text-red-400 font-bold animate-bounce">Something went wrong!</div>;

    return (
        <div
            ref={containerRef}
            className="attempts-cont w-11/12 lg:w-5/6 text-white rounded-2xl shadow-xl p-6 border border-[#D2A679]/40"
        >
            <h1
                className="text-4xl lg:text-5xl text-center font-extrabold p-4"
                style={{ color: ACCENT_COLOR }}
            >
                Your Attempts
            </h1>
            <div className="flex flex-col gap-4">
                {attempts.map((attempt, i) => (
                    <AttemptCard attempt={attempt} key={attempt._id} index={i} />
                ))}
            </div>
        </div>
    );
};

const AttemptCard = ({ attempt, index }) => {
    const cardRef = useRef(null);
    const circleRef = useRef(null);
    const [displayPercentage, setDisplayPercentage] = useState(0);

    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(attempt.percentage, 0), 100);

    useEffect(() => {
        if (circleRef.current) {
            // Set initial state
            circleRef.current.style.strokeDasharray = circumference;
            circleRef.current.style.strokeDashoffset = circumference;

            // Animate stroke + text value
            anime({
                targets: circleRef.current,
                strokeDashoffset: [circumference, circumference - (progress / 100) * circumference],
                duration: 1200,
                delay: index * 200 + 400,
                easing: "easeOutCubic"
            });

            anime({
                targets: { val: 0 },
                val: progress,
                duration: 1200,
                delay: index * 200 + 400,
                easing: "easeOutCubic",
                update: (anim) => {
                    setDisplayPercentage(anim.animations[0].currentValue.toFixed(0));
                }
            });
        }
    }, [circumference, progress, index]);

    const scoreColor =
        attempt.percentage >= 80
            ? "#22c55e"
            : attempt.percentage >= 50
            ? "#facc15"
            : "#ef4444";

    const handleClick = () => {
        anime({
            targets: cardRef.current,
            scale: [1, 0.95, 1],
            rotateZ: [0, -2, 0],
            duration: 300,
            easing: "easeInOutQuad"
        });
    };

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            className="attempt-card flex justify-between items-center 
                       w-full min-h-[120px] max-w-[700px] 
                       mx-auto p-5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] 
                       border border-[#D2A679]/40 shadow-md 
                       hover:shadow-[#D2A679]/40 
                       hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
        >
            <div className="column max-w-[70%]">
                <h3 className="font-bold text-2xl truncate" style={{ color: ACCENT_COLOR }}>
                    {attempt.quizId.quizName}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                    {attempt.quizId.quizDescription}
                </p>
            </div>
            <div className="column flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-white">
                    {attempt.score}/{attempt.totalPossibleScore}
                </p>
                <svg width="60" height="60" className="mt-2">
                    <circle
                        cx="30"
                        cy="30"
                        r={radius}
                        fill="none"
                        stroke="#333"
                        strokeWidth="6"
                    />
                    <circle
                        ref={circleRef}
                        cx="30"
                        cy="30"
                        r={radius}
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%"
                        }}
                    />
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        style={{ fill: "#ffffff", fontWeight: "bold", fontSize: "14px" }}
                    >
                        {displayPercentage}%
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default UserAttempts;