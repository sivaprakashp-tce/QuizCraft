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
              About QuizCraft: Your Magical Journey
            </h1>
            <p 
              ref={subtitleRef} 
              className="text-lg md:text-xl text-gray-400 italic mb-12 relative transition-transform duration-75 ease-out"
              style={{ transform: `translate3d(${subtitleParallax.x}px, ${subtitleParallax.y}px, 0)` }}
            >
              The secrets of the wizarding world await.
            </p>
          </div>
          
          <motion.div 
            className="bg-black/40 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl border border-[#FFD700] space-y-8"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">Our Mission</h2>
              <p className="text-gray-300">
                Welcome, young wizard, to the enchanting halls of **QuizCraft**—the premier destination for all aspiring witches and wizards to test their magical prowess. Our mission is to transport you from the mundane world into a realm of wonder and wisdom, where every question is a spell and every correct answer earns you a place among the brightest of your generation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">The Magic Behind the Quizzes</h2>
              <p className="text-gray-300">
                Here at QuizCraft, we believe that learning should be an adventure. Our quizzes are meticulously crafted to challenge your knowledge of spells, magical creatures, legendary artifacts, and the rich history of the wizarding world. Whether you're a first-year student or a seasoned professor, there's always something new to discover.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-4">Our Features</h2>
              <ul className="list-disc list-inside space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#FFC107] font-bold mr-2 text-xl">&bull;</span>
                  <div>
                    <strong className="text-lg text-[#FFD700]">The Sorting Hat Quiz:</strong> Discover your true house! Our unique sorting algorithm analyzes your answers to determine whether you belong in Gryffindor, Hufflepuff, Ravenclaw, or Slytherin.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFC107] font-bold mr-2 text-xl">&bull;</span>
                  <div>
                    <strong className="text-lg text-[#FFD700]">Merit Points & House Cup:</strong> Compete against other players to earn merit points for your house. Every question you answer correctly contributes to your house's standing, bringing you one step closer to winning the coveted House Cup.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFC107] font-bold mr-2 text-xl">&bull;</span>
                  <div>
                    <strong className="text-lg text-[#FFD700]">Customizable Scrolls:</strong> For our most ambitious wizards, our "Create Your Own Scroll" feature allows you to craft your own quizzes and challenge your friends. Become a master Scribe and share your magical knowledge with the world.
                  </div>
                </li>
              </ul>
            </section>

            <p className="text-center text-gray-400 italic pt-4">
              So grab your wand, put on your robes, and prepare to embark on a quest for knowledge. The secrets of the wizarding world await!
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default About;