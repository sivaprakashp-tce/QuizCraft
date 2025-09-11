import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Fireflies from '../components/Fireflies.jsx';
import Runes from '../components/Runes.jsx';

const QuizResult = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        try {
            // Check for existence of QuizResult in sessionStorage
            const sessionResult = sessionStorage.getItem('QuizResult');
            if (!sessionResult) {
                console.error("Quiz result not found in session storage.");
                navigate('/dashboard', { replace: true });
                return;
            }
            setResult(JSON.parse(sessionResult).data.attempt);
            setLoading(false);
        } catch (err) {
            setError(true);
            console.error("Error parsing quiz result:", err);
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    if (error) {
        return <div className="text-red-400 h-screen flex justify-center items-center">⚠ Error loading quiz results.</div>;
    }
    if (loading) {
        return <div className="text-gray-300 h-screen flex justify-center items-center animate-pulse">✨ Calculating your cosmic score...</div>;
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen min-h-screen flex justify-center items-center flex-col gap-10 py-10 relative overflow-hidden bg-gray-950">
                <DisplayResult result={result} />
                <AnswersReview answers={result.answersRecorded} />
            </div>
            <div id="runes-container" className="fixed inset-0 pointer-events-none w-screen"></div>
            <Runes />
            <div className="fireflies-container w-screen" />
            <Fireflies />
            <Footer />
        </React.Fragment>
    );
};

const DisplayResult = ({ result }) => {
    const navigate = useNavigate();

    function handleNext() {
        sessionStorage.clear();
        navigate('/dashboard', { replace: true });
    }

    return (
        <div
            className="bg-gray-900 w-5/6 lg:max-w-3xl 
                       bg-opacity-90 rounded-2xl p-12 mystical-glow 
                       text-center flex flex-col items-center space-y-8
                       border-2 border-purple-500/40 hover:border-pink-400/60 transition-all duration-500"
        >
            {/* Decorative Icon */}
            <div className="text-5xl mb-2 animate-bounce">✨</div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-extrabold 
                           bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 
                           text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]">
                You scored {result.score}/{result.totalPossibleScore}!
            </h1>
            
            {/* Subtitle */}
            <h3 className="text-lg md:text-2xl font-light text-gray-200 italic max-w-2xl">
                Your journey through the cosmic codex is complete.
            </h3>

            {/* Percentage Bar */}
            <div className="w-11/12 h-5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out`} 
                    style={{ 
                        width: `${result.percentage}%`,
                        backgroundImage: `linear-gradient(to right, ${result.percentage >= 75 ? '#84cc16' : result.percentage >= 50 ? '#fde047' : '#ef4444'}, #a855f7)`
                    }}
                ></div>
            </div>
            
            {/* Call to Action */}
            <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-black 
                           px-12 py-5 rounded-full text-xl font-bold 
                           shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] 
                           hover:scale-110 mystical-glow transition-all duration-300"
            >
                🔮 Explore More Quests
            </button>
        </div>
    );
};

const AnswersReview = ({ answers }) => {
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const sessionQuestions = sessionStorage.getItem('Questions');
            if (!sessionQuestions) {
                throw new Error("Questions not found in session storage.");
            }
            setQuestions(JSON.parse(sessionQuestions));
            setLoading(false);
        } catch (err) {
            setError(true);
            console.error("Error loading quiz questions:", err);
        }
    }, []);

    if (loading) {
        return <h1 className="text-gray-300 animate-pulse">Loading review...</h1>;
    }
    if (error) {
        return <h1 className="text-red-400">Error loading review.</h1>;
    }

    return (
        <div className="bg-gray-900 w-5/6 lg:max-w-3xl 
                       bg-opacity-90 rounded-2xl p-12 text-center flex flex-col items-center space-y-8
                       border-2 border-purple-500/40 hover:border-pink-400/60 transition-all duration-500">
            <h3 className="text-3xl md:text-4xl font-extrabold 
                           bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 
                           text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(236,72,153,0.7)] mb-5">
                A Review of Your Quiz
            </h3>
            {answers.map((answer, i) => (
                <AnswerDisplay
                    key={i}
                    question={questions[i]}
                    answer={answer}
                    options={questions[i].options}
                />
            ))}
        </div>
    );
};

const AnswerDisplay = ({ question, answer, options }) => {
    return (
        <div className={`w-10/12 border-2 rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 
                         ${answer.isCorrect ? 'border-green-400 bg-green-950 shadow-lg' : 'border-red-400 bg-red-950 shadow-lg'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <p className="font-medium text-gray-200 text-lg mb-2 md:mb-0">{question.question}</p>
                <p className="font-bold text-gray-100 text-sm">
                    Points: <span className="text-yellow-300">{answer.pointsEarned}</span>/<span className="text-purple-300">{question.pointsAwarded}</span>
                </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
                <p className="text-gray-400">
                    Your Selection:{" "}
                    <span className='font-bold text-gray-200'>{options[answer.selectedAnswer]}</span>
                </p>
                <p className="text-gray-400">
                    Evaluation:{" "}
                    <span className={`font-bold ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default QuizResult;
