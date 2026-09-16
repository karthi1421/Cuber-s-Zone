const fs = require('fs');

const content = fs.readFileSync('C:/Users/Venkata Sathanarayan/.gemini/antigravity-ide/brain/e87f0dde-f7e1-4fc1-b6af-1501284ce6ba/.system_generated/steps/134/content.md', 'utf8');

const cases = [
    'Aa', 'Ab', 'E', 'F', 'Ga', 'Gb', 'Gc', 'Gd',
    'H', 'Ja', 'Jb', 'Na', 'Nb', 'Ra', 'Rb',
    'T', 'Ua', 'Ub', 'V', 'Y', 'Z'
];

for (const c of cases) {
    const id = `${c}_Permutation`;
    const idx = content.indexOf(`id="${id}"`);
    if (idx !== -1) {
        const chunk = content.slice(idx, idx + 2500);
        // Find image
        const imgMatch = chunk.match(/src="\/wiki\/images\/[^"]+\/([^"]+)"/);
        // Find first alg
        const algMatch = chunk.match(/href="http:\/\/alg\.cubing\.net\/\?puzzle=3x3x3&amp;stage=PLL[^"]*&amp;alg=([^"]+)"/);
        // Find text before Speedsolving Algorithms
        const textChunk = chunk.slice(0, chunk.indexOf('Speedsolving Algorithms') !== -1 ? chunk.indexOf('Speedsolving Algorithms') : 500);
        const textClean = textChunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        
        console.log(`\n=== ${c} Permutation ===`);
        console.log('Image:', imgMatch ? imgMatch[1] : 'none');
        console.log('Alg URL param:', algMatch ? decodeURIComponent(algMatch[1].replace(/\+/g, '%20')) : 'none');
        console.log('Intro text:', textClean.slice(0, 300));
    }
}
