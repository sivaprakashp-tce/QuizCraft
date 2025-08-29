import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CreateQuiz = () => {
  return (
    <React.Fragment>
        <Navbar />
        <div className="content-container w-screen min-h-screen">
            <GetQuizDetails />
        </div>
        <Footer />
    </React.Fragment>
  )
}

const GetQuizDetails = () => {
    return (
        <React.Fragment>
            <div className="get-quiz-details-wrapper w-11/12 lg:w-5/6 p-10 rounded-xl shadow-xl mx-auto flex justify-center items-center bg-white text-black ">
                <div className="wrapper flex justify-center items-center flex-col gap-5">
                    <div className="input-field-wrapper">
                        <label htmlFor="quiz-name">Enter Quiz Name: </label>
                        <input type="text" className='get-quiz-details-input' name="quiz-name" id="quiz-name" placeholder='Quiz Title' />
                    </div>
                    <div className="input-field-wrapper">
                        <label htmlFor="quiz-description" className="">Enter Quiz Description: </label>
                        <input type="text" className="get-quiz-details-input" name="quiz-description" id='quiz-description' placeholder='Quiz Desription' />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CreateQuiz