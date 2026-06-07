const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// Replace the mobile steps CSS inside the @media block
const old = `          .steps-grid { grid-template-columns: 1fr; gap: 28px; }
          .steps-grid::before { display: none; }`;

const fix = `          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }
          .step { flex-direction: row; align-items: flex-start; gap: 16px; padding: 16px 0; padding-right: 0; border-bottom: 0.5px solid var(--border); }
          .step:last-child { border-bottom: none; }
          .step-icon { width: 40px; height: 40px; min-width: 40px; margin-bottom: 0; flex-shrink: 0; }
          .step-num { margin-bottom: 4px; }`;

if (c.includes(old)) {
  c = c.replace(old, fix);
  console.log('steps mobile layout: OK');
} else {
  console.log('ERROR: pattern not found');
  process.exit(1);
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Steps mobile fix complete.');
