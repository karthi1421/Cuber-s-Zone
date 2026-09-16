const { CubeData } = require('sr-visualizer/dist/lib/cube/simulation');
const { parseCase } = require('sr-visualizer/dist/lib/cube/parsing/algorithm');
const { Face } = require('sr-visualizer/dist/lib/cube/constants');

const PLL_DATA = [
    { id: 'pll-aa', name: 'Aa Perm', alg: "x R' D2 R U R' D2 R U' R'" },
    { id: 'pll-ab', name: 'Ab Perm', alg: "x R U' R D2 R' U R D2 R2" },
    { id: 'pll-e', name: 'E Perm', alg: "x' R U' R' D R U R' D' R U R' D R U' R' D'" },
    { id: 'pll-f', name: 'F Perm', alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
    { id: 'pll-ga', name: 'Ga Perm', alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'" },
    { id: 'pll-gb', name: 'Gb Perm', alg: "R' U' R U D' R2 U R' U R U' R U' R2 D" },
    { id: 'pll-gc', name: 'Gc Perm', alg: "R2 U' R U' R U R' U R2 D' U R U' R' D" },
    { id: 'pll-gd', name: 'Gd Perm', alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'" },
    { id: 'pll-h', name: 'H Perm', alg: "M2 U M2 U2 M2 U M2" },
    { id: 'pll-ja', name: 'Ja Perm', alg: "x R2 F R F' R U2 r' U r U2" },
    { id: 'pll-jb', name: 'Jb Perm', alg: "R U R' F' R U R' U' R' F R2 U' R'" },
    { id: 'pll-na', name: 'Na Perm', alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
    { id: 'pll-nb', name: 'Nb Perm', alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R" },
    { id: 'pll-ra', name: 'Ra Perm', alg: "R U R' F' R U2 R' U2 R' F R U R U2 R'" },
    { id: 'pll-rb', name: 'Rb Perm', alg: "R' U2 R U2 R' F R U R' U' R' F' R2 U'" },
    { id: 'pll-t', name: 'T Perm', alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    { id: 'pll-ua', name: 'Ua Perm', alg: "R U' R U R U R U' R' U' R2" },
    { id: 'pll-ub', name: 'Ub Perm', alg: "R2 U R U R' U' R' U' R' U R'" },
    { id: 'pll-v', name: 'V Perm', alg: "R' U R' U' y R' F' R2 U' R' U R' F R F" },
    { id: 'pll-y', name: 'Y Perm', alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
    { id: 'pll-z', name: 'Z Perm', alg: "M' U M2 U M2 U M' U2 M2" }
];

const colorHex = {
    O: 'orange',
    G: 'green',
    R: 'red',
    B: 'blue',
    Y: 'yellow',
    W: 'white'
};

function analyzePll(item) {
    const solved = {
        [Face.U]: Array(9).fill('Y'),
        [Face.D]: Array(9).fill('W'),
        [Face.F]: Array(9).fill('R'),
        [Face.B]: Array(9).fill('O'),
        [Face.L]: Array(9).fill('B'),
        [Face.R]: Array(9).fill('G'),
    };
    const cube = new CubeData(3, solved);
    const clean = item.alg.replace(/[()]/g, '').replace(/([URFDLBMESxyzfw])2'/g, '$12').trim();
    const moves = parseCase(clean);
    moves.forEach(m => cube.turn(m));

    const B = cube.faces[Face.B];
    const R = cube.faces[Face.R];
    const F = cube.faces[Face.F];
    const L = cube.faces[Face.L];
    const U = cube.faces[Face.U];

    const top = [B[2], B[1], B[0]];
    const right = [R[2], R[1], R[0]];
    const bottom = [F[0], F[1], F[2]];
    const left = [L[0], L[1], L[2]];

    // Identify which piece is at each position:
    // Positions:
    // Corners: UBL (U0, B2, L0), UBR (U2, B0, R2), UFL (U6, F0, L2), UFR (U8, F2, R0)
    // Edges: UB (U1, B1), UL (U3, L1), UR (U5, R1), UF (U7, F1)
    
    // Solved corner sets:
    // UBL: O, B (and Y)
    // UBR: O, G (and Y)
    // UFL: R, B (and Y)
    // UFR: R, G (and Y)
    const getCornerDest = (c1, c2) => {
        const set = new Set([c1, c2]);
        if (set.has('O') && set.has('B')) return 'UBL';
        if (set.has('O') && set.has('G')) return 'UBR';
        if (set.has('R') && set.has('B')) return 'UFL';
        if (set.has('R') && set.has('G')) return 'UFR';
        return 'UNKNOWN_CORNER';
    };

    // Solved edge sets:
    // UB: O
    // UL: B
    // UR: G
    // UF: R
    const getEdgeDest = (color) => {
        if (color === 'O') return 'UB';
        if (color === 'B') return 'UL';
        if (color === 'G') return 'UR';
        if (color === 'R') return 'UF';
        return 'UNKNOWN_EDGE';
    };

    const currentPieces = {
        UBL: getCornerDest(B[2], L[0]),
        UBR: getCornerDest(B[0], R[2]),
        UFL: getCornerDest(F[0], L[2]),
        UFR: getCornerDest(F[2], R[0]),
        UB: getEdgeDest(B[1]),
        UL: getEdgeDest(L[1]),
        UR: getEdgeDest(R[1]),
        UF: getEdgeDest(F[1]),
    };

    // Movement: A piece at 'pos' needs to go to currentPieces[pos]
    // pos -> dest
    const movesNeeded = [];
    for (const [pos, dest] of Object.entries(currentPieces)) {
        if (pos !== dest) {
            movesNeeded.push({ from: pos, to: dest });
        }
    }

    return {
        id: item.id,
        name: item.name,
        alg: item.alg,
        top,
        right,
        bottom,
        left,
        currentPieces,
        movesNeeded
    };
}

for (const item of PLL_DATA) {
    const res = analyzePll(item);
    console.log(`\n========================================`);
    console.log(`${res.name} (${res.id})`);
    console.log(`Alg: ${res.alg}`);
    console.log(`Side colors:`);
    console.log(`  top:    [${res.top.join(', ')}]`);
    console.log(`  right:  [${res.right.join(', ')}]`);
    console.log(`  bottom: [${res.bottom.join(', ')}]`);
    console.log(`  left:   [${res.left.join(', ')}]`);
    console.log(`Moves needed (from -> to):`);
    res.movesNeeded.forEach(m => console.log(`  ${m.from} -> ${m.to}`));
}
