import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { getJWTToken } from "../utils";

const UserAttempts = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-screen flex justify-center items-center">
                <Attempts />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const Attempts = () => {
    const { userId } = useParams();
    const JWTToken = getJWTToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz/attended/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWTToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    setError(true);
                    throw new Error("Error Raised ");
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                setAttempts(res.data.attempts);
                setLoading(false);
            })
            .catch((err) => {
                setError(true);
                console.log("Error Raised: ", err);
            });
    }, [JWTToken, userId]);

    if (loading) return <div className="">Loading...</div>;

    if (error) return <div className="">Error Raised</div>;

    return (
        <React.Fragment>
            <div className="attempts-cont bg-white w-11/12 lg:w-5/6 text-black rounded-xl">
                <h1 className="text-3xl lg:text-5xl text-center font-black p-4">Attempts</h1>
                {attempts.map((attempt) => (
                    <AttemptCard attempt={attempt} key={attempt._id} />
                ))}
            </div>
        </React.Fragment>
    );
};

const AttemptCard = ({attempt}) => {
    return (
        <React.Fragment>
            <div className="attempt-cont flex justify-around items-center w-5/6 border-2 border-black mx-auto m-3 p-4 rounded-xl">
                <div className="column">
                    <h3 className="">{attempt.quizId.quizName}</h3>
                    <h5 className="">{attempt.quizId.quizDescription}</h5>
                </div>
                <div className="column">
                    <p className="">{attempt.score}/{attempt.totalPossibleScore}</p>
                    <p className="">{attempt.percentage}%</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserAttempts;
