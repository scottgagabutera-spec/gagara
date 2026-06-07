const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Replace stat CSS with trust-line CSS ──
const oldStatCSS = `.hero-stats { display: flex; gap: 40px; }`;
if (!c.includes(oldStatCSS)) { console.log('ERROR: stat CSS not found'); process.exit(1); }

c = c.replace(oldStatCSS,
`.hero-stats { display: flex; flex-direction: column; gap: 10px; }`);
console.log('stat CSS replaced: OK');

// ── STEP 2: Remove stat-val CSS if present ──
const statValCSS = /\.stat-val \{[^}]+\}\s*/g;
c = c.replace(statValCSS, '');
console.log('stat-val CSS removed: OK');

// ── STEP 3: Replace stat-label CSS ──
const oldLabelCSS = `.stat-label { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-secondary); line-height: 1.5; }`;
if (c.includes(oldLabelCSS)) {
  c = c.replace(oldLabelCSS,
`.trust-line { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-secondary); line-height: 1.6; display: flex; align-items: flex-start; gap: 8px; }
        .trust-line::before { content: '✓'; color: var(--green); font-size: 13px; flex-shrink: 0; margin-top: 1px; }`);
  console.log('stat-label CSS replaced: OK');
} else {
  console.log('stat-label CSS not found — skipping');
}

// ── STEP 4: Replace the JSX stats block ──
const oldStatsJSX = `            <div className="hero-stats">
              <div>
                <div className="stat-val">2<span>×</span></div>
                <div className="stat-label">Both sides covered<br />Not just one person</div>
              </div>
              <div>
                <div className="stat-val"><span>0</span></div>
                <div className="stat-label">Surprises<br />Everyone sees every step</div>
              </div>
              <div>
                <div className="stat-val"><span>∞</span></div>
                <div className="stat-label">Kinds of agreement<br />Small favour to big contract</div>
              </div>
            </div>`;

if (!c.includes(oldStatsJSX)) { console.log('ERROR: stats JSX not found'); process.exit(1); }

c = c.replace(oldStatsJSX,
`            <div className="hero-stats">
              <div className="trust-line">Free to create — no fees until money moves</div>
              <div className="trust-line">Money only moves when both sides agree</div>
              <div className="trust-line">Works for any agreement, small or large</div>
            </div>`);
console.log('stats JSX replaced: OK');

// ── STEP 5: Fix mobile hero-stats override ──
const oldMobileStats = `.hero-stats { gap: 28px; }`;
if (c.includes(oldMobileStats)) {
  c = c.replace(oldMobileStats, `.hero-stats { gap: 8px; }`);
  console.log('mobile stats override fixed: OK');
}
const oldMobileStats2 = `.hero-stats { flex-direction: column; gap: 20px; }`;
if (c.includes(oldMobileStats2)) {
  c = c.replace(oldMobileStats2, `.hero-stats { gap: 8px; }`);
  console.log('mobile stats override 2 fixed: OK');
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nHero stats patch complete.');
