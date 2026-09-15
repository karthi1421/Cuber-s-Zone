import React, { useEffect, useRef } from 'react';
import * as SRVisualizer from 'sr-visualizer';

export type CaseType = 'oll' | 'pll' | 'f2l' | 'other';

interface Cube3DProps {
    alg: string;
    setup?: string;
    puzzle?: string;
    height?: string;
    caseType?: CaseType;
}

export const Cube3D: React.FC<Cube3DProps> = ({
    alg,
    setup,
    height = '180px',
    caseType = 'other',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        try {
            // Clean algorithm notation - remove parentheses
            const cleanAlg = (setup || alg)
                .replace(/[()]/g, '')
                .replace(/([URFDLBMESxyzfw])2'/g, '$12')
                .trim();
            const numericHeight = parseInt(height, 10) || 180;
            const visualSize = Math.max(100, numericHeight - 16);

            // Build sr-visualizer options based on case type
            const options: Record<string, unknown> = {
                case: cleanAlg,
                width: visualSize,
                height: visualSize,
                cubeColor: '#121418',
                backgroundColor: 'transparent',
                strokeWidth: 0,
                outlineWidth: 0.94,
            };

            if (caseType === 'oll') {
                // OLL: top-down plan view, mask everything except last layer orientation
                // Shows yellow top face pattern + grayed-out F2L
                options.mask = SRVisualizer.Masking.OLL;
                options.view = 'plan';
            } else if (caseType === 'pll') {
                // PLL: standard 3D view showing full last layer colors
                // Yellow face is already on top, shows color permutation on sides
                options.mask = SRVisualizer.Masking.LL;
                // Use a slightly top-tilted angle so you see U face prominently + side colors
                options.viewportRotations = [
                    [SRVisualizer.Axis.Y, 45],
                    [SRVisualizer.Axis.X, -34],
                ];
            }
            // For f2l and other, use default 3D isometric view (no masking)

            SRVisualizer.cubeSVG(containerRef.current, options);
        } catch (err) {
            console.error("Cube visual error:", err);
        }
    }, [alg, setup, height, caseType]);

    return (
        <div
            ref={containerRef}
            style={{ height, width: '100%' }}
            className="cube-visual-container w-full flex items-center justify-center bg-[#090a0c] rounded-xl overflow-hidden p-2 select-none"
        />
    );
};