import React from 'react';
import { DEFAULT_PLL_ARROWS, DEFAULT_PLL_SIDE_COLORS, PLL_ARROW_DEFINITIONS, PLL_SIDE_COLOR_MAP, PllArrow } from './pllArrowDefinitions';

const outlineColor = '#000000';
const centerColor = '#fff200';

const ARROW_PADDING = 12;
const HEAD_LENGTH = 18;
const HEAD_HALF_WIDTH = 9;
const SHAFT_WIDTH = 6;
const SHAFT_OVERLAP = 1.5;

function renderArrow(arrow: PllArrow, index: number, caseId: string) {
    const [x1, y1] = arrow.start;
    const [x2, y2] = arrow.end;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    if (length < 1) return null;

    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy;
    const ny = ux;

    // End arrowhead geometry
    const tipEndX = x2 - ux * ARROW_PADDING;
    const tipEndY = y2 - uy * ARROW_PADDING;
    const baseEndX = tipEndX - ux * HEAD_LENGTH;
    const baseEndY = tipEndY - uy * HEAD_LENGTH;
    const wing1EndX = baseEndX + nx * HEAD_HALF_WIDTH;
    const wing1EndY = baseEndY + ny * HEAD_HALF_WIDTH;
    const wing2EndX = baseEndX - nx * HEAD_HALF_WIDTH;
    const wing2EndY = baseEndY - ny * HEAD_HALF_WIDTH;

    const endHeadPoints = `${tipEndX.toFixed(1)},${tipEndY.toFixed(1)} ${wing1EndX.toFixed(1)},${wing1EndY.toFixed(1)} ${wing2EndX.toFixed(1)},${wing2EndY.toFixed(1)}`;

    // Shaft line coordinates (overlaps slightly into arrowhead base so there is no gap)
    const shaftEndX = baseEndX + ux * SHAFT_OVERLAP;
    const shaftEndY = baseEndY + uy * SHAFT_OVERLAP;

    let shaftStartX = x1 + ux * ARROW_PADDING;
    let shaftStartY = y1 + uy * ARROW_PADDING;
    let startHeadPoints: string | null = null;

    if (arrow.bidirectional) {
        const tipStartX = x1 + ux * ARROW_PADDING;
        const tipStartY = y1 + uy * ARROW_PADDING;
        const baseStartX = tipStartX + ux * HEAD_LENGTH;
        const baseStartY = tipStartY + uy * HEAD_LENGTH;
        const wing1StartX = baseStartX + nx * HEAD_HALF_WIDTH;
        const wing1StartY = baseStartY + ny * HEAD_HALF_WIDTH;
        const wing2StartX = baseStartX - nx * HEAD_HALF_WIDTH;
        const wing2StartY = baseStartY - ny * HEAD_HALF_WIDTH;

        startHeadPoints = `${tipStartX.toFixed(1)},${tipStartY.toFixed(1)} ${wing1StartX.toFixed(1)},${wing1StartY.toFixed(1)} ${wing2StartX.toFixed(1)},${wing2StartY.toFixed(1)}`;

        shaftStartX = baseStartX - ux * SHAFT_OVERLAP;
        shaftStartY = baseStartY - uy * SHAFT_OVERLAP;
    }

    return (
        <g key={`${caseId}-${index}`}>
            <line
                x1={shaftStartX}
                y1={shaftStartY}
                x2={shaftEndX}
                y2={shaftEndY}
                stroke="#000000"
                strokeWidth={SHAFT_WIDTH}
                strokeLinecap={arrow.bidirectional ? 'butt' : 'round'}
            />
            {startHeadPoints && (
                <polygon
                    points={startHeadPoints}
                    fill="#000000"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinejoin="round"
                />
            )}
            <polygon
                points={endHeadPoints}
                fill="#000000"
                stroke="#000000"
                strokeWidth="1"
                strokeLinejoin="round"
            />
        </g>
    );
}

interface PllArrowDiagramProps {
    caseId: string;
}

export const PllArrowDiagram: React.FC<PllArrowDiagramProps> = ({ caseId }) => {
    const arrows = PLL_ARROW_DEFINITIONS[caseId] || DEFAULT_PLL_ARROWS;
    const stickerColors = PLL_SIDE_COLOR_MAP[caseId] || DEFAULT_PLL_SIDE_COLORS;

    return (
        <svg
            viewBox="-20 -20 340 340"
            role="img"
            aria-label="PLL permutation arrows"
            shapeRendering="geometricPrecision"
            className="h-full w-full"
        >
            <g>
                <rect width="300" height="300" fill={centerColor} stroke={outlineColor} strokeWidth="8" />
                <path d="M 100 0 V 300 M 200 0 V 300 M 0 100 H 300 M 0 200 H 300" stroke={outlineColor} strokeWidth="6" />
                {stickerColors.top.map((color, index) => (
                    <rect key={`top-${index}`} x={index * 100 + 2} y="-16" width="96" height="14" rx="1" fill={color} stroke={outlineColor} strokeWidth="4" />
                ))}
                {stickerColors.right.map((color, index) => (
                    <rect key={`right-${index}`} x="302" y={index * 100 + 2} width="14" height="96" rx="1" fill={color} stroke={outlineColor} strokeWidth="4" />
                ))}
                {stickerColors.bottom.map((color, index) => (
                    <rect key={`bottom-${index}`} x={index * 100 + 2} y="302" width="96" height="14" rx="1" fill={color} stroke={outlineColor} strokeWidth="4" />
                ))}
                {stickerColors.left.map((color, index) => (
                    <rect key={`left-${index}`} x="-16" y={index * 100 + 2} width="14" height="96" rx="1" fill={color} stroke={outlineColor} strokeWidth="4" />
                ))}
                {arrows.map((arrow, index) => renderArrow(arrow, index, caseId))}
            </g>
        </svg>
    );
};
