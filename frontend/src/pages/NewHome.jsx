import React from "react";
import LiquidEther from "../components/ui/LiquidEther";
import Navbar from "../components/Navbar";
import Particles from "../components/ui/ParticlesAnimation";
import ChromaGrid from "../components/ui/ChromaGrid";
import LaserFlow from "../components/ui/LaserFlow";
import CurvedLoopText from "../components/ui/CurvedLoopText";
import ASCIIText from "../components/ui/ASCIIText";
import { WobbleCard } from "../components/ui/WobbleCard";

const NewHome = () => {
    const items = [
        {
            title: "Aswitha V",
            subtitle: "Full Stack Developer",
            handle: "@aswijayan",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #3B82F6, #000)",
            url: "https://github.com/aswijayan",
        },
        {
            title: "Raj Jagadeesh A P",
            subtitle: "Software Developer",
            handle: "@Raj-Jagadeesh-A-P",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #3B82F6, #000)",
            url: "https://github.com/Raj-Jagadeesh-A-P",
        },
        {
            title: "Sivaprakash P",
            subtitle: "Backend Engineer",
            handle: "@sivaprakashp-tce",
            borderColor: "#3B82F6",
            gradient: "linear-gradient(145deg, #3B82F6, #000)",
            url: "https://github.com/sivaprakashp-tce",
        },
    ];

    return (
        <React.Fragment>
            <Navbar />
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "relative",
                }}
            >
                <LiquidEther />
            </div>
            <div className="w-screen h-screen">
                <WobbleCard />
            </div>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <LaserFlow />
            </div>
            <div className="bg-[#FFFF00] text-black">
                <CurvedLoopText
                    className={"text-black"}
                    marqueeText="Win ✦ the ✦ world ✦ with ✦ QuizCraft ✦ "
                    speed={3}
                    curveAmount={500}
                    direction="right"
                    interactive={true}
                />
            </div>
            <div className="w-screen h-screen bg-[#FFFF00]">
                <ASCIIText
                    text="QuizCraft"
                    enableWaves={true}
                    asciiFontSize={3}
                />
            </div>
            <div
                style={{
                    width: "100vw",
                    height: "600px",
                    position: "relative",
                }}
            >
                <ChromaGrid
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </div>
        </React.Fragment>
    );
};

export default NewHome;
