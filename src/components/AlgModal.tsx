import React, { useEffect, useRef, useState } from 'react';
import { AlgCase } from '../data/cfopData';
import { Alg } from 'cubing/alg';

interface AlgModalProps {
    item: AlgCase | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export const AlgModal: React.FC<AlgModalProps> = ({
    item,
    onClose,
    onNext,
    onPrev
}) => {
    const [copied, setCopied] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(0.75);
    const containerRef = useRef<HTMLDivElement>(null);
    const frameImageRef = useRef<HTMLImageElement>(null);
    const playerRef = useRef<{
        controller?: { jumpToStart: (options: { flash: boolean }) => void; togglePlay: (play?: boolean) => void };
        experimentalCurrentCanvases?: () => Promise<HTMLCanvasElement[]>;
        pause?: () => void;
    } | null>(null);

    // Calculate inverse setup algorithm so cube starts scrambled
    const setupAlg = React.useMemo(() => {
        if (!item) return '';
        if (item.setup) return item.setup;
        try {
            const clean = item.alg.replace(/[()]/g, '').trim();
            const algObj = new Alg(clean);
            return algObj.invert().toString();
        } catch {
            return `(${item.alg})'`;
        }
    }, [item]);

    const replayAnimation = () => {
        playerRef.current?.controller?.jumpToStart({ flash: false });
        playerRef.current?.controller?.togglePlay(true);
    };

    useEffect(() => {
        if (!item || !containerRef.current) return;
        let active = true;
        let animationFrame = 0;
        let resizeObserver: ResizeObserver | null = null;
        let resizeTimer: number | null = null;
        containerRef.current.querySelectorAll('twisty-player').forEach((player) => player.remove());

        const captureFrame = async () => {
            const player = playerRef.current;
            const image = frameImageRef.current;
            if (active && player?.experimentalCurrentCanvases && image) {
                const canvas = (await player.experimentalCurrentCanvases())[0];
                if (canvas && canvas.width > 0 && canvas.height > 0) image.src = canvas.toDataURL('image/png');
            }
            if (active) animationFrame = window.requestAnimationFrame(() => void captureFrame());
        };

        import('cubing/twisty').then(({ TwistyPlayer }) => {
            if (!active || !containerRef.current) return;
            const player = new TwistyPlayer({
                puzzle: '3x3x3',
                alg: item.alg,
                experimentalSetupAlg: setupAlg,
                visualization: '3D',
                background: 'none',
                controlPanel: 'none',
                hintFacelets: 'floating',
                cameraLatitude: 28,
                cameraLongitude: -35,
                tempoScale: playbackSpeed,
            });
            const typedPlayer = player as unknown as NonNullable<typeof playerRef.current>;
            playerRef.current = typedPlayer;
            player.style.width = '100%';
            player.style.height = '100%';
            player.style.position = 'absolute';
            player.style.opacity = '0';
            player.style.pointerEvents = 'none';
            containerRef.current.appendChild(player);

            const resizePlayer = async () => {
                if (!containerRef.current || !typedPlayer.experimentalCurrentCanvases) return;
                const width = Math.max(1, containerRef.current.clientWidth);
                const height = Math.max(1, containerRef.current.clientHeight);
                const canvases = await typedPlayer.experimentalCurrentCanvases();
                canvases.forEach((canvas) => {
                    if (canvas.parentElement) {
                        canvas.parentElement.style.height = `${height}px`;
                        canvas.parentElement.style.display = 'block';
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                });
                typedPlayer.controller?.jumpToStart({ flash: false });
                typedPlayer.controller?.togglePlay(true);
            };

            resizeObserver = new ResizeObserver(() => void resizePlayer());
            resizeObserver.observe(containerRef.current);
            void resizePlayer().then(() => void captureFrame());
            resizeTimer = window.setTimeout(() => {
                void resizePlayer().then(() => void captureFrame());
            }, 500);
        }).catch((error) => console.error('Error importing cubing/twisty:', error));

        return () => {
            active = false;
            window.cancelAnimationFrame(animationFrame);
            resizeObserver?.disconnect();
            if (resizeTimer) window.clearTimeout(resizeTimer);
            playerRef.current?.pause?.();
            playerRef.current = null;
        };
    }, [item, playbackSpeed, setupAlg]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
            if (e.code === 'Space') {
                e.preventDefault();
                replayAnimation();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    if (!item) return null;

    const copyAlg = () => {
        navigator.clipboard.writeText(item.alg);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
            {/* Minimal Modal Container */}
            <div className="relative w-full max-w-3xl bg-[#0e1116] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Clean Top Bar */}
                <div className="px-6 py-4 bg-[#12161d] border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
                            {item.group || item.id}
                        </span>
                        <h2 className="font-bison text-2xl sm:text-3xl text-slate-100 tracking-wider">
                            {item.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {onPrev && (
                            <button
                                onClick={onPrev}
                                title="Previous Algorithm [Left Arrow]"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all"
                            >
                                ←
                            </button>
                        )}
                        {onNext && (
                            <button
                                onClick={onNext}
                                title="Next Algorithm [Right Arrow]"
                                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all"
                            >
                                →
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            title="Close [ESC]"
                            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/50 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 flex items-center justify-center text-lg font-bold transition-all ml-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Main 3D Animation Viewport */}
                <div
                    onClick={replayAnimation}
                    title="Click anywhere on cube to replay animation"
                    className="w-full h-[min(62vh,560px)] min-h-[360px] sm:min-h-[440px] bg-[#07080a] relative flex items-center justify-center overflow-hidden cursor-pointer"
                >
                    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
                        <img ref={frameImageRef} alt="Animated cube algorithm" className="w-full h-full object-contain" />
                    </div>

                    {/* Subtle Replay hint on bottom left */}
                    <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-500 pointer-events-none">
                        Click cube or press [Space] to replay
                    </div>
                </div>

                {/* Minimal Algorithm Formula Footer */}
                <div className="px-6 py-4 bg-[#11141a] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                    <p className="font-mono text-base sm:text-lg text-cyan-300 font-bold select-all tracking-wider truncate">
                        {item.alg}
                    </p>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            Speed
                            <select
                                value={playbackSpeed}
                                onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
                                className="bg-slate-900 border border-slate-700 text-cyan-300 rounded-lg px-2 py-1.5 outline-none"
                                aria-label="Playback speed"
                            >
                                <option value="0.5">0.5x</option>
                                <option value="0.75">0.75x</option>
                                <option value="1">1x</option>
                                <option value="1.5">1.5x</option>
                            </select>
                        </label>
                        <button
                            onClick={copyAlg}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap"
                        >
                            {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

