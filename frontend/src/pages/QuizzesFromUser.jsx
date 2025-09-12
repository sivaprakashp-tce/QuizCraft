import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { getJWTToken } from '../utils';
import { motion } from "framer-motion";
import anime from 'animejs/lib/anime.es.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const QuizzesFromUser = () => {
  return (
    <React.Fragment>
        <Navbar />
        <div className="mt-24 w-screen min-h-screen bg-gradient-to-br from-black via-[#120f28] to-[#2c1e1e] text-gray-200">
          <div className="max-w-4xl mx-auto py-12 px-4 md:px-6">
            <UserQuizList />
          </div>
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
    const [quizDeletionProcess, setQuizDeletionProcess] = useState(false);
    const [isQuizDeleted, setIsQuizDeleted] = useState(false);
    const [questionDeletionProcess, setQuestionDeletionProcess] = useState(false);
    const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
    const JWTToken = getJWTToken();
    const navigate = useNavigate();

    // Move containerVariants here
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: {
                staggerChildren: 0.1
            }
        }
    };

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

    const handleBackToQuizzes = () => {
        setSelectedQuiz(null);
        setQuestions([]);
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
        if (window.confirm("Are you sure you want to delete this scroll?")) {
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
                        window.location.reload();
                    }, 2000);
                }
            })
        }
    }

    const animateIncinerate = (element) => {
        if (!element) return;
        anime({
            targets: element,
            opacity: [1, 0],
            scale: [1, 0.8],
            duration: 800,
            easing: 'easeOutQuad',
            complete: () => {
                const questionId = element.dataset.questionId;
                if (questionId) {
                    handleQuestionDelete(questionId);
                }
            }
        });
    };

    const handleQuestionDelete = (questionId) => {
        if (window.confirm('Are you sure you want to incinerate this question?')) {
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

    // Anime.js hover effect for titles
    const handleHoverEffect = (e) => {
        anime({
            targets: e.target,
            color: '#E5C397',
            textShadow: '0 0 10px #AD8B70',
            easing: 'easeInOutQuad',
            duration: 500,
            direction: 'alternate',
            loop: true
        });
    };

    const handleHoverOut = (e) => {
        anime.remove(e.target);
        anime({
            targets: e.target,
            color: '#E5C397',
            textShadow: 'none',
            duration: 300,
            easing: 'easeOutQuad'
        });
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    if (quizDeletionProcess) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-[#E5C397]">Casting the 'Incineratus' spell...</div>
    if (isQuizDeleted) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-400">The spellbook has been erased from existence.</div>

    if (questionDeletionProcess) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-[#E5C397]">Incinerating the question...</div>
    if (isQuestionDeleted) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-400">The question has been incinerated.</div>

    if (loading) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-gray-300">Summoning your scrolls...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-red-500">A magical mishap has occurred. Try again.</div>;

    // If a quiz is selected, show its questions
    if (selectedQuiz) {
        return (
            <div className="relative">
                <motion.button 
                    onClick={handleBackToQuizzes} 
                    className="mb-6 px-4 py-2 bg-[#8C7A6A] text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    Return to the Scroll Archive
                </motion.button>
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-[#E5C397] mb-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Inscriptions on this Scroll
                </motion.h2>
                {loadingQuestions ? (
                    <div className="text-gray-300">Unfurling the scroll...</div>
                ) : (
                    <motion.div variants={containerVariants}>
                        {questions.length === 0 ? (
                            <div className="text-gray-400 text-lg">No ancient runes or riddles have been inscribed on this scroll yet.</div>
                        ) : (
                            questions.map((q) => (
                                <motion.div 
                                    key={q._id} 
                                    data-question-id={q._id}
                                    className="border border-[#AD8B70] p-4 mb-4 rounded-xl bg-black/40 shadow-lg"
                                    variants={cardVariants}
                                >
                                    <div 
                                        className="font-semibold text-lg md:text-xl text-[#E5C397] cursor-pointer"
                                        onMouseEnter={handleHoverEffect}
                                        onMouseLeave={handleHoverOut}
                                    >
                                        {q.question}
                                    </div>
                                    <div className="text-gray-400">Merit Points: {q.pointsAwarded}</div>
                                    <div className="text-gray-400">Answers: {q.options && q.options.join(', ')}</div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <a href={`/edit/question/${q._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:scale-105 transition-transform">Edit Riddle</a>
                                        <button 
                                            onClick={(e) => {
                                                if (window.confirm('Are you sure you want to incinerate this question?')) {
                                                    animateIncinerate(e.currentTarget.closest('div'));
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-105 transition-transform"
                                        >
                                            Incinerate
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <motion.a 
                            href={`/create/question/${selectedQuiz}`} 
                            className="inline-block mt-6 px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #6ee7b7" }}
                        >
                            Inscribe a New Riddle
                        </motion.a>
                    </motion.div>
                )}
            </div>
        );
    }

    // Otherwise, show quiz list
    return (
        <div className="relative">
            <div className="flex justify-between items-center flex-col md:flex-row">
                <h2 className="text-3xl md:text-4xl font-bold text-[#AD8B70] mb-6 text-center">Your Magical Scroll Archive</h2>
                <Link
                  to="/create/quiz"
                  className="px-6 py-3 bg-[#AD8B70] text-black text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  Create Quiz
                </Link>
            </div>
            {quizzes.length === 0 ? (
                <div className="text-gray-400 text-lg text-center mt-20">No scrolls found in your archive. Time to create some!</div>
            ) : (
                <motion.div variants={containerVariants} className="mt-20">
                    {quizzes.map((quiz, index) => (
                        <motion.div 
                            key={quiz._id} 
                            className="border border-[#AD8B70] p-4 md:p-6 mb-4 md:mb-6 rounded-xl bg-black/40 shadow-xl"
                            variants={cardVariants}
                        >
                            <div 
                                className="font-semibold text-xl md:text-2xl text-[#E5C397] mb-2 cursor-pointer"
                                onMouseEnter={handleHoverEffect}
                                onMouseLeave={handleHoverOut}
                            >
                                {quiz.quizName}
                            </div>
                            <div className="text-gray-300 mb-2">{quiz.quizDescription}</div>
                            <div className="text-gray-400 mb-1">Total Merit Points: {quiz.totalPoints}</div>
                            <div className="text-gray-400 mb-1">Riddles: {quiz.numberOfQuestions}</div>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button onClick={() => handleViewQuestions(quiz._id)} className="px-4 py-2 bg-[#8C7A6A] text-white rounded-lg hover:scale-105 transition-transform">Examine Scroll</button>
                                <a href={`/edit/quiz/${quiz._id}`} className="px-4 py-2 bg-[#AD8B70] text-black font-bold rounded-lg hover:scale-105 transition-transform">Edit Scroll</a>
                                <a href={`/create/question/${quiz._id}`} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:scale-105 transition-transform">Inscribe a Riddle</a>
                                <button onClick={() => handleQuizDelete(quiz._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-105 transition-transform">Erase Scroll</button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default QuizzesFromUser