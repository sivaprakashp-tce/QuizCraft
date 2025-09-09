import React from "react";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { getJWTToken } from "../utils";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const EditQuestion = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-screen">
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
                    throw new Error("The is not fetched");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setQuestionData(res.data.question);
                setQuestion(res.data.question.question)
                setOption1(res.data.question.options[0])
                setOption2(res.data.question.options[1])
                setOption3(res.data.question.options[2])
                setOption4(res.data.question.options[3])
                setPointsAwarded(res.data.question.pointsAwarded)
                setCorrectAnswer(res.data.question.correctAnswer)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.log("Error in fetching question: ", err);
            });
    }, [JWTToken, questionId]);

    // Handle form submission
    const handleUpdateQuestion = (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(false);

        const updateData = {
            question: question,
            options: [option1, option2, option3, option4],
            correctAnswer: Number(correctAnswer) - 1,
            pointsAwarded: Number(pointsAwarded)
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/question/${questionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWTToken}`,
            },
            body: JSON.stringify(updateData)
        })
            .then((res) => {
                if (!res.ok) {
                    setUpdating(false);
                    setError(true);
                    throw new Error("Question update failed");
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
                console.log("Error updating question: ", err);
            });
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error loading question!</div>;
    if (updating) return <div className="text-center py-8">Updating question...</div>;
    if (updateSuccess) return <div className="text-center py-8 text-green-500">Question updated successfully!</div>;

    return (
        <React.Fragment>
            <div className="question-wrapper w-11/12 lg:w-5/6 mx-auto bg-white text-black rounded-xl p-5 my-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Question</h2>
                <form onSubmit={handleUpdateQuestion} className="space-y-6">
                    <div className="question-data">
                        <div className="mb-4">
                            <label htmlFor="question" className="block text-sm font-medium mb-2">
                                Question:
                            </label>
                            <input
                                type="text"
                                id="question"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="options space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="option-1" className="block text-sm font-medium mb-1">
                                        Option 1:
                                    </label>
                                    <input
                                        type="text"
                                        id="option-1"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={option1}
                                        onChange={(e) => setOption1(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="option-2" className="block text-sm font-medium mb-1">
                                        Option 2:
                                    </label>
                                    <input
                                        type="text"
                                        id="option-2"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={option2}
                                        onChange={(e) => setOption2(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="option-3" className="block text-sm font-medium mb-1">
                                        Option 3:
                                    </label>
                                    <input
                                        type="text"
                                        id="option-3"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={option3}
                                        onChange={(e) => setOption3(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="option-4" className="block text-sm font-medium mb-1">
                                        Option 4:
                                    </label>
                                    <input
                                        type="text"
                                        id="option-4"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={option4}
                                        onChange={(e) => setOption4(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div>
                                <label htmlFor="correctAnswerInp" className="block text-sm font-medium mb-1">
                                    Correct Answer:
                                </label>
                                <input
                                    type="number"
                                    id="correctAnswerInp"
                                    min="1"
                                    max="4"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    required
                                />
                                <div>
                                    <label htmlFor="pointsAwardedInp" className="block text-sm font-medium mb-1">
                                        Points Awarded:
                                    </label>
                                    <input
                                        type="number"
                                        id="pointsAwardedInp"
                                        min="1"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={pointsAwarded}
                                        onChange={(e) => setPointsAwarded(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
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

export default EditQuestion;
