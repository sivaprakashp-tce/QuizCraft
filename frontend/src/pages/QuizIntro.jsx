import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Navigate, useParams } from "react-router-dom";

const QuizIntro = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="website-cont w-screen h-[92vh] flex justify-center items-center">
                <QuizContainer />
            </div>
        </React.Fragment>
    );
};

const QuizContainer = () => {
    const { quizId } = useParams();
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const JWTToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGE0MzQxODZkYzFjNmYwNWZiNDk1NWIiLCJpYXQiOjE3NTU4NTY0MzAsImV4cCI6MTc1NTk0MjgzMH0.4pHr-oGDo0ueITrmRryMojuKVj-d4iPRuy5uk2NWNSw";

    useEffect(() => {
        try {
            fetch(`http://localhost:5500/api/quiz/${quizId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${JWTToken}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setQuizDetails(data.data.quiz);
                        setLoading(false)
                    } else {
                        throw new Error(data.message || "Failed to fetch quiz");
                    }
                })
                .catch((error) => console.error("Error fetching quiz data:", error));
        } catch (err) {
            setError(true)
            console.log("Error in getting the details of the quiz", err);
        }

        try {
            fetch(`http://localhost:5500/api/quiz/questions/${quizId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${JWTToken}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    let answers = [];
                    for (let i = 0; i < res.data.quizInfo.numberOfQuestions; i++) {
                        answers.push({
                            questionId: res.data.questions[i]._id,
                            selectedAnswer: -1
                        })
                    }
                    localStorage.setItem("Questions", JSON.stringify(res.data.questions))
                    localStorage.setItem('SelectedAnswers', JSON.stringify(answers));
                });
        } catch (err) {
            setError(true)
            console.log("Error in getting the questions of the quiz", err);
        }

        

    }, [quizId]);

    if (error) {
        return (
            <div className="">Error raised</div>
        )
    }

    if (loading) {
        return (
            <div className="">Loading...</div>
        )
    }


    return (
        <React.Fragment>
            <div className="quiz-container w-10/12 h-1/2 md:h-5/6 bg-white rounded-xl shadow-xl text-black flex justify-center items-center text-center">
                <div className="content-wrapper w-11/12 md:w-5/6 lg:w-4/6 h-10/12 md:h-5/6 lg:h-4/6 flex flex-col justify-around items-center">
                    <h1 className="text-4xl md:text-6xl font-bold">
                        {quizDetails.quizName}
                    </h1>
                    <h3 className="text-xl md:text-3xl font-medium">
                        {quizDetails.quizDescription}
                    </h3>
                    <div className="creator-info-group md:text-xl">
                        <p className="">By {quizDetails.userId.name}</p>
                        <p className="">From {quizDetails.institutionId.name}</p>
                    </div>
                    <a className="bg-black text-white px-5 py-2 rounded-xl text-lg font-bold cursor-pointer" href="/quiz/question/1">
                        Start
                    </a>
                </div>
            </div>
        </React.Fragment>
    );
};

export default QuizIntro;
