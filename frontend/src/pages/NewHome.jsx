import React from "react";
import LiquidEther from "../components/ui/LiquidEther";
import Navbar from "../components/Navbar";
// import Particles from "../components/ui/ParticlesAnimation";
import ChromaGrid from "../components/ui/ChromaGrid";
import LaserFlow from "../components/ui/LaserFlow";
import CurvedLoopText from "../components/ui/CurvedLoopText";
import ASCIIText from "../components/ui/ASCIIText";
import { WobbleCard } from "../components/ui/WobbleCard";
import SplitText from "../components/ui/SplitText";
import Footer from "../components/Footer";
import { ContactForm } from "../components/Contact";

const NewHome = () => {
    const items = [
        {
            title: "Aswitha V",
            subtitle: "Full Stack Developer",
            handle: "@aswijayan",
            borderColor: "#ffff00",
            gradient: "linear-gradient(145deg, #999, #000)",
            url: "https://github.com/aswijayan",
        },
        {
            title: "Raj Jagadeesh A P",
            subtitle: "Software Developer",
            handle: "@Raj-Jagadeesh-A-P",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #999, #000)",
            url: "https://github.com/Raj-Jagadeesh-A-P",
        },
        {
            title: "Sivaprakash P",
            subtitle: "Backend Engineer",
            handle: "@sivaprakashp-tce",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #999, #000)",
            url: "https://github.com/sivaprakashp-tce",
        },
    ];

    const wobbleCardText = [
        {
            title: "duel with riddles",
            description: "Challenge your mind with magical quizzes across potions, history, creatures, and more",
            image: "",
            bg: ""
        },
        {
            title: "Mystical Leaderboards",
            description: "Climb the enchanted leaderboard and prove your prowess among fellow knowledge sorcerers.",
            image: "",
            bg: ""
        },
        {
            title: "Conjure your own quizzes",
            description: "craft questions, set challenges, and enchant your friends",
            image: "",
            bg: ""
        },
        {
            title: "Immerse in the world of Wizardry",
            description: "where every answer is a step toward mastery.",
            image: "",
            bg: ""
        }
    ]

    return (
        <React.Fragment>
            <Navbar />
            <div className="w-screen min-h-screen flex justify-center items-center flex-col">
                <div className="lg:mt-24 lg:w-4/5 mx-auto h-full text-center flex flex-col gap-7">
                    <HeroSection />
                </div>
                <div style={{ width: "100vw", height: "100vh", position: "absolute", zIndex: -1 }}>
                    <LiquidEther />
                </div>
            </div>
            <div className="pt-24 w-screen min-h-screen">
                <h2 className="capitalize text-center text-4xl font-bold pb-10 font-caesar">Conjure your inner quizmaster</h2>
                <div className="features-wrapper flex lg:grid grid-cols-2 grid-rows-2 w-4/5 h-full flex-col justify-center items-center gap-10 mx-auto p-5">
                    {wobbleCardText.map((card) => (
                        <WobbleCard key={card.title} className={'wobble-card-home'} children={<WobbleCardContent title={card.title} description={card.description} />} />
                    ))}
                </div>
            </div>
            <div className="relative w-screen min-h-screen">
                <div style={{ width: "100vw", height: "100vh", position: "absolute", overflow: "hidden" }} className="hidden lg:block">
                    <LaserFlow />
                </div>
                <div className="w-screen h-screen">
                    <LaserFlowText />
                </div>
            </div>
            <div className="bg-[#FFFF00] text-black">
                <CurvedLoopText
                    className={"text-black"}
                    marqueeText="Win ✦ the ✦ world ✦ with ✦ QuizCraft ✦ "
                    speed={3}
                    curveAmount={(window.innerWidth > 768) ? 500 : 1000}
                    direction="right"
                    interactive={true}
                />
            </div>
            <div className="w-screen h-screen bg-[#FFFF00] flex justify-around items-center font-bold flex-col">
                <h2 className="text-black text-center text-5xl">Know your spells and potions with fun in</h2>
                <ASCIIText
                    text="QuizCraft"
                    enableWaves={true}
                    asciiFontSize={3}
                />
                <div className="cta-buttons z-10">
                    <a href="/login" className="bg-black text-[#ffff00] hover:bg-transparent hover:text-black border-2 border-black px-5 py-2 rounded-xl text-2xl font-bold">Join Now</a>
                </div>
            </div>
            <div className="contact-section-wrapper md:w-10/12 w-full min-h-[90vh] flex justify-center items-center mx-auto flex-col-reverse md:flex-row">
                <div className="flex justify-center items-center flex-col w-1/2">
                    <h3 className="text-4xl font-medium pb-2 lg:relative lg:left-36 font-serif border-b-2 border-[#ffff00] w-fit mx-auto">Creators</h3>
                    <div style={{ position: "relative" }} className="h-[400px] lg:h-auto p-5">
                        <ChromaGrid
                            items={items}
                            radius={300}
                            damping={0.45}
                            fadeOut={0.6}
                            ease="power3.out"
                        />
                    </div>
                </div>
                <div className="md:w-1/2 pb-10">
                    <div className="lander-wrapper h-24 m-14 flex flex-col justify-around items-center">
                        <h1 className="font-bold text-3xl md:text-5xl text-white">Contact Us</h1>
                        <h3 className="font-semibold text-slate-400 uppercase">Get in touch With us</h3>
                    </div>
                    <div className="contact-wrapper bg-white rounded-xl text-black md:w-10/12 w-full flex justify-center items-center mx-auto flex-col-reverse">
                        <ContactForm />
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
};


const HeroSection = () => {
    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };
    return (
        <React.Fragment>
            <SplitText
                text="Welcome to QuizCraft"
                className="text-5xl lg:text-7xl font-black leading-snug text-center font-bungee"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                tag="h1"
                onLetterAnimationComplete={handleAnimationComplete}
            />
            <h3 className="font-macondo text-xl lg:text-3xl font-semibold w-4/5 mx-auto">A realm where spellbinding questions test your knowledge and sharpen your magical mind.</h3>
            <a className="bg-white text-xl font-bold border-2 border-white w-fit mx-auto text-black px-5 py-3 rounded-xl hover:bg-transparent hover:text-white transition-colors" href="/login">Get Started</a>
        </React.Fragment>
    )
}

const WobbleCardContent = ({ title, description }) => {
    return (
        <React.Fragment>
            <div className="cont w-full h-full p-5">
                <div className="p-7 w-full border-2 border-white mx-auto rounded-xl">
                    <h4 className="capitalize font-macondo text-yellow-400 text-xl font-semibold">{title}</h4>
                    <p className="capitalize font-sans text-xl font-semibold">{description}</p>
                </div>
            </div>
        </React.Fragment>
    )
}

const LaserFlowText = () => {
    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };
    return (
        <React.Fragment>
            <div className="w-full h-full flex justify-evenly items-center">
                <div className="">
                    <SplitText
                        text="Step into a world where knowledge is your wand and wisdom your greatest enchantment!"
                        className="text-5xl lg:text-6xl lg:w-3/4 font-bold px-10 font-caesar text-[#ffff00]"
                        delay={100}
                        duration={0.6}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                        tag="h2"
                        onLetterAnimationComplete={handleAnimationComplete}
                    />
                </div>
                <div className=""></div>
            </div>
        </React.Fragment>
    )
}

export default NewHome;

