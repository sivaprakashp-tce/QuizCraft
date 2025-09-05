import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJWTToken } from "../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const EditQuiz = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-screen">
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
                    throw new Error("The is not fetched");
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
                console.log("Error in fetching question: ", err);
            });
    }, [JWTToken, quizId]);

    // Handle form submission
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
                    throw new Error("Quiz update failed");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setUpdating(false);
                setUpdateSuccess(true);
                setTimeout(() => {
                    setUpdateSuccess(false);
                    navigate(-1); // Go back to previous page
                }, 2000);
            })
            .catch((err) => {
                setUpdating(false);
                setError(true);
                console.log("Error updating Quiz: ", err);
            });
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error)
        return (
            <div className="text-center py-8 text-red-500">
                Error loading Quiz!
            </div>
        );
    if (updating)
        return <div className="text-center py-8">Updating Quiz...</div>;
    if (updateSuccess)
        return (
            <div className="text-center py-8 text-green-500">
                Quiz updated successfully!
            </div>
        );

    return (
        <React.Fragment>
            <div className="edit-quiz-wrapper">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Edit Question
                </h2>
                <form onSubmit={handleUpdateQuiz} className="space-y-6">
                    <div className="question-data">
                        <div className="mb-4">
                            <label
                                htmlFor="question"
                                className="block text-sm font-medium mb-2"
                            >
                                Question:
                            </label>
                            <input
                                type="text"
                                id="question"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="question"
                                className="block text-sm font-medium mb-2"
                            >
                                Question:
                            </label>
                            <input
                                type="text"
                                id="question"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quizDescription}
                                onChange={(e) => setQuizDescription(e.target.value)}
                                required
                            />
                        </div>

                            
                        <div className="flex gap-4 justify-center mt-8">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Update Question
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export default EditQuiz;
