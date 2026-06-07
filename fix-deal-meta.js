const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const from = `<span>{deal.role === 'Receiver' ? '[Incoming]' : '[Outgoing]'} {deal.role}</span>`;
const to   = `<span>{deal.role === 'Receiver' ? 'Incoming' : 'Outgoing'}</span>`;

if (!content.includes(from)) {
  console.log('SKIP: string not found — check output below');
  console.log(JSON.stringify(from));
  process.exit(1);
}

content = content.replace(from, to);
fs.writeFileSync(filePath, content, 'utf8');
console.log('deal meta brackets: OK');
