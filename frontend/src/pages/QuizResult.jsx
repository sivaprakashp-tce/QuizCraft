import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

const QuizResult = () => {
    const JWTToken = import.meta.env.VITE_JWTToken;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        try {
            setResult(JSON.parse(localStorage.getItem('QuizResult')).data.attempt)
            setLoading(false)
        } catch (err) {
            setError(true)
            console.log("Result not found", err)
            navigate('/')
        }
    }, [navigate])

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Error raised!!</h1>
    }


    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen h-[92vh] flex justify-center items-center flex-col gap-10">
                <DisplayResult result={result}/>
                <AnswersReview answers={result.answersRecorded} />
            </div>
        </React.Fragment>
    )
}

const DisplayResult = ({result}) => {4
    const navigate = useNavigate();
    function handleNext() {
        localStorage.clear()
        navigate('/', {replace: true})
    }

    return (
        <React.Fragment>
            <div className="result-container bg-white text-black w-5/6 min-h-3/5 p-10 mt-[32vh] rounded-xl shadow-xl flex flex-col justify-center text-center<span> items-center gap-3">
                <p className="">Congratulations!!</p>
                <h2 className="">You have scored</h2>
                <h1 className="text-5xl font-bold">{result.score}/{result.totalPossibleScore}</h1>
                <div className="percentage-bar w-11/12 h-10 bg-white">
                    <div className={`filled-percentage h-full bg-sky-500 w-[${result.percentage}%]`}></div>
                </div>
                <h3 className="">In {result.quiz.quizName} quiz</h3>
                <p className="">Let's go and conquer some more quizzes!!</p>
                <button onClick={handleNext} className='bg-sky-500 p-3 rounded-xl text-white font-bold'>View more Quizzes</button>
            </div>
        </React.Fragment>
    )
}

const AnswersReview = ({answers}) => {
    const [questions, setQuestions] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        try {
            setQuestions(JSON.parse(localStorage.getItem('Questions')))
            setLoading(false)
        } catch (err) {
            setError(true)
            throw new Error(err)
        }
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Error raised!!</h1>
    }

    return (
        <React.Fragment>
            <div className="answers-review-cont bg-white text-black w-5/6 min-h-2/3 rounded-xl shadow-xl flex flex-col justify-center items-center gap-3">
                <h3 className="text-3xl font-bold mb-5">A Review of your Quiz</h3>
                {answers.map((answer, i) => (
                    <AnswerDisplay key={i} question={questions[i]} answer={answer} options={questions[i].options} />
                ))}
            </div>
        </React.Fragment>
    )
}

const AnswerDisplay = ({question, answer, options}) => {
    return (
        <React.Fragment>
            <div className={`answer-display-cont w-10/12 border-2 rounded-xl p-2 flex flex-col gap-5 ${answer.isCorrect ? 'border-green-500 bg-green-200' : 'border-red-500 bg-red-200'}`}>
                <div className="answer-display-row">
                    <p className="font-medium">{question.question}</p>
                    <p className="font-bold">{answer.pointsEarned}/{question.pointsAwarded}</p>
                </div>
                <div className="answer-display-row">
                    <p className="">Option You Selected: <span className='font-bold'>{options[answer.selectedAnswer]}</span></p>
                    <p className="">Evaluation: <span className='font-bold'>{answer.isCorrect ? 'Correct' : 'Wrong'}</span></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default QuizResult