import { cube3x3x3 } from 'cubing/puzzles';

const kpuzzle = await cube3x3x3.kpuzzle();
// In a 3x3 cube:
// Swapping 2 corners is an ODD permutation of corners (1 transposition).
// Swapping 2 edges is an ODD permutation of edges (1 transposition).
// Total permutation parity is ODD + ODD = EVEN!
// So ANY swap of 2 corners and 2 edges IS A VALID 3x3 CUBE STATE!
console.log('Parity check: 1 corner swap + 1 edge swap is valid on 3x3x3!');
