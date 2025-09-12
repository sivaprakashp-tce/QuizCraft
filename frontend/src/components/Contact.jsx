import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const ContactForm = () => {
  useGSAP(() => {
    const formElements = gsap.utils.toArray('.contact-form-element')
    formElements.forEach((element, i) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'bottom bottom',
          end: 'bottom 80%'
        },
        x: 30*(i+1),
        opacity: 0,
        duration: 1
      })
    })
    gsap.from('button', {
      scrollTrigger: {
        trigger: 'button',
        start: 'bottom bottom',
        end: 'top 80%',
        scrub: 1
      },
      y: 30,
      opacity: 0,
      duration: 1
    })
  }, [])
  return (
    <React.Fragment>
      <form className="w-4/5 h-full flex flex-col justify-around items-center" action="https://formsubmit.co/d2b37987e336eaae9eab03c4ce3a8f06" method="POST">
        <input type="hidden" name="_next" value="https://quizcraft-tce.netlify.app/thank-you" />
        <div className="contact-form-element">
          <label htmlFor="Name">
            Your Name<span className="text-red-600 font-semibold">*</span>
          </label>
          <input
            type="text"
            name="Name"
            id="Name"
            className="contact-form-input-field"
            required
          />
        </div>
        <div className="contact-form-element">
          <label htmlFor="E-Mail">
            Your E-Mail<span className="text-red-600 font-semibold">*</span>
          </label>
          <input
            type="email"
            name="E-Mail"
            id="E-Mail"
            className="contact-form-input-field"
            required
          />
        </div>
        <div className="contact-form-element">
          <label htmlFor="Message">
            Your Message<span className="text-red-600 font-semibold">*</span>
          </label>
          <textarea
            name="Message"
            id="Message"
            className="contact-form-input-field h-32"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold m-5 text-xl hover:scale-[1.02] transition-transform"
        >
          Send
        </button>
      </form>
    </React.Fragment>
  );
};