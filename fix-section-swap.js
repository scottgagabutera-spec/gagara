const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// Fix comment and id for situations section
c = c.replace('      {/* \u2500\u2500 REAL SITUATIONS \u2500\u2500 */}', '      {/* \u2500\u2500 WHO IT HELPS \u2500\u2500 */}');
c = c.replace('        <section className="section" id="situations">', '        <section className="section" id="helps">');
console.log('comment and id fixed: OK');

// Now swap — find the two divider+section blocks
const divider = '      <div className="divider" aria-hidden="true" />';
const howComment = '      {/* \u2500\u2500 HOW IT WORKS \u2500\u2500 */}';
const helpsComment = '      {/* \u2500\u2500 WHO IT HELPS \u2500\u2500 */}';
const modesComment = '      {/* \u2500\u2500 MODES \u2500\u2500 */}';

const howStart = c.indexOf(divider + '\n\n' + howComment);
const helpsStart = c.indexOf(divider + '\n\n' + helpsComment);
const modesStart = c.indexOf(divider + '\n\n' + modesComment);

if (howStart === -1 || helpsStart === -1 || modesStart === -1) {
  console.log('ERROR: swap anchors not found');
  console.log('  howStart:', howStart, 'helpsStart:', helpsStart, 'modesStart:', modesStart);
  process.exit(1);
}

if (helpsStart < howStart) {
  console.log('already in correct order: OK');
} else {
  const howBlock = c.slice(howStart, helpsStart);
  const helpsBlock = c.slice(helpsStart, modesStart);
  c = c.slice(0, howStart) + helpsBlock + howBlock + c.slice(modesStart);
  console.log('sections swapped (helps before how): OK');
}

// Also update footer anchor
c = c.replace('<a href="#situations">Who it helps</a>', '<a href="#helps">Who it helps</a>');
// Update mobile nav pill
c = c.replace('<a href="#helps"   className="mobile-nav-pill">Who it helps</a>', '<a href="#helps" className="mobile-nav-pill">Who it helps</a>');
console.log('footer and nav anchors updated: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nSection swap complete.');
