import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

const QuizQuestion = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen h-[92vh] flex justify-center items-center">
                <Question />
            </div>
        </React.Fragment>
    );
};

const Question = () => {
    const JWTToken = import.meta.env.VITE_JWTToken;

    const navigate = useNavigate();

    const { number } = useParams();
    const qn = Number(number)
    const [question, setQuestion] = useState(null);
    const [noOfQues, setNoOfQues] = useState(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            let check = localStorage.getItem("Questions");
            if (check) {
                let questions = JSON.parse(check);
                setNoOfQues(questions.length)
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

        let answers = JSON.parse(localStorage.getItem('SelectedAnswers'))
        setSelectedOptionIndex(answers[qn-1].selectedAnswer)
    }, [qn]);

    if (error) {
        return <div className="">Error raised</div>;
    }

    if (loading) {
        return <div className="">Loading...</div>;
    }

    const saveOption = () => {
        let ansArr = JSON.parse(localStorage.getItem('SelectedAnswers'));
        localStorage.removeItem('SelectedAnswers')
        ansArr[qn-1].selectedAnswer = selectedOptionIndex
        localStorage.setItem('SelectedAnswers', JSON.stringify(ansArr))
    }

    const handlePrevious = () => {
        saveOption()
        navigate(`/quiz/question/${qn - 1}`, {replace: true})
    }

    const handleNext = () => {
        saveOption()
        navigate(`/quiz/question/${qn + 1}`, {replace: true})
    }

    const handleSubmit = () => {
        setLoading(true)
        let ansArr = JSON.parse(localStorage.getItem('SelectedAnswers'));
        localStorage.removeItem('SelectedAnswers')
        ansArr[qn-1].selectedAnswer = selectedOptionIndex
        localStorage.setItem('SelectedAnswers', JSON.stringify(ansArr))
        let quizId = JSON.parse(localStorage.getItem('Questions'))[0].quizId

        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/attended`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quizId: quizId,
                answers: ansArr,
                timeSpent: 1200
            })
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("Didn't save attempt")
            }
        }).then((res) => {
            localStorage.setItem('QuizResult', JSON.stringify(res))
            localStorage.removeItem("SelectedAnswers")
            navigate('/quiz/result', { replace: true })
        }).catch((err) => console.log("Error in posting the attempt", err))
    }

    return (
        <React.Fragment>
            <div className="question-cont bg-white text-black w-11/12 lg:w-5/6 min-h-2/3 lg:h-5/6 rounded-xl shadow-xl flex justify-center items-center">
                <div className="question-wrapper w-5/6 flex flex-col justify-around gap-5 lg:gap-10 p-5">
                    <div className="question-text-wrapper">
                        <h3 className="font-semibold text-lg text-gray-600">Question {qn}</h3>
                        <h2 className="font-bold text-3xl">{question.question}</h2>
                    </div>
                    <div className="question-options flex flex-col justify-center items-center lg:grid grid-cols-2 grid-rows-2 gap-5 lg:gap-10 w-full lg:w-5/6 mx-auto">
                        {question.options.map((option, i) => (
                            <button className={`py-8 px-14 w-10/12 lg:w-auto text-xl border-2  rounded-xl  text-white font-semibold text-center flex justify-center items-center hover:bg-sky-500 hover:border-sky-600 transition-colors cursor-pointer ${(selectedOptionIndex == i) ? 'bg-sky-500 border-sky-600' : 'bg-gray-600 border-gray-800' }`} key={i} onClick={() => setSelectedOptionIndex(i)}>{option}</button>
                        ))}
                    </div>
                    <div className="question-nav-buttons w-full flex justify-between items-center">
                        <button onClick={handlePrevious} className={`quiz-nav-button ${(qn > 1) ? 'block' : 'invisible'}`}>Previous</button>
                        {(qn == noOfQues) ? 
                        (<button className="quiz-nav-button" onClick={handleSubmit}>Submit</button>) : 
                        (<button onClick={handleNext} id='nav-next-btn' className="quiz-nav-button">Next</button>)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default QuizQuestion;
