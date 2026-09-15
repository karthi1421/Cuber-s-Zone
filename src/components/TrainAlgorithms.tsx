import React, { useState, useEffect, useCallback } from 'react';
import { F2L_DATA, OLL_DATA, PLL_DATA, AlgCase } from '../data/cfopData';
import { Cube3D } from './Cube3D';

export const TrainAlgorithms: React.FC = () => {
    const [trainCategory, setTrainCategory] = useState<'ALL' | 'F2L' | 'OLL' | 'PLL'>('OLL');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [streak, setStreak] = useState(() => Number(localStorage.getItem('cuber_train_streak') || 0));
    const [history, setHistory] = useState<{ name: string; correct: boolean; time: number }[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('cuber_train_history') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cuber_train_streak', String(streak));
        localStorage.setItem('cuber_train_history', JSON.stringify(history));
    }, [streak, history]);

    const pool: AlgCase[] = React.useMemo(() => {
        if (trainCategory === 'F2L') return F2L_DATA;
        if (trainCategory === 'OLL') return OLL_DATA;
        if (trainCategory === 'PLL') return PLL_DATA;
        return [...F2L_DATA, ...OLL_DATA, ...PLL_DATA];
    }, [trainCategory]);

    const currentCase = pool[currentIndex] || pool[0];

    const pickRandomCase = useCallback(() => {
        const nextIdx = Math.floor(Math.random() * pool.length);
        setCurrentIndex(nextIdx);
        setShowSolution(false);
        setTimer(0);
        setIsTimerRunning(true);
    }, [pool]);

    // Timer tick
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(t => +(t + 0.1).toFixed(1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Reset whenever category changes
    useEffect(() => {
        pickRandomCase();
    }, [trainCategory, pickRandomCase]);

    const handleAnswer = (correct: boolean) => {
        setIsTimerRunning(false);
        if (correct) {
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
        setHistory(prev => [{ name: currentCase.name, correct, time: timer }, ...prev.slice(0, 9)]);
        pickRandomCase();
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
            {/* Category Selector */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#121418] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-2">
                        Train Set:
                    </span>
                    {(['ALL', 'F2L', 'OLL', 'PLL'] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setTrainCategory(cat)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                trainCategory === cat
                                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                        >
                            {cat} {cat !== 'ALL' && `(${cat === 'F2L' ? F2L_DATA.length : cat === 'OLL' ? OLL_DATA.length : PLL_DATA.length})`}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400">Streak:</span>
                        <span className="text-cyan-400 font-bold">{streak} 🔥</span>
                    </div>
                </div>
            </div>

            {/* Flashcard Practice Card */}
            <div className="w-full bg-[#121418] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        {currentCase.group || currentCase.id}
                    </span>
                    <div className="font-mono text-2xl font-extrabold text-cyan-400 bg-slate-900/80 px-5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                        ⏱ {timer.toFixed(1)}s
                    </div>
                </div>

                {/* 3D Isometric Cube Target */}
                <div className="w-full h-64 bg-[#090a0c] rounded-2xl overflow-hidden mb-6 border border-slate-900 flex items-center justify-center relative shadow-inner">
                    <Cube3D alg={currentCase.alg} setup={currentCase.setup} height="220px" />
                </div>

                <h2 className="font-bison text-3xl text-slate-100 tracking-wider mb-2 text-center">
                    {!showSolution ? 'Can you execute this case?' : currentCase.name}
                </h2>

                {!showSolution ? (
                    <button
                        onClick={() => {
                            setShowSolution(true);
                            setIsTimerRunning(false);
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm tracking-wide mt-2"
                    >
                        💡 Reveal Solution & Algorithm
                    </button>
                ) : (
                    <div className="w-full flex flex-col gap-4 mt-2">
                        <div className="bg-[#181b20] p-4 rounded-xl border border-slate-800/80 text-center">
                            <span className="text-xs text-slate-400 font-mono block mb-1">Algorithm Formula</span>
                            <span className="font-mono text-base sm:text-lg text-cyan-300 font-semibold select-all tracking-wider">
                                {currentCase.alg}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer(false)}
                                className="py-3.5 bg-rose-950/30 border border-rose-800/40 hover:bg-rose-900/40 text-rose-300 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <span>✕</span> Missed It
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                className="py-3.5 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/40 text-emerald-300 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <span>✓</span> Solved Cleanly!
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Practice History */}
            {history.length > 0 && (
                <div className="w-full bg-[#121418] border border-slate-800/60 rounded-2xl p-4">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 block font-semibold">
                        Recent Attempts
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {history.map((h, i) => (
                            <span
                                key={i}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border ${
                                    h.correct
                                        ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                                        : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                                }`}
                            >
                                {h.correct ? '✓' : '✕'} {h.name} ({h.time}s)
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
