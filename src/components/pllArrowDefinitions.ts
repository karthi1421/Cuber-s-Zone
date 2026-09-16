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
    'pll-aa': sideColors([orange, orange, red], [red, green, blue], [green, red, red], [blue, blue, orange]),
    'pll-ab': sideColors([orange, orange, red], [blue, green, green], [blue, red, red], [blue, orange, blue]),
    'pll-e': sideColors([orange, orange, orange], [blue, green, green], [red, red, red], [blue, blue, green]),
    'pll-f': sideColors([orange, red, green], [red, green, orange], [red, orange, green], [blue, blue, blue]),
    'pll-ga': sideColors([orange, red, green], [red, blue, orange], [red, green, green], [blue, orange, blue]),
    'pll-gb': sideColors([orange, blue, green], [red, red, orange], [red, orange, green], [blue, green, blue]),
    'pll-gc': sideColors([orange, green, green], [red, blue, orange], [red, orange, green], [blue, red, blue]),
    'pll-gd': sideColors([orange, red, green], [red, orange, orange], [red, blue, green], [blue, green, blue]),
    'pll-h': sideColors([orange, red, orange], [green, blue, green], [red, orange, red], [blue, green, blue]),
    'pll-ja': sideColors([orange, orange, orange], [blue, red, green], [red, green, red], [green, blue, blue]),
    'pll-jb': sideColors([green, green, red], [blue, blue, green], [blue, red, red], [orange, orange, orange]),
    'pll-na': sideColors([orange, orange, red], [blue, blue, green], [orange, red, red], [blue, green, green]),
    'pll-nb': sideColors([red, orange, orange], [green, blue, blue], [red, red, orange], [green, green, blue]),
    'pll-ra': sideColors([green, orange, red], [blue, red, green], [blue, blue, red], [orange, green, orange]),
    'pll-rb': sideColors([green, orange, blue], [orange, red, green], [red, green, red], [orange, blue, blue]),
    'pll-t': sideColors([orange, orange, green], [red, blue, orange], [red, red, green], [blue, green, blue]),
    'pll-ua': sideColors([orange, orange, orange], [green, blue, green], [red, green, red], [blue, red, blue]),
    'pll-ub': sideColors([orange, orange, orange], [green, red, green], [red, blue, red], [blue, green, blue]),
    'pll-v': sideColors([red, orange, orange], [green, red, blue], [red, green, blue], [blue, blue, blue]),
    'pll-y': sideColors([red, blue, orange], [green, green, blue], [red, red, orange], [green, orange, blue]),
    'pll-z': sideColors([green, red, green], [red, green, red], [blue, orange, blue], [orange, blue, orange]),
};

export const PLL_ARROW_DEFINITIONS: Record<string, PllArrow[]> = {
    'pll-aa': [arrow(UFL, UFR), arrow(UFR, UBR), arrow(UBR, UFL)],
    'pll-ab': [arrow(UFL, UBR), arrow(UBR, UFR), arrow(UFR, UFL)],
    'pll-e': [swap(UFL, UBL), swap(UFR, UBR)],
    'pll-f': [swap(UFL, UBL), swap(UB, UF)],
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
    'pll-ja': [swap(UBL, UBR), swap(UF, UR)],
    'pll-jb': [arrow(UBL, UBR), arrow(UBR, UFL), arrow(UFL, UBL), arrow(UB, UR), arrow(UR, UL), arrow(UL, UB)],
    'pll-na': [swap(UFL, UBR), swap(UL, UR)],
    'pll-nb': [swap(UFR, UBL), swap(UL, UR)],
    'pll-ra': [arrow(UBL, UBR), arrow(UBR, UFL), arrow(UFL, UBL), arrow(UL, UR), arrow(UR, UF), arrow(UF, UL)],
    'pll-rb': [swap(UBL, UBR), swap(UR, UF)],
    'pll-y': [swap(UBL, UFR), arrow(UB, UL), arrow(UL, UB)],
};

export const DEFAULT_PLL_ARROWS: PllArrow[] = [
    arrow([50, 50], [250, 150]),
    arrow([250, 50], [50, 150]),
];
