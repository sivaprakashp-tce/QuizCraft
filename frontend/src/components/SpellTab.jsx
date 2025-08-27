import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";

// ---------------------- Spell Animations ----------------------
const SpellAnimations = ({ spell, onComplete }) => {
    useEffect(() => {
        if (spell) {
            const timer = setTimeout(() => {
                onComplete(); // clear after animation ends
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [spell, onComplete]);

    if (!spell) return null;

    return (
        <div className="fixed inset-0 pointer-events-none flex justify-center items-center z-40">
            {/* Lumos: glowing orb */}
            {spell === "lumos" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0.8, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ duration: 2 }}
                    className="w-64 h-64 rounded-full bg-yellow-300 blur-3xl shadow-[0_0_60px_rgba(255,255,100,0.8)]"
                />
            )}

            {/* Nox: darkness overlay */}
            {spell === "nox" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0.9, 0] }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-black"
                />
            )}

            {/* Incendio: fire burst */}
            {spell === "incendio" && (
                <div className="flex gap-2">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 1, y: 0, scale: 1 }}
                            animate={{
                                opacity: 0,
                                y: -200 - Math.random() * 100,
                                scale: Math.random() * 2,
                                x: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 2 }}
                            className="w-6 h-6 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(255,100,0,0.8)]"
                        />
                    ))}
                </div>
            )}

            {/* Expelliarmus: shockwave */}
            {spell === "expelliarmus" && (
                <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 3, 5], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 2 }}
                    className="w-40 h-40 border-4 border-red-500 rounded-full"
                />
            )}

            {/* Wingardium Leviosa: floating stars */}
            {spell === "wingardium leviosa" && (
                <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{
                                y: -200,
                                opacity: [0, 1, 0],
                                x: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 3, delay: i * 0.2 }}
                            className="text-2xl"
                        >
                            ⭐
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Expecto Patronum: glowing blue orb */}
            {spell === "expecto patronum" && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1.8], opacity: [0, 1, 0] }}
                    transition={{ duration: 3 }}
                    className="w-72 h-72 rounded-full bg-blue-400 blur-2xl shadow-[0_0_80px_rgba(100,200,255,0.9)]"
                />
            )}

            {/* Avada Kedavra – green deadly flash */}
            {spell === "avada kedavra" && (
            <motion.div
                key="avada"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-green-600 z-50 pointer-events-none"
            />
            )}


            {/* Accio: pull-in effect */}
            {spell === "accio" && (
                <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: [2, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2 }}
                    className="w-32 h-32 bg-purple-400 rounded-full shadow-[0_0_40px_rgba(150,100,255,0.8)]"
                />
            )}

            {/* Default unknown spell */}
            {spell === "unknown" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 2 }}
                    className="text-2xl font-bold text-red-600"
                >
                    ❓ Unknown Spell!
                </motion.div>
            )}
        </div>
    );
};

// ---------------------- Spell Input Tab ----------------------
const SpellTab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [spell, setSpell] = useState("");
    const [activeSpell, setActiveSpell] = useState(null);

    const castSpell = () => {
        const spellKey = spell.toLowerCase().trim();
        if (
            ["lumos", "nox", "incendio", "expelliarmus", "wingardium leviosa", "expecto patronum", "avada kedavra", "accio"].includes(
                spellKey
            )
        ) {
            setActiveSpell(spellKey);
        } else {
            setActiveSpell("unknown");
        }
        setSpell("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Magical animations */}
            <SpellAnimations spell={activeSpell} onComplete={() => setActiveSpell(null)} />

            {/* Input box */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="spellbox"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg flex gap-2"
                    >
                        <input
                            type="text"
                            value={spell}
                            onChange={(e) => setSpell(e.target.value)}
                            placeholder="Type a spell..."
                            className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black bg-white"
                        />
                        <button
                            onClick={castSpell}
                            className="bg-amber-400 hover:bg-amber-500 text-black px-3 py-1 rounded-md text-sm font-bold"
                        >
                            Cast
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-xl"
            >
                <Wand2 className="w-6 h-6" />
            </button>
        </div>
    );
};

export default SpellTab;