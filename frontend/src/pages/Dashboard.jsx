import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
    const JWTToken = import.meta.env.VITE_JWTToken;

    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [gotUserData, setGotUserData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // /api/auth/user
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${JWTToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    setError(true);
                    console.log("Error in fetching user Data");
                    throw new Error("Error in fetching user Data");
                }
                return res.json();
            })
            .then((res) => {
                setUser(res.data.user);
                setGotUserData(true);
            })
            .catch((err) => {
                setError(true);
                throw new Error("Error arised: ", err);
            });
    }, [JWTToken]);

    useEffect(() => {
        // /api/quizzes/:stream
        if (gotUserData) {
            console.log(user);
            fetch(
                `${import.meta.env.VITE_BACKEND_URL}/quizzes/${
                    user.streamId._id
                }`,
                {
                    headers: {
                        Authorization: `Bearer ${JWTToken}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((res) => {
                    if (!res.ok) {
                        setError(true);
                        console.log("Error in fetching data for quizzes");
                        throw new Error("Error in fetching data for quizzes");
                    }
                    return res.json();
                })
                .then((res) => {
                    setQuizzes(res.data.quizzes);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(true);
                    throw new Error("Error arised: ", err);
                });
        } else {
            console.log("Error in obtaining user data");
        }
    }, [user, gotUserData, JWTToken]);

    if (loading) return <div className="">Loading...</div>;

    if (error) return <div className="">Error Occurred</div>;

    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-[92vh]">
                <DashboardHeader name={user.name} />
                <QuizListDisplay quizlist={quizzes} />
            </div>
            <Footer />
        </React.Fragment>
    );
};

const DashboardHeader = ({ name }) => {
    return (
        <React.Fragment>
            <div className="dashboard-header-cont h-64 flex flex-col justify-center items-center gap-4">
                <h1 className="text-4xl lg:text-5xl text-yellow-500 font-black">
                    Hello, {name}!
                </h1>
                <h3 className="text-xl lg:text-2xl text-slate-300">The best way to predict your future is to create it</h3>
            </div>
        </React.Fragment>
    );
};

const QuizListDisplay = ({ quizlist }) => {
    return (
        <React.Fragment>
            <div className="quiz-list-display-cont w-5/6 mx-auto">
                <h2 className="text-2xl lg:text-3xl text-amber-400 font-semibold p-2 border-b-2 border-amber-400 w-fit mb-10">
                    Quizzes for you
                </h2>
                <div className="quiz-list flex flex-col justify-center items-center gap-10 md:grid grid-cols-2 w-full">
                    {quizlist.map((quiz) => (
                        <Quizcard key={quiz._id} quiz={quiz} />
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

const Quizcard = ({ quiz }) => {
    return (
        <React.Fragment>
            <a
                href={`/quiz/${quiz._id}`}
                className="quiz-card-cont w-full border-2 border-yellow-500 hover:bg-amber-400 hover:text-slate-800 rounded-xl p-3 flex flex-col lg:flex-row justify-between items-center transition-colors hover:shadow-amber-200 shadow-2xl"
            >
                <div className="quiz-text-data lg:w-3/4 p-3">
                    <h4 className="text-2xl font-bold">{quiz.quizName}</h4>
                    <p className="mb-2">{quiz.quizDescription}</p>
                    <p className="">
                        By {quiz.userId.name} of {quiz.institutionId.name}
                    </p>
                </div>
                <div className="quiz-numeric-data flex justify-between items-center lg:flex-col gap-3 p-3">
                    <p className="text-lg font-semibold">
                        ⭐ {quiz.totalPoints}
                    </p>
                    <p className="text-lg font-semibold">
                        🔮 {quiz.numberOfQuestions}Q
                    </p>
                </div>
            </a>
        </React.Fragment>
    );
};

export default Dashboard;
