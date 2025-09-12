import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ContactForm } from '../components/Contact'

const ContactPage = () => {
  return (
    <React.Fragment>
      <div className="mt-28 w-screen bg-myBlack">
        <Navbar />
        <div className="lander-wrapper h-24 m-14 flex flex-col justify-around items-center">
          <h1 className="font-bold text-3xl md:text-5xl text-white">Contact Us</h1>
          <h3 className="font-semibold text-slate-400 uppercase">Get in touch With us</h3>
        </div>
        <div className="contact-wrapper bg-white text-black md:w-10/12 w-full min-h-[90vh] flex justify-center items-center mx-auto flex-col-reverse md:flex-row">
          <ContactForm />
        </div>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default ContactPage
