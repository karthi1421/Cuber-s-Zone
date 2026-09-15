export type GridPoint = [number, number];

export type PllArrow = {
    start: GridPoint;
    end: GridPoint;
    bidirectional?: boolean;
};

export type PllSideColors = {
    top: string[];
    right: string[];
    bottom: string[];
    left: string[];
};

const arrow = (start: GridPoint, end: GridPoint): PllArrow => ({ start, end });
const swap = (start: GridPoint, end: GridPoint): PllArrow => ({ start, end, bidirectional: true });

export const PLL_GRID = {
    UBL: [50, 50] as GridPoint,
    UB: [150, 50] as GridPoint,
    UBR: [250, 50] as GridPoint,
    UL: [50, 150] as GridPoint,
    UR: [250, 150] as GridPoint,
    UFL: [50, 250] as GridPoint,
    UF: [150, 250] as GridPoint,
    UFR: [250, 250] as GridPoint,
};

const { UBL, UB, UBR, UL, UR, UFL, UF, UFR } = PLL_GRID;

const orange = '#ff9100';
const green = '#00c853';
const red = '#f5002d';
const blue = '#005bff';

const sideColors = (top: string[], right: string[], bottom: string[], left: string[]): PllSideColors => ({ top, right, bottom, left });

export const DEFAULT_PLL_SIDE_COLORS = sideColors(
    [orange, orange, orange],
    [green, green, green],
    [red, red, red],
    [blue, blue, blue],
);

export const PLL_SIDE_COLOR_MAP: Record<string, PllSideColors> = {
    'pll-aa': sideColors([orange, orange, blue], [green, green, orange], [red, red, green], [blue, orange, blue]),
    'pll-ab': sideColors([orange, orange, green], [blue, green, green], [red, green, red], [blue, blue, orange]),
    'pll-e': sideColors([orange, blue, orange], [green, orange, green], [red, green, red], [blue, orange, blue]),
    'pll-f': sideColors([orange, blue, orange], [green, green, orange], [red, red, green], [blue, orange, blue]),
    'pll-ga': sideColors([orange, blue, green], [green, green, orange], [red, red, blue], [blue, orange, green]),
    'pll-gb': sideColors([orange, green, blue], [orange, green, green], [red, blue, red], [blue, orange, green]),
    'pll-gc': sideColors([green, blue, orange], [green, orange, green], [red, red, blue], [orange, blue, green]),
    'pll-gd': sideColors([blue, orange, green], [green, green, orange], [red, blue, red], [green, orange, blue]),
    'pll-h': sideColors([orange, red, orange], [green, blue, green], [red, orange, red], [blue, green, blue]),
    'pll-ja': sideColors([orange, orange, blue], [green, green, orange], [red, red, green], [blue, orange, blue]),
    'pll-jb': sideColors([orange, orange, green], [blue, green, green], [red, green, red], [blue, blue, orange]),
    'pll-na': sideColors([orange, blue, green], [green, orange, green], [red, red, blue], [blue, green, orange]),
    'pll-nb': sideColors([orange, green, blue], [green, green, orange], [red, blue, red], [blue, orange, green]),
    'pll-ra': sideColors([orange, orange, blue], [green, orange, green], [red, red, green], [blue, green, orange]),
    'pll-rb': sideColors([orange, orange, green], [blue, green, green], [red, green, red], [blue, orange, blue]),
    'pll-t': sideColors([orange, blue, orange], [green, red, green], [red, blue, red], [blue, green, blue]),
    'pll-ua': sideColors([orange, blue, orange], [green, green, green], [red, orange, red], [blue, blue, blue]),
    'pll-ub': sideColors([orange, orange, orange], [green, blue, green], [red, red, red], [blue, green, blue]),
    'pll-v': sideColors([orange, blue, green], [green, orange, green], [red, green, blue], [blue, orange, green]),
    'pll-y': sideColors([orange, blue, green], [green, red, green], [red, green, blue], [blue, orange, green]),
    'pll-z': sideColors([orange, blue, orange], [green, red, green], [red, orange, red], [blue, green, blue]),
};

export const PLL_ARROW_DEFINITIONS: Record<string, PllArrow[]> = {
    'pll-aa': [arrow(UFL, UFR), arrow(UFR, UBR), arrow(UBR, UFL)],
    'pll-ab': [arrow(UFL, UBR), arrow(UBR, UFR), arrow(UFR, UFL)],
    'pll-e': [swap(UFL, UBL), swap(UFR, UBR)],
    'pll-f': [swap(UFL, UBL), swap(UFR, UL)],
    'pll-t': [swap(UFL, UFR), swap(UL, UR)],
    'pll-v': [swap(UFL, UBR), swap(UFR, UBL)],
    'pll-ga': [arrow(UL, UB), arrow(UB, UR), arrow(UR, UL), arrow(UFL, UFR), arrow(UFR, UBR), arrow(UBR, UFL)],
    'pll-gb': [arrow(UL, UR), arrow(UR, UB), arrow(UB, UL), arrow(UFL, UBR), arrow(UBR, UFR), arrow(UFR, UFL)],
    'pll-gc': [arrow(UR, UB), arrow(UB, UL), arrow(UL, UR), arrow(UFR, UFL), arrow(UFL, UBR), arrow(UBR, UFR)],
    'pll-gd': [arrow(UB, UL), arrow(UL, UR), arrow(UR, UB), arrow(UBR, UFR), arrow(UFR, UFL), arrow(UFL, UBR)],
    'pll-ua': [arrow(UB, UL), arrow(UL, UR), arrow(UR, UB)],
    'pll-ub': [arrow(UB, UR), arrow(UR, UL), arrow(UL, UB)],
    'pll-z': [swap(UB, UL), swap(UR, UF)],
    'pll-h': [swap(UB, UF), swap(UL, UR)],
    'pll-ja': [arrow(UFL, UFR), arrow(UFR, UBR), arrow(UBR, UFL), arrow(UL, UR)],
    'pll-jb': [arrow(UFR, UFL), arrow(UFL, UBL), arrow(UBL, UFR), arrow(UR, UL)],
    'pll-na': [arrow(UFL, UBR), arrow(UBR, UFR), arrow(UFR, UFL), arrow(UL, UR)],
    'pll-nb': [arrow(UFR, UBL), arrow(UBL, UFL), arrow(UFL, UFR), arrow(UR, UL)],
    'pll-ra': [arrow(UFL, UBR), arrow(UBR, UFR), arrow(UFR, UFL), arrow(UR, UB)],
    'pll-rb': [arrow(UFL, UFR), arrow(UFR, UBR), arrow(UBR, UFL), arrow(UL, UB)],
    'pll-y': [swap(UFL, UFR), swap(UL, UR), arrow(UFL, UBR), arrow(UBR, UFL)],
};

export const DEFAULT_PLL_ARROWS: PllArrow[] = [
    arrow([50, 50], [250, 150]),
    arrow([250, 50], [50, 150]),
];
