const fs = require('fs');
const content = fs.readFileSync('C:/Users/Venkata Sathanarayan/.gemini/antigravity-ide/brain/e87f0dde-f7e1-4fc1-b6af-1501284ce6ba/.system_generated/steps/220/content.md', 'utf8');

const regex = /title="File:([^"]+)"/g;
let m;
const files = [];
while ((m = regex.exec(content)) !== null) {
    files.push(m[1]);
}
console.log('Files in category:', files);
