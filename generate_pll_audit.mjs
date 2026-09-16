import { cube3x3x3 } from 'cubing/puzzles';
import { Alg } from 'cubing/alg';
import { PLL_DATA } from './src/data/cfopData.ts';

const kpuzzle = await cube3x3x3.kpuzzle();

// Standard Western color scheme:
// U: Yellow, D: White, F: Red, B: Orange, L: Blue, R: Green
// Facelet indices or positions:
// In cubing.js, let's see how stickers/faces are defined on cube3x3x3.

console.log('kpuzzle definition keys:', Object.keys(kpuzzle.definition));
console.log('orbits:', kpuzzle.definition.orbits.map(o => `${o.name} (${o.numPieces} pieces, ${o.numOrientations} orientations)`));
