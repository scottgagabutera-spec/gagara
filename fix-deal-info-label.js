const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/deal/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const from = '<div className="mini-label">Deal info</div>';
const to   = '<div className="mini-label">Agreement info</div>';

if (!content.includes(from)) {
  console.log('SKIP: string not found');
  process.exit(1);
}

content = content.replace(from, to);
fs.writeFileSync(filePath, content, 'utf8');
console.log('deal info label: OK');
