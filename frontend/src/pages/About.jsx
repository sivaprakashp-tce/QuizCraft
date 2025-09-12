import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';

const About = () => {
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // anime.js animation for the main heading
    anime({
      targets: headingRef.current,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 1500,
      easing: 'easeOutQuart',
      delay: 500,
    });

    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const calculateParallax = (elementRef, sensitivity = 0.02) => {
    if (!elementRef.current) return { x: 0, y: 0 };
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (mousePosition.x - centerX) * sensitivity;
    const deltaY = (mousePosition.y - centerY) * sensitivity;
    return { x: deltaX, y: deltaY };
  };

  const headingParallax = calculateParallax(headingRef, 0.015);
  const subtitleParallax = calculateParallax(subtitleRef, 0.01);

  return (
    <React.Fragment>
      {/* Visual effect that follows the cursor */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-[#FFC107] opacity-60 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 filter blur-md z-50 transition-transform duration-150 ease-out"
        style={{ transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)` }}
      ></div>

      <Navbar />
      <div className="mt-24 w-screen min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#101026] to-[#1a1a33] text-gray-200">
        <motion.div
          className="max-w-4xl mx-auto py-16 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <h1 
              ref={headingRef} 
              className="text-4xl md:text-5xl font-bold text-[#FFC107] font-serif mb-4 relative transition-transform duration-75 ease-out"
              style={{ transform: `translate3d(${headingParallax.x}px, ${headingParallax.y}px, 0)` }}
            >
              QuizCraft: The Quest for Knowledge
            </h1>
            <p 
              ref={subtitleRef} 
              className="text-lg md:text-xl text-gray-400 italic mb-12 relative transition-transform duration-75 ease-out"
              style={{ transform: `translate3d(${subtitleParallax.x}px, ${subtitleParallax.y}px, 0)` }}
            >
              A magical platform powered by modern technology.
            </p>
          </div>
          
          <motion.div 
            className="bg-black/40 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl border border-[#FFD700] space-y-8"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">Our Mission & Vision</h2>
              <p className="text-gray-300">
                Our mission is to create a captivating and magical quizzing experience for enthusiasts of the wizarding world. We aim to blend the joy of discovery with robust, professional-grade technology. QuizCraft is designed to be more than a simple quiz site; it's a living, breathing digital realm where users can test their knowledge, track their progress, and contribute to a vibrant community.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">The Platform</h2>
              <p className="text-gray-300">
                QuizCraft is a full-stack web application designed and built from the ground up. It provides a secure, reliable, and scalable platform for a range of users, from students and teachers to dedicated admins. Our system ensures a personalized experience, offering features like user profiles, real-time leaderboards, and detailed analytics for quiz creators.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">Core Technology Stack</h2>
              <p className="text-gray-300 mb-6">
                Behind the scenes, QuizCraft is a powerful fusion of modern, industry-standard technologies.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Frontend Section */}
                <motion.div
                  className="bg-black/50 p-6 rounded-xl border border-[#FFD700]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-[#FFC107] mb-2">Frontend: The Spellbook 🪄</h3>
                  <p className="text-gray-400 mb-2">
                    Our magical user interface is built for speed and immersion.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>React & Vite:</strong> A powerful, modern framework for a fast, responsive UI.</li>
                    <li><strong>Tailwind CSS:</strong> For a consistent, magical design system.</li>
                    <li><strong>Framer Motion & Anime.js:</strong> To create fluid, enchanting animations and transitions.</li>
                    <li><strong>JWT-based Authentication:</strong> Secure user sessions and role-based views.</li>
                  </ul>
                </motion.div>

                {/* Backend Section */}
                <motion.div
                  className="bg-black/50 p-6 rounded-xl border border-[#FFD700]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-[#FFC107] mb-2">Backend: The Magical Nexus 🔮</h3>
                  <p className="text-gray-400 mb-2">
                    A secure and scalable API handles all platform logic and data.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>Node.js & Express.js:</strong> A robust and scalable foundation for our API.</li>
                    <li><strong>MongoDB:</strong> A flexible NoSQL database to store quizzes, questions, and user data.</li>
                    <li><strong>JWT & Bcrypt:</strong> Secure, token-based authentication with password hashing.</li>
                    <li><strong>Role-Based Access Control:</strong> Ensures a secure experience for all users.</li>
                  </ul>
                </motion.div>
              </div>
            </section>

            <p className="text-center text-gray-400 italic pt-4">
              QuizCraft is a project born out of passion and a commitment to quality. Thank you for joining our quest!
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default About;