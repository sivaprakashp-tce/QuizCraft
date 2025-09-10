import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Fireflies from "../components/Fireflies.jsx";
import Runes from "../components/Runes.jsx";
import { getJWTToken } from "../utils/index.js";

const QuizIntro = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen h-[92vh] flex justify-center items-center relative overflow-hidden">
                <QuizContainer />
            </div>
            {/* Effects (same as QuizQuestion) */}
            <div
                id="runes-container"
                className="fixed inset-0 pointer-events-none w-screen"
            ></div>
            <Runes />
            <div className="fireflies-container w-screen" />
            <Fireflies />
            <Footer />
        </React.Fragment>
    );
};

const QuizContainer = () => {
    const { quizId } = useParams();
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const JWTToken = getJWTToken();
    if (!JWTToken) {
        Navigate("/login");
    }

    useEffect(() => {
        // clear only quiz-related sessionStorage keys
        sessionStorage.removeItem("Questions");
        sessionStorage.removeItem("SelectedAnswers");

        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/${quizId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setQuizDetails(data.data.quiz);
                    setLoading(false);
                } else {
                    throw new Error(data.message || "Failed to fetch quiz");
                }
            })
            .catch((error) => {
                setError(true);
                console.error("Error fetching quiz data:", error);
            });

        // fetch quiz questions & save to sessionStorage
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/questions/${quizId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res?.data?.questions) {
                    let answers = [];
                    for (
                        let i = 0;
                        i < res.data.quizInfo.numberOfQuestions;
                        i++
                    ) {
                        answers.push({
                            questionId: res.data.questions[i]._id,
                            selectedAnswer: -1,
                        });
                    }
                    sessionStorage.setItem(
                        "Questions",
                        JSON.stringify(res.data.questions)
                    );
                    sessionStorage.setItem(
                        "SelectedAnswers",
                        JSON.stringify(answers)
                    );
                }
            })
            .catch((err) => {
                setError(true);
                console.error("Error fetching quiz questions:", err);
            });
    }, [quizId]);

    if (error) return <div className="text-red-400">⚠ Error loading quiz.</div>;
    if (loading)
        return (
            <div className="text-gray-300 animate-pulse">
                ✨ Preparing your codex...
            </div>
        );

    return (
        <div
            className="bg-gray-900 w-5/6 lg:max-w-3xl 
                       bg-opacity-90 rounded-2xl p-12 mystical-glow 
                       text-center flex flex-col items-center space-y-8
                       border-2 border-purple-500/40 hover:border-pink-400/60 transition-all duration-500"
        >
            {/* Decorative Icon */}
            <div className="text-5xl mb-2 animate-bounce">📜</div>

            {/* Big Title */}
            <h1
                className="text-5xl md:text-6xl font-extrabold 
                           bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 
                           text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]"
            >
                {quizDetails.quizName}
            </h1>

            {/* Subtitle */}
            <h3 className="text-lg md:text-2xl font-light text-gray-200 italic max-w-2xl">
                {quizDetails.quizDescription}
            </h3>

            {/* Start Button - larger and multi-gradient */}
            <a
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-black 
                           px-12 py-5 rounded-full text-xl font-bold 
                           shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] 
                           hover:scale-110 mystical-glow transition-all duration-300"
                href="/quiz/question/1"
            >
                ⚡ Begin the Quest
            </a>

            {/* Creator Info at bottom */}
            <div className="text-gray-300 text-sm md:text-lg italic pt-4 border-t border-gray-700 w-full">
                <p>
                    By{" "}
                    <span className="font-semibold text-yellow-300">
                        {quizDetails.userId.name}
                    </span>{" "}
                    •{" "}
                    <span className="font-semibold text-purple-300">
                        {quizDetails.institutionId.name}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default QuizIntro;
