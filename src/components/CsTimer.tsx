import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateAverage, formatTime, generate3x3Scramble, Solve } from './timerUtils';

export const CsTimer: React.FC = () => {
    const [scramble, setScramble] = useState<string>(() => generate3x3Scramble());
    const [timeMs, setTimeMs] = useState<number>(0);
    const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running'>('idle');
    const [solves, setSolves] = useState<Solve[]>(() => {
        try {
            const saved = localStorage.getItem('cs_timer_solves');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [copiedScramble, setCopiedScramble] = useState(false);
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    // Save solves to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cs_timer_solves', JSON.stringify(solves));
        } catch (e) {
            console.error('Failed to save solves', e);
        }
    }, [solves]);

    const newScramble = useCallback(() => {
        setScramble(generate3x3Scramble());
    }, []);

    const copyScramble = () => {
        navigator.clipboard.writeText(scramble);
        setCopiedScramble(true);
        setTimeout(() => setCopiedScramble(false), 1500);
    };

    const recordSolve = useCallback((finalMs: number) => {
        const newSolve: Solve = {
            id: Date.now().toString(),
            timeMs: finalMs,
            scramble,
            timestamp: Date.now()
        };
        setSolves(prev => [...prev, newSolve]);
        newScramble();
    }, [newScramble, scramble]);

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        const finalTime = Date.now() - startTimeRef.current;
        setTimeMs(finalTime);
        setTimerState('idle');
        recordSolve(finalTime);
    }, [recordSolve]);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        setTimerState('running');
        timerIntervalRef.current = setInterval(() => {
            setTimeMs(Date.now() - startTimeRef.current);
        }, 10);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (timerState === 'running') {
                stopTimer();
            } else if (timerState === 'idle') {
                setTimerState('holding');
                if (!holdTimeoutRef.current) {
                    holdTimeoutRef.current = setTimeout(() => {
                        setTimerState('ready');
                    }, 300);
                }
            }
        } else if (timerState === 'running') {
            stopTimer();
        }
    }, [stopTimer, timerState]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
                holdTimeoutRef.current = null;
            }
            if (timerState === 'ready') {
                startTimer();
            } else if (timerState === 'holding') {
                setTimerState('idle');
            }
        }
    }, [startTimer, timerState]);

    // Touch handlers for mobile / mouse hold
    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        if (timerState === 'running') {
            stopTimer();
        } else if (timerState === 'idle') {
            setTimerState('holding');
            holdTimeoutRef.current = setTimeout(() => {
                setTimerState('ready');
            }, 300);
        }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }
        if (timerState === 'ready') {
            startTimer();
        } else if (timerState === 'holding') {
            setTimerState('idle');
        }
    };

    const cancelPointer = () => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }
        if (timerState === 'holding' || timerState === 'ready') setTimerState('idle');
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Penalty actions
    const setPenalty = (id: string, penalty: '+2' | 'DNF') => {
        setSolves(prev => prev.map(s => {
            if (s.id !== id) return s;
            return {
                ...s,
                penalty: s.penalty === penalty ? undefined : penalty
            };
        }));
    };

    const deleteSolve = (id: string) => {
        setSolves(prev => prev.filter(s => s.id !== id));
    };

    const clearAllSolves = () => {
        if (window.confirm('Are you sure you want to clear all solves in this session?')) {
            setSolves([]);
        }
    };

    // Calculations
    const validSolves = solves.filter(s => s.penalty !== 'DNF');
    const bestSingle = validSolves.length > 0
        ? Math.min(...validSolves.map(s => s.penalty === '+2' ? s.timeMs + 2000 : s.timeMs))
        : null;

    const currentAo5 = calculateAverage(solves, 5);
    const currentAo12 = calculateAverage(solves, 12);

    // Calculate Best Ao5
    let bestAo5: number | null = null;
    if (solves.length >= 5) {
        for (let i = 0; i <= solves.length - 5; i++) {
            const avg = calculateAverage(solves.slice(0, i + 5), 5);
            if (avg !== null && avg > 0) {
                if (bestAo5 === null || avg < bestAo5) bestAo5 = avg;
            }
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-6 select-none">
            {/* Scramble Display Card */}
            <div className="w-full bg-[#121418] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs font-mono tracking-wider text-cyan-400 font-bold uppercase mb-1 block">
                        WCA 3x3x3 Scramble
                    </span>
                    <p className="font-mono text-lg sm:text-xl md:text-2xl text-slate-100 tracking-wider font-semibold select-all leading-relaxed">
                        {scramble}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyScramble}
                        title="Copy Scramble"
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-semibold transition-all"
                    >
                        {copiedScramble ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                        onClick={newScramble}
                        title="Generate Next Scramble"
                        className="px-3.5 py-2 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 text-cyan-400 rounded-xl text-xs font-bold transition-all"
                    >
                        🔄 Next
                    </button>
                </div>
            </div>

            {/* Huge Timer Viewport */}
            <div
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={cancelPointer}
                className="w-full py-16 sm:py-24 flex flex-col items-center justify-center bg-[#0a0c0f] border border-slate-900 rounded-3xl cursor-pointer hover:border-slate-800 transition-all relative overflow-hidden shadow-2xl group touch-none"
            >
                <div className="absolute top-4 text-xs font-mono text-slate-500 tracking-widest uppercase">
                    {timerState === 'idle' && 'Hold [Spacebar] or tap & hold to arm'}
                    {timerState === 'holding' && 'Wait for green...'}
                    {timerState === 'ready' && 'Release to start!'}
                    {timerState === 'running' && 'Press any key or tap to stop'}
                </div>

                <div
                    className={`font-mono font-extrabold tracking-tight transition-colors ${
                        timerState === 'ready'
                            ? 'text-emerald-400 scale-105'
                            : timerState === 'holding'
                            ? 'text-amber-400'
                            : timerState === 'running'
                            ? 'text-cyan-300'
                            : 'text-slate-100'
                    }`}
                    style={{ fontSize: 'clamp(4.5rem, 12vw, 8.5rem)' }}
                >
                    {formatTime(timeMs)}
                </div>

                {timerState === 'idle' && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono text-slate-400">csTimer Mode Active</span>
                    </div>
                )}
            </div>

            {/* Statistics and Solve History Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Session Stats Bar */}
                <div className="lg:col-span-1 bg-[#121418] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                            <h3 className="font-bison text-xl text-cyan-400 tracking-wider">Session Statistics</h3>
                            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                {solves.length} solves
                            </span>
                        </div>

                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/40">
                                <span className="text-slate-400 text-xs">Best Single</span>
                                <span className="text-emerald-400 font-bold">
                                    {bestSingle !== null ? formatTime(bestSingle) : '--'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/40">
                                <span className="text-slate-400 text-xs">Current Ao5</span>
                                <span className="text-cyan-400 font-bold">
                                    {currentAo5 !== null ? (currentAo5 === -1 ? 'DNF' : formatTime(currentAo5)) : '--'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/40">
                                <span className="text-slate-400 text-xs">Best Ao5</span>
                                <span className="text-cyan-300 font-bold">
                                    {bestAo5 !== null ? formatTime(bestAo5) : '--'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/40">
                                <span className="text-slate-400 text-xs">Current Ao12</span>
                                <span className="text-blue-400 font-bold">
                                    {currentAo12 !== null ? (currentAo12 === -1 ? 'DNF' : formatTime(currentAo12)) : '--'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {solves.length > 0 && (
                        <button
                            onClick={clearAllSolves}
                            className="mt-6 w-full py-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-semibold transition-all"
                        >
                            🗑 Clear Session
                        </button>
                    )}
                </div>

                {/* Solves Table */}
                <div className="lg:col-span-2 bg-[#121418] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                        <h3 className="font-bison text-xl text-cyan-400 tracking-wider">Solve History</h3>
                        <span className="text-xs text-slate-500 font-mono">Latest first</span>
                    </div>

                    {solves.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-500 font-mono text-xs">
                            <span className="text-2xl mb-2">⏱</span>
                            No solves yet in this session. Arm the timer to start!
                        </div>
                    ) : (
                        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                            {[...solves].reverse().map((solve, idx) => {
                                const realIdx = solves.length - idx;
                                return (
                                    <div
                                        key={solve.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/60 hover:border-slate-700 transition-all font-mono text-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 w-6">#{realIdx}</span>
                                            <span className={`text-sm font-bold ${
                                                solve.penalty === 'DNF' ? 'text-rose-400' :
                                                solve.penalty === '+2' ? 'text-amber-400' : 'text-slate-100'
                                            }`}>
                                                {formatTime(solve.timeMs, solve.penalty)}
                                            </span>
                                        </div>

                                        <div className="hidden sm:block text-slate-500 truncate max-w-xs text-[11px]">
                                            {solve.scramble}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => setPenalty(solve.id, '+2')}
                                                className={`px-2 py-1 rounded text-[11px] font-bold border transition-all ${
                                                    solve.penalty === '+2'
                                                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                                }`}
                                            >
                                                +2
                                            </button>
                                            <button
                                                onClick={() => setPenalty(solve.id, 'DNF')}
                                                className={`px-2 py-1 rounded text-[11px] font-bold border transition-all ${
                                                    solve.penalty === 'DNF'
                                                        ? 'bg-rose-600 text-white border-rose-600'
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                                }`}
                                            >
                                                DNF
                                            </button>
                                            <button
                                                onClick={() => deleteSolve(solve.id)}
                                                className="px-2 py-1 rounded text-[11px] text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                                                title="Delete solve"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
