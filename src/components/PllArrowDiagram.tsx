import React from 'react';
import { DEFAULT_PLL_ARROWS, DEFAULT_PLL_SIDE_COLORS, PLL_ARROW_DEFINITIONS, PLL_SIDE_COLOR_MAP } from './pllArrowDefinitions';

const outlineColor = '#000000';
const centerColor = '#fff200';
const arrowPadding = 10;

function getClearedEndpoints(start: [number, number], end: [number, number]) {
    const deltaX = end[0] - start[0];
    const deltaY = end[1] - start[1];
    const length = Math.hypot(deltaX, deltaY);
    const unitX = deltaX / length;
    const unitY = deltaY / length;

    return {
        start: [Math.round(start[0] + unitX * arrowPadding), Math.round(start[1] + unitY * arrowPadding)],
        end: [Math.round(end[0] - unitX * arrowPadding), Math.round(end[1] - unitY * arrowPadding)],
    };
}

interface PllArrowDiagramProps {
    caseId: string;
}

export const PllArrowDiagram: React.FC<PllArrowDiagramProps> = ({ caseId }) => {
    const arrows = PLL_ARROW_DEFINITIONS[caseId] || DEFAULT_PLL_ARROWS;
    const stickerColors = PLL_SIDE_COLOR_MAP[caseId] || DEFAULT_PLL_SIDE_COLORS;
    const markerStartId = `arrowhead-start-${caseId}`;
    const markerEndId = `arrowhead-end-${caseId}`;

    return (
        <svg
            viewBox="-20 -20 340 340"
            role="img"
            aria-label="PLL permutation arrows"
            shapeRendering="geometricPrecision"
            className="h-full w-full"
        >
            <defs>
                <marker id={markerStartId} viewBox="0 0 32 32" refX="0" refY="16" markerWidth="32" markerHeight="32" markerUnits="userSpaceOnUse" orient="auto">
                    <polygon points="32,3 0,16 32,29" fill="#000000" stroke="none" />
                </marker>
                <marker id={markerEndId} viewBox="0 0 32 32" refX="32" refY="16" markerWidth="32" markerHeight="32" markerUnits="userSpaceOnUse" orient="auto">
                    <polygon points="0,3 32,16 0,29" fill="#000000" stroke="none" />
                </marker>
            </defs>
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
                {arrows.map((arrow, index) => (
                    (() => {
                        const endpoints = getClearedEndpoints(arrow.start, arrow.end);
                        return (
                            <line
                                key={`${caseId}-${index}`}
                                x1={endpoints.start[0]}
                                y1={endpoints.start[1]}
                                x2={endpoints.end[0]}
                                y2={endpoints.end[1]}
                                stroke="#000000"
                                strokeWidth="6"
                                strokeLinecap="butt"
                                markerStart={arrow.bidirectional ? `url(#${markerStartId})` : undefined}
                                markerEnd={`url(#${markerEndId})`}
                            />
                        );
                    })()
                ))}
            </g>
        </svg>
    );
};
