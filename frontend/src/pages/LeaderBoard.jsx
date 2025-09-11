import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer.jsx';
import Fireflies from '../components/Fireflies.jsx';
import Runes from '../components/Runes.jsx';
import { getJWTToken } from '../utils';

const LeaderBoard = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="mt-24 w-screen min-h-screen flex flex-col items-center py-10 relative overflow-hidden bg-gray-950">
                <Runes />
                <LeaderboardCards />
            </div>
            <div className="fireflies-container w-screen" />
            <Fireflies />
            <Footer />
        </React.Fragment>
    );
};

const LeaderboardCards = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);

    const JWTToken = getJWTToken();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWTToken}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Leaderboard not fetched");
                }
                const data = await res.json();
                setLeaderboard(data.data.leaderboard);
                setLoading(false);
            } catch (err) {
                setError(true);
                console.error("Error fetching leaderboard:", err);
            }
        };

        fetchLeaderboard();
    }, [JWTToken]);

    if (error) {
        return <div className="text-red-400 h-screen flex justify-center items-center">⚠ Error loading leaderboard.</div>;
    }
    if (loading) {
        return <div className="text-gray-300 h-screen flex justify-center items-center animate-pulse">✨ Gathering the cosmic champions...</div>;
    }

    return (
        <div className="w-11/12 lg:max-w-4xl p-8 bg-gray-900 bg-opacity-90 rounded-2xl mystical-glow border-2 border-purple-500/40 hover:border-pink-400/60 transition-all duration-500">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 
                           bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 
                           text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]">
                Cosmic Champions
            </h1>
            <div className="flex flex-col items-center space-y-6">
                {leaderboard.map((entry, index) => (
                    <CrystalCard key={entry._id} entry={entry} index={index} />
                ))}
            </div>
        </div>
    );
};

const CrystalCard = ({ entry, index }) => {
    const rank = index + 1;
    let cardClasses = 'relative p-5 w-full rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 overflow-hidden';
    let icon = null;

    if (rank === 1) {
        cardClasses += ' bg-gradient-to-r from-yellow-700 to-yellow-900 border-4 border-yellow-400 mystical-glow-gold animate-pulse-light';
        icon = '👑';
    } else if (rank === 2) {
        cardClasses += ' bg-gradient-to-r from-gray-700 to-gray-900 border-4 border-gray-400 mystical-glow-silver';
        icon = '💎';
    } else if (rank === 3) {
        cardClasses += ' bg-gradient-to-r from-amber-700 to-amber-900 border-4 border-amber-500 mystical-glow-bronze';
        icon = '🔮';
    } else {
        cardClasses += ' bg-gray-800 bg-opacity-70 border-2 border-purple-500/40 hover:border-pink-400/60';
        icon = <span className='text-gray-400'>{rank}</span>;
    }
    
    return (
        <div className={cardClasses}>
            <div className="absolute inset-0 z-0 opacity-20 transform -skew-y-12 scale-150 bg-gradient-to-br from-purple-500 to-pink-500 animate-slide"></div>
            <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-100">{entry.name}</h3>
                        <p className="text-sm text-gray-400 hidden sm:block">{entry.stream} | {entry.institution}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-xl font-bold text-yellow-300">
                    <span>{entry.starsGathered}</span>
                    <span className="text-2xl animate-spin-slow">⭐</span>
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;