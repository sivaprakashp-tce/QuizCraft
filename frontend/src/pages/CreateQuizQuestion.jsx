import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { getJWTToken } from "../utils";

const CreateQuizQuestion = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-[90vh] flex justify-center items-center">
                <GetQuestion />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const GetQuestion = () => {
    const { quizId } = useParams();
    const [quesAdded, setQuesAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const JWTToken = getJWTToken();
    if (!JWTToken) {
        Navigate("/login");
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setLoading(true);
        let body = {
            quizId: quizId,
            question: data.question,
            options: [data.option1, data.option2, data.option3, data.option4],
            correctAnswer: Number(data.correctAnswer),
            pointsAwarded: Number(data.pointsAwarded),
            questionType: "multiple-choice",
        };

        // console.log(JSON.stringify(body))

        fetch(`${import.meta.env.VITE_BACKEND_URL}/question`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) {
                    setError(true);
                    throw new Error("Question Not Added");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setLoading(false);
                setQuesAdded(true);
            })
            .catch((err) => {
                setError(true);
                console.log("Error Found: ", err);
            });
    };

    if (loading) return <div className="">Loading...</div>;

    if (error) return <div className="">Error Raised</div>;

    if (quesAdded) return <QuesAddedeMsg />;

    return (
        <React.Fragment>
            <div className="get-question-cont w-full h-full flex justify-center items-center">
                <div className="get-question-wrapper bg-white text-black w-5/6 p-5 rounded-xl ">
                    <h3 className="">Question</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            name="question"
                            id="Question"
                            className="border-b-2 border-black"
                            placeholder="Enter the question here"
                            required
                            {...register("question")}
                        />
                        <div className="options-wrapper">
                            <div className="option-cont">
                                <label htmlFor="">1.</label>
                                <input
                                    type="text"
                                    name="option-1"
                                    id=""
                                    className="border-b-2 p-2 "
                                    placeholder="Enter Option 1"
                                    required
                                    {...register("option1")}
                                />
                            </div>
                            <div className="option-cont">
                                <label htmlFor="">2.</label>
                                <input
                                    type="text"
                                    name="option-2"
                                    id=""
                                    className="border-b-2 p-2 "
                                    placeholder="Enter Option 2"
                                    required
                                    {...register("option2")}
                                />
                            </div>
                            <div className="option-cont">
                                <label htmlFor="">3.</label>
                                <input
                                    type="text"
                                    name="option-3"
                                    id=""
                                    className="border-b-2 p-2 "
                                    placeholder="Enter Option 3"
                                    required
                                    {...register("option3")}
                                />
                            </div>
                            <div className="option-cont">
                                <label htmlFor="">4.</label>
                                <input
                                    type="text"
                                    name="option-4"
                                    id=""
                                    className="border-b-2 p-2 "
                                    placeholder="Enter Option 4"
                                    required
                                    {...register("option4")}
                                />
                            </div>
                        </div>
                        <div className="points-awarded-cont">
                            <label htmlFor="pointsAwarded">
                                Enter Points for the Question
                            </label>
                            <input
                                type="number"
                                name="pointsAwarded"
                                id="pointsAwarded"
                                placeholder="Points"
                                className="border-2 border-black p-2"
                                required
                                {...register("pointsAwarded")}
                                min={1}
                                max={100}
                            />
                        </div>
                        <div className="correct-answer-cont">
                            <div className="">
                                <input
                                    type="radio"
                                    name="correct-answer"
                                    id="correct-answer-0"
                                    className=""
                                    required
                                    value={0}
                                    {...register("correctAnswer")}
                                />
                                <label htmlFor="correct-answer-0">
                                    Option 1
                                </label>
                            </div>
                            <div className="">
                                <input
                                    type="radio"
                                    name="correct-answer"
                                    id="correct-answer-1"
                                    className=""
                                    value={1}
                                    {...register("correctAnswer")}
                                />
                                <label htmlFor="correct-answer-0">
                                    Option 2
                                </label>
                            </div>
                            <div className="">
                                <input
                                    type="radio"
                                    name="correct-answer"
                                    id="correct-answer-2"
                                    className=""
                                    value={2}
                                    {...register("correctAnswer")}
                                />
                                <label htmlFor="correct-answer-0">
                                    Option 3
                                </label>
                            </div>
                            <div className="">
                                <input
                                    type="radio"
                                    name="correct-answer"
                                    id="correct-answer-3"
                                    className=""
                                    value={3}
                                    {...register("correctAnswer")}
                                />
                                <label htmlFor="correct-answer-0">
                                    Option 4
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-black text-white font-medium p-3 rounded-xl cursor-pointer"
                        >
                            + Add Question
                        </button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

const QuesAddedeMsg = () => {
    const { quizId } = useParams();
    return (
        <React.Fragment>
            <h2 className="">Question was added successfully</h2>
            <div className="links flex flex-col gap-5 justify-center items-center">
                <a href="/dashboard">Finished</a>
                <a href={`/create/question/${quizId}`}>Add Another Question</a>
            </div>
        </React.Fragment>
    );
};

export default CreateQuizQuestion;
