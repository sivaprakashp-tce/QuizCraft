import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Fireflies from "../components/Fireflies.jsx";
import Runes from "../components/Runes.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { getJWTToken } from "../utils/index.js";

const QuizQuestion = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen h-[92vh] flex justify-center items-center">
                <Question />
            </div>
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

const Question = () => {
    const JWTToken = getJWTToken();
    if (!JWTToken) {
        navigate("/login");
    }

    const quizNavButton =
        "bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 mystical-glow";

    const navigate = useNavigate();

    const { number } = useParams();
    const qn = Number(number);
    const [question, setQuestion] = useState(null);
    const [noOfQues, setNoOfQues] = useState(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            let check = sessionStorage.getItem("Questions");
            if (check) {
                let questions = JSON.parse(check);
                setNoOfQues(questions.length);
                setQuestion(questions[qn - 1]);
                setLoading(false);
            } else {
                console.log("Local Storage is empty");
                setError(true);
            }
        } catch (err) {
            console.log("Error occurred in fetching questions", err);
            setError(true);
        }

        let answers = JSON.parse(sessionStorage.getItem("SelectedAnswers"));
        setSelectedOptionIndex(answers[qn - 1].selectedAnswer);
    }, [qn]);

    if (error) {
        return <div className="">Error raised</div>;
    }

    if (loading) {
        return <div className="">Loading...</div>;
    }

    const saveOption = () => {
        let ansArr = JSON.parse(sessionStorage.getItem("SelectedAnswers"));
        sessionStorage.removeItem("SelectedAnswers");
        ansArr[qn - 1].selectedAnswer = selectedOptionIndex;
        sessionStorage.setItem("SelectedAnswers", JSON.stringify(ansArr));
    };

    const handlePrevious = () => {
        saveOption();
        navigate(`/quiz/question/${qn - 1}`, { replace: true });
    };

    const handleNext = () => {
        saveOption();
        navigate(`/quiz/question/${qn + 1}`, { replace: true });
    };

    const handleSubmit = () => {
        setLoading(true);
        let ansArr = JSON.parse(sessionStorage.getItem("SelectedAnswers"));
        sessionStorage.removeItem("SelectedAnswers");
        ansArr[qn - 1].selectedAnswer = selectedOptionIndex;
        sessionStorage.setItem("SelectedAnswers", JSON.stringify(ansArr));
        let quizId = JSON.parse(sessionStorage.getItem("Questions"))[0].quizId;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/attended`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quizId: quizId,
                answers: ansArr,
                timeSpent: 1200,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Didn't save attempt");
                }
            })
            .then((res) => {
                sessionStorage.setItem("QuizResult", JSON.stringify(res));
                sessionStorage.removeItem("SelectedAnswers");
                navigate("/quiz/result", { replace: true });
            })
            .catch((err) => console.log("Error in posting the attempt", err));
    };

    return (
        <React.Fragment>
            <div className="bg-gray-900 w-5/6 lg:w-fit lg:max-w-5/6 lg:min-w-2/3 bg-opacity-90 rounded-2xl p-8 mystical-glow">
                <ProgressBar
                    current={qn}
                    total={noOfQues}
                    progress={100 * (qn / noOfQues)}
                />
                <h3 className="text-2xl text-white mb-8 text-center leading-relaxed">
                    🔮 {question.question}
                </h3>
                <div className="space-y-4 flex flex-col justify-center items-center lg:grid grid-cols-2 grid-rows-2 gap-5 lg:gap-10 w-full lg:w-5/6 mx-auto">
                    {question.options.map((option, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedOptionIndex(index)}
                                className={`py-8 px-14 lg:w-auto text-xl border-2  text-white flex justify-center items-center w-full p-4 rounded-xl text-left font-semibold transition-all duration-300 answer-hover cursor-pointer mb-0 ${
                                    selectedOptionIndex == index
                                        ? "bg-yellow-600 text-white border-2 border-yellow-600"
                                        : "bg-gray-800 text-white border-2 border-gray-600 hover:border-yellow-400 hover:bg-gray-700"
                                }`}
                            >
                                <span
                                    className={`${
                                        selectedOptionIndex == index
                                            ? "text-gray-200"
                                            : "text-yellow-400"
                                    } mr-3 text-xl`}
                                >
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
                <div className="text-center mt-8">
                    <div className="question-nav-buttons w-full flex justify-between items-center">
                        <button
                            onClick={handlePrevious}
                            className={`${quizNavButton} ${
                                qn > 1 ? "block" : "invisible"
                            }`}
                        >
                            Previous
                        </button>
                        {qn == noOfQues ? (
                            <button
                                className={quizNavButton}
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                id="nav-next-btn"
                                className={quizNavButton}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default QuizQuestion;
