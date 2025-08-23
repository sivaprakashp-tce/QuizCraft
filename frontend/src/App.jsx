import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';
import Home from "./pages/Home" ;
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
function App() {
  return (
    <React.Fragment>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/quiz/:quizId' element={<QuizIntro />} />
                <Route path='/quiz/question/:number' element={<QuizQuestion />} />
            </Routes>
        </BrowserRouter>
    </React.Fragment>
  )
}

export default App;
