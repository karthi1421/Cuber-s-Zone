const { CubeData } = require('sr-visualizer/dist/lib/cube/simulation');
const { parseCase } = require('sr-visualizer/dist/lib/cube/parsing/algorithm');
const { Face } = require('sr-visualizer/dist/lib/cube/constants');

const PLL_ALGS = {
    'pll-aa': "x R' D2 R U R' D2 R U' R'",
    'pll-ab': "x R U' R D2 R' U R D2 R2",
    'pll-e': "x' R U' R' D R U R' D' R U R' D R U' R' D'",
    'pll-f': "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    'pll-ga': "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    'pll-gb': "R' U' R U D' R2 U R' U R U' R U' R2 D",
    'pll-gc': "R2 U' R U' R U R' U R2 D' U R U' R' D",
    'pll-gd': "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    'pll-h': "M2 U M2 U2 M2 U M2",
    'pll-ja': "x R2 F R F' R U2 r' U r U2",
    'pll-jb': "R U R' F' R U R' U' R' F R2 U' R'",
    'pll-na': "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    'pll-nb': "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    'pll-ra': "R U R' F' R U2 R' U2 R' F R U R U2 R'",
    'pll-rb': "R' U2 R U2 R' F R U R' U' R' F' R2 U'",
    'pll-t': "R U R' U' R' F R2 U' R' U' R U R' F'",
    'pll-ua': "R U' R U R U R U' R' U' R2",
    'pll-ub': "R2 U R U R' U' R' U' R' U R'",
    'pll-v': "R' U R' U' y R' F' R2 U' R' U R' F R F",
    'pll-y': "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    'pll-z': "M' U M2 U M2 U M' U2 M2"
};

// Colors: U=yellow, D=white, F=red, B=orange, L=blue, R=green
function getPllState(alg) {
    const solved = {
        [Face.U]: Array(9).fill('Y'),
        [Face.D]: Array(9).fill('W'),
        [Face.F]: Array(9).fill('R'),
        [Face.B]: Array(9).fill('O'),
        [Face.L]: Array(9).fill('B'),
        [Face.R]: Array(9).fill('G'),
    };
    const cube = new CubeData(3, solved);
    const clean = alg.replace(/[()]/g, '').replace(/([URFDLBMESxyzfw])2'/g, '$12').trim();
    const moves = parseCase(clean);
    moves.forEach(m => cube.turn(m));
    
    // Side strips:
    // Back (Top): 48, 47, 46 -> B[2], B[1], B[0]
    const top = [cube.faces[Face.B][2], cube.faces[Face.B][1], cube.faces[Face.B][0]];
    // Right: 18, 17, 16 -> R[8], R[7], R[6] wait, let's verify R indices!
    // Front (Bottom): 19, 20, 21 -> F[0], F[1], F[2]
    const bottom = [cube.faces[Face.F][0], cube.faces[Face.F][1], cube.faces[Face.F][2]];
    
    return {
        faces: {
            B: cube.faces[Face.B],
            R: cube.faces[Face.R],
            F: cube.faces[Face.F],
            L: cube.faces[Face.L]
        }
    };
}

console.log(getPllState("R U R' U' R' F R2 U' R' U' R U R' F'"));
