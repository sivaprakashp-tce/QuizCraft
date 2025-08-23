import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizIntro from './pages/QuizIntro';
import QuizQuestion from './pages/QuizQuestion';

function App() {
  return (
    <React.Fragment>
        <BrowserRouter>
            <Routes>
                <Route path='/quiz/:quizId' element={<QuizIntro />} />
                <Route path='/quiz/question/:number' element={<QuizQuestion />} />
            </Routes>
        </BrowserRouter>
    </React.Fragment>
  )
}

export default App
