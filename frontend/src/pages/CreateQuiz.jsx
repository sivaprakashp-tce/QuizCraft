import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { replace, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreateQuiz = () => {
    // if (JSON.parse(localStorage.getItem('token'))) navigate('/login', replace);
    return (
        <React.Fragment>
            <Navbar />
            <div className="content-container w-screen min-h-screen p-5">
                <GetQuizDetails />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const GetQuizDetails = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const navigate = useNavigate();

    const JWTtoken = JSON.parse(localStorage.getItem('token'))

    const onSubmit = (data) => {
        data = {...data, institutionOnly: false}
        setLoading(true)
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWTtoken}`
            },
            body: JSON.stringify(data)
        }).then((res) => {
            if (!res.ok) {
                throw new Error("The quiz is not created")
            } else {
                return res.json()
            }
        }).then((res) => {
            navigate(`/create/question/${res.data.quiz._id}`)
        }).catch((err) => {
            setError(true)
            console.log("Error found: ", err)
        })
    };

    if (loading) return <div className="">Loading...</div>

    if (error) return <div className="">Error Raised</div>

    return (
        <React.Fragment>
            <div className="get-quiz-details-wrapper w-11/12 lg:w-5/6 p-10 rounded-xl shadow-xl mx-auto flex justify-center items-center bg-white text-black ">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="wrapper flex justify-center items-center flex-col gap-5">
                        <div className="input-field-wrapper">
                            <label htmlFor="quiz-name">Enter Quiz Name: </label>
                            <input
                                type="text"
                                className="get-quiz-details-input"
                                name="quiz-name"
                                id="quiz-name"
                                placeholder="Quiz Title"
                                {...register("quizName", {
                                    required: "Quiz title is required",
                                })}
                            />
                        </div>
                        {errors.quizName && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.quizName.message}
                            </p>
                        )}
                        <div className="input-field-wrapper">
                            <label htmlFor="quiz-description" className="">
                                Enter Quiz Description:{" "}
                            </label>
                            <input
                                type="text"
                                className="get-quiz-details-input"
                                name="quiz-description"
                                id="quiz-description"
                                placeholder="Quiz Desription"
                                {...register("quizDescription", {
                                    required: "Quiz Description is required",
                                })}
                            />
                        </div>
                        {errors.quizDescription && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.quizDescription.message}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="bg-black text-white p-3 rounded-xl"
                        >
                            Create Quiz
                        </button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export default CreateQuiz;
