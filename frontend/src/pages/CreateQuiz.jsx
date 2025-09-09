import anime from "animejs/lib/anime.es.js";
import React, { useEffect, useRef, useState } from "react";

import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getJWTToken } from "../utils";
import Navbar from "../components/Navbar";

// Helper: decide text color based on background
const getTextColor = (bg) => {
  if (bg === "#808080" || bg === "#AD8B70") return "black";
  return "white";
};

// Ripple background with canvas
const RippleBackground = ({ setBgColor }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let cW, cH;
    let bgColor = "#AD8B70";
    let animations = [];

    const colors = ["#808080", "#800000", "#AD8B70", "#282741"];
    let colorIndex = 0;
    const colorPicker = {
      next: () => {
        colorIndex = colorIndex++ < colors.length - 1 ? colorIndex : 0;
        return colors[colorIndex];
      },
      current: () => colors[colorIndex],
    };

    function removeAnimation(animation) {
      const index = animations.indexOf(animation);
      if (index > -1) animations.splice(index, 1);
    }

    function calcPageFillRadius(x, y) {
      const l = Math.max(x - 0, cW - x);
      const h = Math.max(y - 0, cH - y);
      return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
    }

    function handleEvent(e) {
      if (e.touches) {
        e.preventDefault();
        e = e.touches[0];
      }

      const currentColor = colorPicker.current();
      const nextColor = colorPicker.next();
      const targetR = calcPageFillRadius(e.pageX, e.pageY);
      const rippleSize = Math.min(200, cW * 0.4);
      const minCoverDuration = 750;

      const pageFill = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: nextColor,
      });

      const fillAnimation = anime({
        targets: pageFill,
        r: targetR,
        duration: Math.max(targetR / 2, minCoverDuration),
        easing: "easeOutQuart",
        complete: () => {
          bgColor = pageFill.fill;
          setBgColor(bgColor); // update parent state
          removeAnimation(fillAnimation);
        },
      });

      const ripple = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: currentColor,
        stroke: { width: 3, color: currentColor },
        opacity: 1,
      });

      const rippleAnimation = anime({
        targets: ripple,
        r: rippleSize,
        opacity: 0,
        easing: "easeOutExpo",
        duration: 900,
        complete: removeAnimation,
      });

      const particles = [];
      for (let i = 0; i < 32; i++) {
        const particle = new Circle({
          x: e.pageX,
          y: e.pageY,
          fill: currentColor,
          r: anime.random(24, 48),
        });
        particles.push(particle);
      }

      const particlesAnimation = anime({
        targets: particles,
        x: (p) => p.x + anime.random(rippleSize, -rippleSize),
        y: (p) => p.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15),
        r: 0,
        easing: "easeOutExpo",
        duration: anime.random(1000, 1300),
        complete: removeAnimation,
      });

      animations.push(fillAnimation, rippleAnimation, particlesAnimation);
    }

    function Circle(opts) {
      Object.assign(this, opts);
    }

    Circle.prototype.draw = function () {
      ctx.globalAlpha = this.opacity || 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }
      ctx.closePath();
      ctx.globalAlpha = 1;
    };

    const animateCanvas = anime({
      duration: Infinity,
      update: () => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach((anim) => {
          anim.animatables.forEach((a) => {
            a.target.draw();
          });
        });
      },
    });

    const resizeCanvas = () => {
      cW = window.innerWidth;
      cH = window.innerHeight;
      c.width = cW * devicePixelRatio;
      c.height = cH * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
      animateCanvas.pause();
    };
  }, [setBgColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" />;
};

// Main CreateQuiz page
const CreateQuiz = () => {
  const [bgColor, setBgColor] = useState("#AD8B70");

  return (
    <React.Fragment>
      <Navbar />
      <RippleBackground setBgColor={setBgColor} />
      <div className="content-container w-screen min-h-screen p-5">
        <GetQuizDetails bgColor={bgColor} />
      </div>
      <Footer />
    </React.Fragment>
  );
};

const GetQuizDetails = ({ bgColor }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const JWTToken = getJWTToken();
  if (!JWTToken) {
    navigate("/login");
  }

  const onSubmit = (data) => {
    data = { ...data, institutionOnly: false };
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWTToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("The quiz is not created");
        return res.json();
      })
      .then((res) => {
        navigate(`/create/question/${res.data.quiz._id}`);
      })
      .catch((err) => {
        setError(true);
        console.log("Error found: ", err);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error Raised</div>;

  const textColor = getTextColor(bgColor);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center p-8">
      {/* Heading */}
      <h1
        className="text-5xl font-extrabold mb-12 text-center"
        style={{ color: textColor }}
      >
        Create Quiz
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-2/3 flex flex-col gap-10 items-center"
      >
        {/* Quiz Name */}
        <div className="flex flex-col w-full text-center">
          <label
            htmlFor="quiz-name"
            className="text-2xl mb-4 font-semibold"
            style={{ color: textColor }}
          >
            Enter Quiz Name
          </label>
          <input
            type="text"
            id="quiz-name"
            placeholder="Quiz Name"
            className="p-4 rounded-xl border border-gray-400 text-white text-2xl w-full"
            {...register("quizName", { required: "Quiz title is required" })}
          />
          {errors.quizName && (
            <p className="text-red-400 text-lg mt-2">
              {errors.quizName.message}
            </p>
          )}
        </div>

        {/* Quiz Description */}
        <div className="flex flex-col w-full text-center">
          <label
            htmlFor="quiz-description"
            className="text-2xl mb-4 font-semibold"
            style={{ color: textColor }}
          >
            Enter Quiz Description
          </label>
          <input
            type="text"
            id="quiz-description"
            placeholder="Quiz Description"
            className="p-4 rounded-xl border border-gray-400 text-white text-2xl w-full"
            {...register("quizDescription", {
              required: "Quiz Description is required",
            })}
          />
          {errors.quizDescription && (
            <p className="text-red-400 text-lg mt-2">
              {errors.quizDescription.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="py-4 px-8 rounded-xl text-2xl font-bold hover:scale-105 transition duration-200 shadow-lg"
          style={{
            backgroundColor: textColor === "white" ? "black" : "white",
            color: textColor === "white" ? "white" : "black",
            border: "2px solid black",
          }}
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};



export default CreateQuiz;




