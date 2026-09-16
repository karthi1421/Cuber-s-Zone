const { CubeData } = require('sr-visualizer/dist/lib/cube/simulation');
const { parseCase } = require('sr-visualizer/dist/lib/cube/parsing/algorithm');
const { Face } = require('sr-visualizer/dist/lib/cube/constants');

// Default solved cube faces:
// Faces in order: U, D, F, B, L, R
// U: Yellow, D: White, F: Red, B: Orange, L: Blue, R: Green
const solved = {
    [Face.U]: Array(9).fill('yellow'),
    [Face.D]: Array(9).fill('white'),
    [Face.F]: Array(9).fill('red'),
    [Face.B]: Array(9).fill('orange'),
    [Face.L]: Array(9).fill('blue'),
    [Face.R]: Array(9).fill('green'),
};

const cube = new CubeData(3, solved);
const moves = parseCase("R U R' U' R' F R2 U' R' U' R U R' F'");
moves.forEach(m => cube.turn(m));

console.log('T-Perm Top Layer Side Stickers:');
console.log('Back (Top of diagram):', cube.faces[Face.B].slice(0, 3));
console.log('Right:', cube.faces[Face.R].slice(0, 3));
console.log('Front (Bottom of diagram):', cube.faces[Face.F].slice(0, 3));
console.log('Left:', cube.faces[Face.L].slice(0, 3));
