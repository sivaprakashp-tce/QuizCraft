import React from "react";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { getJWTToken } from "../utils";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const EditQuestion = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen min-h-screen bg-gradient-to-br from-black via-[#120f28] to-[#2c1e1e] text-gray-200">
                <QuestionDetails />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const QuestionDetails = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const JWTToken = getJWTToken();
    const [questionData, setQuestionData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [pointsAwarded, setPointsAwarded] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/question/${questionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWTToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    setLoading(false);
                    setError(true);
                    throw new Error("The ancient riddle is not fetched");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setQuestionData(res.data.question);
                setQuestion(res.data.question.question);
                setOption1(res.data.question.options[0]);
                setOption2(res.data.question.options[1]);
                setOption3(res.data.question.options[2]);
                setOption4(res.data.question.options[3]);
                setPointsAwarded(res.data.question.pointsAwarded);
                setCorrectAnswer(res.data.question.correctAnswer + 1);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.log("Error in fetching riddle: ", err);
            });
    }, [JWTToken, questionId]);

    const handleUpdateQuestion = (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(false);

        const updateData = {
            question: question,
            options: [option1, option2, option3, option4],
            correctAnswer: Number(correctAnswer) - 1,
            pointsAwarded: Number(pointsAwarded),
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/question/${questionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWTToken}`,
            },
            body: JSON.stringify(updateData),
        })
            .then((res) => {
                if (!res.ok) {
                    setUpdating(false);
                    setError(true);
                    throw new Error("Riddle update failed");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setUpdating(false);
                setUpdateSuccess(true);
                setTimeout(() => {
                    setUpdateSuccess(false);
                    navigate(-1);
                }, 2000);
            })
            .catch((err) => {
                setUpdating(false);
                setError(true);
                console.log("Error updating riddle: ", err);
            });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-gray-300">Summoning the ancient riddle...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-500">A magical glyph has been corrupted. The riddle cannot be read.</div>;
    if (updating) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-[#E5C397]">Scribing the new runes...</div>;
    if (updateSuccess) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-green-500">The riddle has been magically updated!</div>;

    return (
        <motion.div
            className="w-full max-w-3xl mx-auto py-12 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#AD8B70]"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-[#E5C397] mb-6 text-center font-serif">
                    Edit the Ancient Riddle
                </h2>
                <p className="text-center text-gray-400 mb-8 italic">
                    "Do not meddle in the affairs of wizards, for they are subtle and quick to anger." Edit the cryptic phrases to test a true wizard's mind.
                </p>
                <form onSubmit={handleUpdateQuestion} className="space-y-6">
                    <div>
                        <label htmlFor="question" className="block text-lg font-medium text-gray-300 mb-2">
                            Riddle:
                        </label>
                        <input
                            type="text"
                            id="question"
                            className="w-full p-3 bg-white/10 border border-[#AD8B70] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="options space-y-4">
                        <h3 className="text-xl font-semibold text-gray-300">Answer Runes:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((index) => (
                                <div key={index}>
                                    <label htmlFor={`option-${index}`} className="block text-sm font-medium text-gray-400 mb-1">
                                        Rune {index}:
                                    </label>
                                    <input
                                        type="text"
                                        id={`option-${index}`}
                                        className="w-full p-2 bg-white/10 border border-[#AD8B70] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors"
                                        value={
                                            index === 1 ? option1 :
                                            index === 2 ? option2 :
                                            index === 3 ? option3 : option4
                                        }
                                        onChange={(e) => {
                                            if (index === 1) setOption1(e.target.value);
                                            if (index === 2) setOption2(e.target.value);
                                            if (index === 3) setOption3(e.target.value);
                                            if (index === 4) setOption4(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label htmlFor="correctAnswerInp" className="block text-lg font-medium text-gray-300 mb-2">
                                The True Rune:
                            </label>
                            <input
                                type="number"
                                id="correctAnswerInp"
                                min="1"
                                max="4"
                                className="w-full p-3 bg-white/10 border border-[#AD8B70] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors"
                                value={correctAnswer}
                                onChange={(e) => setCorrectAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="pointsAwardedInp" className="block text-lg font-medium text-gray-300 mb-2">
                                Merit Points:
                            </label>
                            <input
                                type="number"
                                id="pointsAwardedInp"
                                min="1"
                                className="w-full p-3 bg-white/10 border border-[#AD8B70] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors"
                                value={pointsAwarded}
                                onChange={(e) => setPointsAwarded(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 hover:scale-105 transition-transform"
                        >
                            Retreat
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 hover:scale-105 transition-transform"
                        >
                            Scribe New Runes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditQuestion;