import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJWTToken } from "../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const EditQuiz = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen min-h-screen bg-gradient-to-br from-black via-[#120f28] to-[#2c1e1e] text-gray-200">
                <QuizDetails />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const QuizDetails = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const JWTToken = getJWTToken();
    const [quizData, setQuizData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/${quizId}`, {
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
                    throw new Error("The scroll is not fetched");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setQuizData(res.data.quiz);
                setQuizTitle(res.data.quiz.quizName);
                setQuizDescription(res.data.quiz.quizDescription);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.log("Error in fetching scroll: ", err);
            });
    }, [JWTToken, quizId]);

    const handleUpdateQuiz = (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(false);

        const updateData = {
            quizName: quizTitle,
            quizDescription: quizDescription,
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/${quizId}`, {
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
                    throw new Error("Scroll update failed");
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
                console.log("Error updating Scroll: ", err);
            });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-gray-300">Unfurling the ancient scroll...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-500">A magical glyph has been corrupted. The scroll cannot be read.</div>;
    if (updating) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-[#E5C397]">Scribing the new incantations...</div>;
    if (updateSuccess) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-green-500">The scroll has been magically updated!</div>;

    return (
        <motion.div
            className="w-full max-w-2xl mx-auto py-12 px-6"
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
                    Edit the Ancient Scroll
                </h2>
                <p className="text-center text-gray-400 mb-8 italic">
                    "I solemnly swear that I am up to no good." Update the secrets held within this magical document.
                </p>
                <form onSubmit={handleUpdateQuiz} className="space-y-6">
                    <div>
                        <label
                            htmlFor="quizTitle"
                            className="block text-lg font-medium text-gray-300 mb-2"
                        >
                            Scroll's Title:
                        </label>
                        <input
                            type="text"
                            id="quizTitle"
                            className="w-full p-3 bg-white/10 border border-[#AD8B70] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="quizDescription"
                            className="block text-lg font-medium text-gray-300 mb-2"
                        >
                            Scroll's Description:
                        </label>
                        <textarea
                            id="quizDescription"
                            className="w-full p-3 bg-white/10 border border-[#AD8B70] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E5C397] transition-colors resize-none"
                            rows="4"
                            value={quizDescription}
                            onChange={(e) => setQuizDescription(e.target.value)}
                            required
                        />
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
                            Scribe Incantation
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditQuiz;