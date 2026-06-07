const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

const oldSteps = '                <div key={i} className={`step ${isActive ? \'active\' : \'\'} ${isDone ? \'done\' : \'\'}`}>\n                  <div className="step-icon" aria-hidden="true">{s.icon}</div>\n                  <div className="step-num">{s.n}</div>\n                  <div className="step-title">{s.title}</div>\n                  <div className="step-desc">{s.desc}</div>\n                </div>';

if (!c.includes(oldSteps)) { console.log('ERROR: step JSX not found'); process.exit(1); }

const newSteps = '                <div key={i} className={`step ${isActive ? \'active\' : \'\'} ${isDone ? \'done\' : \'\'}`}\n                  onClick={e => e.currentTarget.classList.toggle(\'open\')}>\n                  <div className="step-header">\n                    <div className="step-icon" aria-hidden="true">{s.icon}</div>\n                    <div className="step-header-text">\n                      <div className="step-num">{s.n}</div>\n                      <div className="step-title">{s.title}</div>\n                    </div>\n                    <svg className="step-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>\n                  </div>\n                  <div className="step-desc">{s.desc}</div>\n                </div>';

c = c.replace(oldSteps, newSteps);
console.log('steps accordion JSX: OK');

c = c.replace("title:'Payment goes into the vault'", "title:'Payment goes into the agreement'");
console.log('step 02 title fixed: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nSteps accordion complete.');
