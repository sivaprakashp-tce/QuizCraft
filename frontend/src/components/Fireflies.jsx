import React, { useEffect } from "react";

const Fireflies = ({ count = 20 }) => {
    useEffect(() => {
        const container =
            document.getElementById("fireflies-container") ||
            document.body;

        // Create multiple fireflies
        const fireflies = [];
        for (let i = 0; i < count; i++) {
            const firefly = document.createElement("div");
            firefly.className = "firefly";
            firefly.style.left = Math.random() * 100 + "%";
            firefly.style.top = Math.random() * 100 + "%";
            firefly.style.animationDelay = Math.random() * -10 + "s";
            firefly.style.animationDuration = Math.random() * 8 + 10 + "s";
            const colors = ["#f59e0b", "#a855f7", "#10b981", "#3b82f6"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            firefly.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
            firefly.style.boxShadow = `0 0 8px ${color}`;
            container.appendChild(firefly);
            fireflies.push(firefly);
        }

        // Cleanup on unmount
        return () => {
            fireflies.forEach(f => f.remove());
        };
    }, [count]);

    // The container div should be placed in your main layout or App.jsx
    return null;
};

export default Fireflies;
