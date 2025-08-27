import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Fireflies from "../components/Fireflies";

const QuizIntro = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div
                id="fireflies-container"
                className="website-cont w-screen h-[92vh] flex justify-center items-center 
                           bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden"
            >
                {/* Magical floating lights */}
                <Fireflies count={30} />

                {/* Subtle glow mist */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-yellow-900/10 pointer-events-none"></div>

                <QuizContainer />
            </div>
        </React.Fragment>
    );
};

const QuizContainer = () => {
    const { quizId } = useParams();
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const JWTToken = import.meta.env.VITE_JWTToken;

    useEffect(() => {
        // clear only quiz-related sessionStorage keys
        sessionStorage.removeItem("Questions");
        sessionStorage.removeItem("SelectedAnswers");

        // fetch quiz details
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
                    for (let i = 0; i < res.data.quizInfo.numberOfQuestions; i++) {
                        answers.push({
                            questionId: res.data.questions[i]._id,
                            selectedAnswer: -1,
                        });
                    }
                    sessionStorage.setItem("Questions", JSON.stringify(res.data.questions));
                    sessionStorage.setItem("SelectedAnswers", JSON.stringify(answers));
                }
            })
            .catch((err) => {
                setError(true);
                console.error("Error fetching quiz questions:", err);
            });
    }, [quizId]);

    if (error) return <div className="text-red-400">⚠ Error loading quiz.</div>;
    if (loading) return <div className="text-gray-300 animate-pulse">✨ Preparing your codex...</div>;

    return (
        <div
            className="quiz-container w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 
                       bg-gradient-to-b from-gray-800/90 to-black/95 rounded-2xl shadow-2xl
                       border border-purple-500/40 hover:border-pink-400/60 transition-all duration-500
                       text-white flex justify-center items-center text-center p-10 relative z-10
                       animate-fadeIn"
        >
            <div className="content-wrapper flex flex-col justify-around items-center space-y-8">
                {/* Title with gradient magical glow */}
                <h1
                    className="text-5xl md:text-7xl font-extrabold 
                               bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 
                               text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]"
                >
                    {quizDetails.quizName}
                </h1>

                {/* Subtitle */}
                <h3 className="text-lg md:text-2xl font-light text-gray-200 italic">
                    {quizDetails.quizDescription}
                </h3>

                {/* Creator Info */}
                <div className="creator-info-group md:text-lg text-gray-300 space-y-1">
                    <p>
                        By{" "}
                        <span className="font-semibold text-yellow-300">
                            {quizDetails.userId.name}
                        </span>
                    </p>
                    <p>
                        From{" "}
                        <span className="font-semibold text-purple-300">
                            {quizDetails.institutionId.name}
                        </span>
                    </p>
                </div>

                {/* Enchanted Start Button */}
                <a
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 
                               text-black px-10 py-4 rounded-full text-lg font-bold 
                               shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] 
                               hover:scale-110 transition-all duration-300 cursor-pointer
                               relative overflow-hidden group"
                    href="/quiz/question/1"
                >
                    <span className="relative z-10">⚡ Begin the Quest</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition"></span>
                </a>
            </div>
        </div>
    );
};

export default QuizIntro;