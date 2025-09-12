import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';
import Home from "./pages/Home"; 
import Login from "./pages/Login"; 
import Profile from "./pages/Profile"; 
import Signup from "./pages/Signup";
import QuizResult from './pages/QuizResult';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound.jsx';
import CreateQuiz from './pages/CreateQuiz.jsx';
import CreateQuizQuestion from './pages/CreateQuizQuestion.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import UserAttempts from './pages/UserAttempts.jsx';
import QuizzesFromUser from './pages/QuizzesFromUser.jsx';
import EditQuestion from './pages/EditQuestion.jsx';
import EditQuiz from './pages/EditQuiz.jsx';
import About from '/src/pages/About.jsx';
import NewHome from './pages/NewHome.jsx';
import ThankYou from './pages/ThankYou.jsx';

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
                <Route path="/about" element={<About />} /> 
                <Route path='/quiz/:quizId' element={<QuizIntro />} />
                <Route path='/quiz/question/:number' element={<QuizQuestion />} />
                <Route path='/quiz/result' element={<QuizResult />} />
                <Route path='/create/quiz' element={<CreateQuiz />} />
                <Route path='/create/question/:quizId' element={<CreateQuizQuestion />} />
                <Route path='/leaderboard' element={<LeaderBoard />} />
                <Route path='/attempts/:userId' element={<UserAttempts />} />
                <Route path='/user/quizzes' element={<QuizzesFromUser />} />
                <Route path='/edit/question/:questionId' element={<EditQuestion />} />
                <Route path='/edit/quiz/:quizId' element={<EditQuiz />} />
                <Route path='/home' element={<NewHome />} />
                <Route path='/thank-you' element={<ThankYou />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </React.Fragment>
  )
}

export default App;