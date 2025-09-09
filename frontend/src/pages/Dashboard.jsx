import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SpellTab from "/src/components/SpellTab.jsx";
import { replace, useNavigate } from "react-router-dom";
import { getJWTToken } from "../utils";

// Custom hook to handle the typewriter effect
const useTypewriterEffect = (textToType, speed) => {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let currentText = "";
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < textToType.length) {
                currentText += textToType[index];
                setTypedText(currentText);
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [textToType, speed]);

    return typedText;
};

const Dashboard = () => {
    sessionStorage.clear()
    const navigate = useNavigate()
    const JWTToken = getJWTToken();
    if (!JWTToken) {
        navigate('/login', replace)
    }

    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [gotUserData, setGotUserData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [headerAnimationComplete, setHeaderAnimationComplete] = useState(false);

    useEffect(() => {
        // /api/auth/user
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    setError(true);
                    console.log("Error in fetching user Data");
                    throw new Error("Error in fetching user Data");
                }
                return res.json();
            })
            .then((res) => {
                setUser(res.data.user);
                setGotUserData(true);
            })
            .catch((err) => {
                setError(true);
                throw new Error("Error arised: ", err);
            });
    }, [JWTToken]);

    useEffect(() => {
        // /api/quizzes/:stream
        if (gotUserData) {
            fetch(
                `${import.meta.env.VITE_BACKEND_URL}/quizzes/${
                    user.streamId._id
                }?limit=100`,
                {
                    headers: {
                        Authorization: `Bearer ${JWTToken}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((res) => {
                    if (!res.ok) {
                        setError(true);
                        console.log("Error in fetching data for quizzes");
                        throw new Error("Error in fetching data for quizzes");
                    }
                    return res.json();
                })
                .then((res) => {
                    setQuizzes(res.data.quizzes);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(true);
                    throw new Error("Error arised: ", err);
                });
        } else {
            console.log("Error in obtaining user data");
        }
    }, [user, gotUserData, JWTToken]);

    if (loading) return <div className="text-gray-300 h-screen flex justify-center items-center animate-pulse bg-gray-900">✨ Loading dashboard...</div>;

    if (error) return <div className="text-red-400 h-screen flex justify-center items-center bg-gray-900">⚠ Error Occurred while loading.</div>;

    return (
        <React.Fragment>
            <Navbar />
            <div 
                className="w-screen min-h-[92vh] text-gray-200 bg-gray-950 pt-24"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px), repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px)`
                }}
            >
                {user && (
                    <DashboardHeader
                        name={user.name}
                        onAnimationComplete={() => setHeaderAnimationComplete(true)}
                    />
                )}
                {headerAnimationComplete && quizzes && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizListDisplay quizlist={quizzes} />
                    </motion.div>
                )}
            </div>
            <SpellTab />
            <Footer />
        </React.Fragment>
    );
};

const DashboardHeader = ({ name, onAnimationComplete }) => {
    const fullHeadingText = `Hello, ${name}!`;
    const headingText = useTypewriterEffect(fullHeadingText, 100);

    const [showSlogan, setShowSlogan] = useState(false);

    useEffect(() => {
        if (headingText.length === fullHeadingText.length) {
            setTimeout(() => {
                setShowSlogan(true);
                // trigger dashboard load a bit later
                setTimeout(() => {
                    onAnimationComplete();
                }, 500);
            }, 500); // delay before showing slogan
        }
    }, [headingText, fullHeadingText, onAnimationComplete]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 text-center py-12">
            {/* First line - Typewriter */}
            <h1 className="text-4xl lg:text-5xl text-amber-300 font-black font-mono">
                {headingText}
                {headingText.length < fullHeadingText.length && (
                    <motion.span
                        className="inline-block w-2 h-10 ml-1 bg-amber-300"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </h1>

            {/* Second line - Transition (fade + slide up) */}
            {showSlogan && (
                <motion.h3
                    className="text-xl lg:text-2xl text-slate-300 italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    The best way to predict your future is to create it
                </motion.h3>
            )}
        </div>
    );
};

const QuizListDisplay = ({ quizlist }) => {
    return (
        <React.Fragment>
            <div className="w-5/6 mx-auto pb-12">
                <h2 className="text-2xl lg:text-3xl text-amber-300 font-semibold p-2 border-b-2 border-amber-300 w-fit mb-10">
                    Quizzes for you
                </h2>
                <div className="flex flex-col lg:grid grid-cols-2 gap-10">
                    {quizlist.map((quiz) => (
                        <Quizcard key={quiz._id} quiz={quiz} />
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

const Quizcard = ({ quiz }) => {
    if (quiz.numberOfQuestions == 0) {
        return null
    } 
    return (
        <React.Fragment>
            <a
                href={`/quiz/${quiz._id}`}
                className="w-full max-w-lg p-6 flex justify-between items-center 
                           bg-slate-900 border-2 border-yellow-400 rounded-lg shadow-xl 
                           hover:bg-slate-800 transition-colors duration-300"
            >
                <div className="w-full">
                    <h4 className="text-2xl font-bold text-white mb-2">
                        {quiz.quizName}
                    </h4>
                    <p className="mb-4 text-gray-300 text-sm">
                        {quiz.quizDescription}
                    </p>
                    <p className="text-xs text-gray-400">
                        By <span className="font-semibold">{quiz.userId.name}</span> of <span className="font-semibold">{quiz.institutionId.name}</span>
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400">⭐</span>
                        <p className="text-lg font-semibold text-gray-200">
                            {quiz.totalPoints}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-purple-400">🔮</span>
                        <p className="text-lg font-semibold text-gray-200">
                            {quiz.numberOfQuestions}Q
                        </p>
                    </div>
                </div>
            </a>
        </React.Fragment>
    );
};

export default Dashboard;