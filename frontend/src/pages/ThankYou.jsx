import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ThankYou = () => {
  return (
    <React.Fragment>
        <Navbar />
            <div className="w-screen min-h-screen flex flex-col justify-center items-center gap-5 text-center">
                <h1 className="text-7xl font-bold font-dancing">Thank you for the message</h1>
                <h3 className="text-3xl font-medium">We will get back to you soon</h3>
                <a href="/home" className='text-xl font-bold px-5 py-2 bg-white border-2 border-white rounded-xl text-black hover:bg-transparent hover:text-white'>🏠 Go to Home</a>
            </div>
        <Footer />
    </React.Fragment>
  )
}

export default ThankYou