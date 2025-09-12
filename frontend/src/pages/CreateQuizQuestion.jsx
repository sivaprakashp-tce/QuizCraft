import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import anime from "animejs";
import { Plus, Minus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams, Navigate } from "react-router-dom";
import { getJWTToken } from "../utils";

export default function CreateQuizQuestion() {
  const [expanded, setExpanded] = useState(false);
  const [points, setPoints] = useState(1);
  const [hoverC, setHoverC] = useState(false);
  const [hoverQ, setHoverQ] = useState(false);

  const { quizId } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quesAdded, setQuesAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const JWTToken = getJWTToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    anime({
      targets: ".arrow-animate",
      translateX: [0, 15, 0],
      duration: 1200,
      easing: "easeInOutSine",
      loop: true,
    });
  }, []);

  if (!JWTToken) {
    return <Navigate to="/login" />;
  }

  const onSubmit = (data) => {
    setLoading(true);

    let body = {
      quizId: quizId,
      question: data.question,
      options: [data.option1, data.option2, data.option3, data.option4],
      correctAnswer: selectedAnswer ? selectedAnswer - 1 : null,
      pointsAwarded: points,
      questionType: "multiple-choice",
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/question`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWTToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
          throw new Error("Question Not Added");
        } else {
          return res.json();
        }
      })
      .then(() => {
        setLoading(false);
        setQuesAdded(true);
      })
      .catch((err) => {
        setError(true);
        console.error("Error Found: ", err);
      });
  };

  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-red-500">
        Error Raised
      </div>
    );

  if (quesAdded)
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-black gap-8">
        <h2 className="text-xl text-white font-semibold">
          Question Created Successfully
        </h2>
        <div className="flex flex-col gap-4 w-1/3">
          {/* Finish Quiz Button */}
          <a
            href="/dashboard"
            className="w-full py-4 text-center text-lg font-medium bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
          >
            FINISH QUIZ
          </a>

          {/* Continue Quiz Button */}
          <a
            href={`/create/question/${quizId}`}
            className="w-full py-4 text-center text-lg font-medium bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all relative group"
          >
            <span className="block group-hover:hidden">CONTINUE QUIZ</span>
            <span className="hidden group-hover:block">ADD MORE QUESTIONS</span>
          </a>
        </div>
      </div>
    );

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full flex">
        {/* Left section */}
        <motion.div
          animate={{
            width: expanded
              ? window.innerWidth < 640 // Tailwind 'sm' breakpoint is 640px
                ? "0%"
                : "60%"
              : "100%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full flex items-center justify-center bg-[#AD8B70]"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center gap-3 text-[8rem] font-extrabold text-black">
            <motion.span
              className="cursor-pointer"
              onHoverStart={() => setHoverC(true)}
              onHoverEnd={() => setHoverC(false)}
            >
              {hoverC ? "Create" : "C"}
            </motion.span>
            <motion.span
              className="cursor-pointer"
              onHoverStart={() => setHoverQ(true)}
              onHoverEnd={() => setHoverQ(false)}
            >
              {hoverQ ? "Quiz" : "Q"}
            </motion.span>

            {!expanded && (
              <span
                className="arrow-animate cursor-pointer text-[8rem]"
                onClick={() => setExpanded(true)}
              >
                &gt;
              </span>
            )}
          </div>
        </motion.div>

        {/* Right section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-full bg-[#3E3630] flex flex-col items-center p-8 overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#AD8B70] transition-colors"
              >
                <X size={28} className="text-white" />
              </button>

              {/* Form */}
              <h1 className="text-5xl font-bold text-white mb-8">Question</h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center"
              >
                {/* Question Input */}
                <input
                  type="text"
                  placeholder="Enter the question"
                  {...register("question", { required: true })}
                  className="w-3/4 px-6 py-4 border-b-2 border-white bg-transparent text-white text-xl focus:outline-none mb-8"
                />

                {/* Options */}
                <div className="w-3/4 grid grid-cols-1 gap-6 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <input
                      key={num}
                      type="text"
                      placeholder={`Option ${num}`}
                      {...register(`option${num}`, { required: true })}
                      className="px-6 py-4 border-2 border-[#AD8B70] rounded-lg bg-transparent text-white text-lg focus:outline-none"
                    />
                  ))}
                </div>

                {/* Points */}
                <div className="w-3/4 flex items-center justify-between border-2 border-[#AD8B70] rounded-lg px-6 py-4 mb-8 text-white text-lg">
                  <span>ASSIGN POINTS</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPoints((p) => Math.max(1, p - 1))}
                      className="p-2 hover:bg-[#AD8B70] rounded"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-xl">{points}</span>
                    <button
                      type="button"
                      onClick={() => setPoints((p) => p + 1)}
                      className="p-2 hover:bg-[#AD8B70] rounded"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="w-3/4 grid grid-cols-2 gap-6 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setSelectedAnswer(num)}
                      className={`px-6 py-4 rounded-lg border-2 transition-colors text-xl ${
                        selectedAnswer === num
                          ? "bg-[#AD8B70] text-black border-[#AD8B70]"
                          : "border-[#AD8B70] text-white hover:bg-[#AD8B70] hover:text-black"
                      }`}
                    >
                      Option {num}
                    </button>
                  ))}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-3/4 py-4 border-2 border-[#AD8B70] text-white rounded-lg text-2xl hover:bg-[#AD8B70] hover:text-black transition-colors"
                >
                  Add Question +
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
