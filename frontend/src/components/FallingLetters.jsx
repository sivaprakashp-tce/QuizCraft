import { useEffect, useState } from "react";

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%$#@&*{}/+-!".split("");

function FallingLetters() {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomLeft = Math.floor(Math.random() * 100); // percentage
      const randomDuration = 5 + Math.random() * 5; // between 5–10s

      const newLetter = {
        id: Date.now(),
        symbol: randomSymbol,
        left: randomLeft,
        duration: randomDuration,
      };

      setLetters((prev) => [...prev, newLetter]);

      // remove old letters after animation
      setTimeout(() => {
        setLetters((prev) => prev.filter((l) => l.id !== newLetter.id));
      }, randomDuration * 1000);
    }, 300); // every 300ms drop a new symbol

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {letters.map((letter) => (
        <span
          key={letter.id}
          className="absolute text-[#AD8B70] text-4xl opacity-70 animate-fall"
          style={{
            left: `${letter.left}%`,
            animationDuration: `${letter.duration}s`,
          }}
        >
          {letter.symbol}
        </span>
      ))}
    </div>
  );
}

export default FallingLetters;

