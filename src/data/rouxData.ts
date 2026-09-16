import { AlgCase } from './cfopData';

export interface RouxStep {
    id: string;
    title: string;
    stepNumber: string;
    description: string;
    movecount: string;
    features: string[];
}

export const ROUX_STEPS: RouxStep[] = [
    {
        id: 'fb',
        stepNumber: 'Step 1',
        title: 'First Block (FB)',
        description: 'Build a 1x2x3 block on the left side of the cube (typically Blue/White or Green/White) entirely intuitively.',
        movecount: '~6–8 moves',
        features: ['Block-building on DL', 'Freedom of M, U, r, R moves', 'Zero rotations needed']
    },
    {
        id: 'sb',
        stepNumber: 'Step 2',
        title: 'Second Block (SB)',
        description: 'Build a matching 1x2x3 block on the right side using only R, r, M, and U moves, preserving the First Block.',
        movecount: '~11–13 moves',
        features: ['Right block on DR', 'M-slice freedom maintained', 'F2L equivalent without cross']
    },
    {
        id: 'cmll',
        stepNumber: 'Step 3',
        title: 'CMLL (Corners)',
        description: 'Orient and permute all four U-layer corners simultaneously in a single algorithm, ignoring the M-slice.',
        movecount: '~9–10 moves',
        features: ['22 curated cases across 8 sets', 'Preserves both 1x2x3 blocks', 'Prepares for LSE']
    },
    {
        id: 'lse',
        stepNumber: 'Step 4',
        title: 'LSE (Last 6 Edges)',
        description: 'Solve the remaining 6 edges (4 in M-slice + UL/UR) using only <M, U> moves in 3 intuitive sub-steps.',
        movecount: '~14–16 moves',
        features: ['4a: Edge Orientation (EO)', '4b: UL & UR Edges', '4c: M-Slice Permutation']
    }
];

export const CMLL_DATA: AlgCase[] = [
    // O Cases (Already oriented, only permuted)
    { id: 'cmll-o-adj', name: 'CMLL O - Adjacent', alg: "R U R' F' R U R' U' R' F R2 U' R'", group: 'O (Oriented)' },
    { id: 'cmll-o-diag', name: 'CMLL O - Diagonal', alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", group: 'O (Oriented)' },

    // U Cases
    { id: 'cmll-u-fwd', name: 'CMLL U - Forward Slash', alg: "R2 D' R U2 R' D R U2 R", group: 'U Cases' },
    { id: 'cmll-u-back', name: 'CMLL U - Back Slash', alg: "R' U' R U' R' U2 R2 U R' U R U2 R'", group: 'U Cases' },
    { id: 'cmll-u-rows', name: 'CMLL U - Rows', alg: "F R U R' U' R U R' U' F'", group: 'U Cases' },
    { id: 'cmll-u-x', name: 'CMLL U - X', alg: "r U' r2 U r2 U r2 U' r", group: 'U Cases' },

    // T Cases
    { id: 'cmll-t-left', name: 'CMLL T - Left Bar', alg: "R U2 R' U' R U' R2 U2 R U R' U R", group: 'T Cases' },
    { id: 'cmll-t-right', name: 'CMLL T - Right Bar', alg: "r' U r U2 R2 F R F' R", group: 'T Cases' },
    { id: 'cmll-t-rows', name: 'CMLL T - Rows', alg: "F R U R' U' F'", group: 'T Cases' },

    // Sune Cases
    { id: 'cmll-s-left', name: 'CMLL Sune - Left Bar', alg: "R U R' U R U2 R'", group: 'Sune Cases' },
    { id: 'cmll-s-right', name: 'CMLL Sune - Right Bar', alg: "R U R' U' R' F R F' R U R' U R U2 R'", group: 'Sune Cases' },
    { id: 'cmll-s-fwd', name: 'CMLL Sune - Forward Slash', alg: "F R' F' R U2 R U2 R'", group: 'Sune Cases' },

    // Anti-Sune Cases
    { id: 'cmll-as-left', name: 'CMLL Anti-Sune - Left Bar', alg: "R' U' R U' R' U2 R", group: 'Anti-Sune Cases' },
    { id: 'cmll-as-right', name: 'CMLL Anti-Sune - Right Bar', alg: "R U2 R' U2 R' F R F'", group: 'Anti-Sune Cases' },
    { id: 'cmll-as-fwd', name: 'CMLL Anti-Sune - Forward Slash', alg: "R' F R F' R U R' U' R U' R'", group: 'Anti-Sune Cases' },

    // L Cases
    { id: 'cmll-l-mirror', name: 'CMLL L - Mirror', alg: "F R' F' R U R U' R'", group: 'L Cases' },
    { id: 'cmll-l-diag', name: 'CMLL L - Diagonal', alg: "R' U2 R U2 R' F R U R' U' F'", group: 'L Cases' },
    { id: 'cmll-l-pure', name: 'CMLL L - Pure', alg: "R U2 R2 F R F' R U2 R'", group: 'L Cases' },

    // H Cases
    { id: 'cmll-h-columns', name: 'CMLL H - Columns', alg: "R U R' U R U' R' U R U2 R'", group: 'H Cases' },
    { id: 'cmll-h-rows', name: 'CMLL H - Rows', alg: "F R U R' U' R U R' U' R U R' U' F'", group: 'H Cases' },

    // Pi Cases
    { id: 'cmll-pi-right', name: 'CMLL Pi - Right Bar', alg: "R U' R2 U R2 U R2 U' R", group: 'Pi Cases' },
    { id: 'cmll-pi-x', name: 'CMLL Pi - X', alg: "r U' r2 U r2 U r2 U' r", group: 'Pi Cases' }
];

export const LSE_DATA: AlgCase[] = [
    { id: 'lse-4a-4bad', name: '4a: 4 Bad Edges (Arrows)', alg: "M' U M'", group: 'Step 4a: EO' },
    { id: 'lse-4a-2bad', name: '4a: 2 Bad Edges (Opposite)', alg: "M' U2 M'", group: 'Step 4a: EO' },
    { id: 'lse-4a-all', name: '4a: All 6 Bad Edges', alg: "M' U' M' U2 M' U' M'", group: 'Step 4a: EO' },
    { id: 'lse-4b-ulur', name: '4b: Insert UL / UR Edges', alg: "M2 U2 M2", group: 'Step 4b: UL/UR' },
    { id: 'lse-4c-h', name: '4c: Dots / H-Perm M-Slice', alg: "M2 U2 M2 U2", group: 'Step 4c: EP' },
    { id: 'lse-4c-z', name: '4c: Z-Perm M-Slice', alg: "M' U2 M2 U2 M'", group: 'Step 4c: EP' }
];
