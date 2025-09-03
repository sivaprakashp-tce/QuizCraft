import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';
import Home from "./pages/Home" ;
import Login from "./pages/Login"; 
import Profile from "./pages/Profile"; 
import Signup from "./pages/Signup";
import QuizResult from './pages/QuizResult';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound.jsx'
import CreateQuiz from './pages/CreateQuiz.jsx';
import CreateQuizQuestion from './pages/CreateQuizQuestion.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
function App() {
  return (
    <React.Fragment>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path='/quiz/:quizId' element={<QuizIntro />} />
                <Route path='/quiz/question/:number' element={<QuizQuestion />} />
                <Route path='/quiz/result' element={<QuizResult />} />
                <Route path='/create/quiz' element={<CreateQuiz />} />
                <Route path='/create/question/:quizId' element={<CreateQuizQuestion />} />
                <Route path='/leaderboard' element={<LeaderBoard />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </React.Fragment>
  )
}

export default App;

// Make sure to uncomment code that makes sure that a user can attend a quiz only once.
