import React, { useEffect } from "react";

const Runes = ({ count = 12 }) => {
  useEffect(() => {
    const container =
      document.getElementById("runes-container") ||
      document.body;

    const runesArr = [];
    for (let i = 0; i < count; i++) {
      const rune = document.createElement("div");
      rune.className = "floating-rune";
      rune.style.right = Math.random() * 100 + "%";
      rune.style.top = Math.random() * 80 + 10 + "%";
      rune.style.fontSize = Math.random() * 1.5 + "rem";
      rune.style.animationDelay = Math.random() * -20 + "s";
      rune.style.animationDuration = Math.random() * 10 + 15 + "s";
      const runes = ["⟐", "◊", "✧", "⬟", "✦", "◈", "⟡"];
      rune.textContent = runes[Math.floor(Math.random() * runes.length)];
      const colors = [
        "rgba(168, 85, 247, 0.18)",
        "rgba(16, 185, 129, 0.18)",
        "rgba(245, 158, 11, 0.18)",
      ];
      rune.style.color = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(rune);
      runesArr.push(rune);
    }

    // Cleanup on unmount
    return () => {
      runesArr.forEach((r) => r.remove());
    };
  }, [count]);

  // The container div should be placed in your main layout or App.jsx
  return null;
};

export default Runes;
