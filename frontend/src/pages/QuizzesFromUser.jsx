import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { getJWTToken } from '../utils'
import { useState } from 'react'
import Quiz from '../../../backend/models/Quiz'
import { replace, useNavigate } from 'react-router-dom'

const QuizzesFromUser = () => {
  return (
    <React.Fragment>
        <Navbar />
        <div className="w-screen min-h-screen">
            <UserQuizList />
        </div>
        <Footer />
    </React.Fragment>
  )
}

const UserQuizList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [quizDeletionProcess, setQuizDeletionProcess] = useState(false)
    const [isQuizDeleted, setIsQuizDeleted] = useState(false)
    const [questionDeletionProcess, setQuestionDeletionProcess] = useState(false)
    const [isQuestionDeleted, setIsQuestionDeleted] = useState(false)
    const JWTToken = getJWTToken();
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher/quizzes?limit=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTToken}`
            }
        })
        .then((res) => {
            if (!res.ok) {
                setError(true);
                throw new Error("User's quizzes not fetched");
            } else {
                return res.json();
            }
        })
        .then((res) => {
            setLoading(false);
            setQuizzes(res.data.quizzes);
        })
        .catch((err) => {
            setError(true);
            console.log("Error raised while fetching user's quizzes: ", err);
        });
    }, [JWTToken]);

    // Handler to show questions for a quiz
    const handleViewQuestions = (quizId) => {
        setSelectedQuiz(quizId);
        setLoadingQuestions(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/questions/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTToken}`
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Questions not fetched");
            } else {
                return res.json();
            }
        })
        .then((res) => {
            setQuestions(res.data.questions);
            setLoadingQuestions(false);
        })
        .catch((err) => {
            setLoadingQuestions(false);
            setQuestions([]);
            console.log("Error fetching questions: ", err);
        });
    };

    // Handler to go back to quiz list
    const handleBackToQuizzes = () => {
        setSelectedQuiz(null);
        setQuestions([]);
        // Refresh quiz list to show updated counts and points
        fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher/quizzes?limit=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTToken}`
            }
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((res) => {
            if (res && res.data) {
                setQuizzes(res.data.quizzes);
            }
        })
        .catch((err) => {
            console.log("Error refreshing quizzes: ", err);
        });
    };

    const handleQuizDelete = (quizId) => {
        setQuizDeletionProcess(true)
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTToken}`
            }
        }).then((res) => {
            if (!res.ok) {
                setError(true)
                throw new Error("Error in deleting quiz")
            } else {
                setQuizDeletionProcess(false)
                setIsQuizDeleted(true)
                setTimeout(() => {
                    setIsQuizDeleted(false)
                }, 2000);
                return navigate('/user/quizzes', replace)
            }
        })
    }

    const handleQuestionDelete = (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setQuestionDeletionProcess(true);
            fetch(`${import.meta.env.VITE_BACKEND_URL}/question/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWTToken}`
                }
            }).then((res) => {
                if (!res.ok) {
                    setError(true);
                    setQuestionDeletionProcess(false);
                    throw new Error("Error in deleting the question");
                } else {
                    setQuestionDeletionProcess(false);
                    setIsQuestionDeleted(true);
                    // Refresh questions list for current quiz
                    handleViewQuestions(selectedQuiz);
                    setTimeout(() => {
                        setIsQuestionDeleted(false);
                    }, 2000);
                }
            }).catch((err) => {
                setError(true);
                setQuestionDeletionProcess(false);
                console.log("Error deleting question: ", err);
            });
        }
    }

    if (quizDeletionProcess) return <div className="">Quiz is being Deleted</div>
    if (isQuizDeleted) return <div className="">The quiz has been deleted</div>

    if (questionDeletionProcess) return <div className="">Question is being Deleted</div>
    if (isQuestionDeleted) return <div className="">The Question has been deleted</div>

    if (loading) return <div>Loading quizzes...</div>;
    if (error) return <div>Error loading quizzes.</div>;

    // If a quiz is selected, show its questions
    if (selectedQuiz) {
        return (
            <div className="quiz-questions-section">
                <button onClick={handleBackToQuizzes} className="mb-4 px-3 py-1 bg-gray-200 text-black rounded">Back to Quizzes</button>
                <h2 className="text-xl font-bold mb-2">Questions for Quiz</h2>
                {loadingQuestions ? (
                    <div>Loading questions...</div>
                ) : (
                    <div>
                        {questions.length === 0 ? (
                            <div>No questions found for this quiz.</div>
                        ) : (
                            questions.map((q) => (
                                <div key={q._id} className="border p-2 mb-2 rounded">
                                    <div className="font-semibold">{q.question}</div>
                                    <div>Points: {q.pointsAwarded}</div>
                                    <div>Options: {q.options && q.options.join(', ')}</div>
                                    <a href={`/edit/question/${q._id}`} className="mr-2 px-2 py-1 bg-blue-400 text-white rounded">Edit</a>
                                    <button onClick={() => handleQuestionDelete(q._id)} className="px-2 py-1 bg-red-400 text-white rounded cursor-pointer">Delete</button>
                                </div>
                            ))
                        )}
                        <a href={`/create/question/${selectedQuiz}`} className="inline-block mt-4 px-3 py-2 bg-green-500 text-white rounded">Add Question</a>
                    </div>
                )}
            </div>
        );
    }

    // Otherwise, show quiz list
    return (
        <div className="user-quizzes-list">
            <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
            {quizzes.length === 0 ? (
                <div>No quizzes found.</div>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz._id} className="border-2 border-green-500 p-3 mb-3 rounded">
                        <div className="font-semibold text-lg">{quiz.quizName}</div>
                        <div className="mb-1">{quiz.quizDescription}</div>
                        <div className="mb-1">Total Points: {quiz.totalPoints}</div>
                        <div className="mb-1">Questions: {quiz.numberOfQuestions}</div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleViewQuestions(quiz._id)} className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer">View/Edit Questions</button>
                            <a href={`/edit/quiz/${quiz._id}`} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit Quiz</a>
                            <a href={`/create/question/${quiz._id}`} className="px-2 py-1 bg-green-500 text-white rounded">Add Question</a>
                            <button onClick={() => handleQuizDelete(quiz._id)} className="px-2 py-1 bg-red-400 text-white rounded cursor-pointer">Delete Quiz</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}


export default QuizzesFromUser