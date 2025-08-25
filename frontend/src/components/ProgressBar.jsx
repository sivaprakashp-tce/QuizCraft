// src/quiz/ProgressBar.jsx
export default function ProgressBar({ current, total, progress }) {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Question {current} of {total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                    className="progress-glow h-3 rounded-full transition-all duration-500"
                    style={{width: `${progress}%`}}
                ></div>
            </div>
        </div>
    );
}
