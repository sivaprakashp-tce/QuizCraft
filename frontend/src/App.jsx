import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';
import Home from "./pages/Home" ;
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import QuizResult from './pages/QuizResult';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <React.Fragment>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/quiz/:quizId' element={<QuizIntro />} />
                <Route path='/quiz/question/:number' element={<QuizQuestion />} />
                <Route path='/quiz/result' element={<QuizResult />} />
            </Routes>
        </BrowserRouter>
    </React.Fragment>
  )
}

export default App;

// Make sure to uncomment code that makes sure that a user can attend a quiz only once.
