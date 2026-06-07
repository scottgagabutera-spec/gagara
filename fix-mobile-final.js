const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Replace the broken step mobile CSS with accordion CSS + pills CSS ──
const oldStepMobileCSS = `          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }
          .step { flex-direction: row; align-items: flex-start; gap: 16px; padding: 16px 0; padding-right: 0; border-bottom: 0.5px solid var(--border); }
          .step:last-child { border-bottom: none; }
          .step-icon { width: 40px; height: 40px; min-width: 40px; margin-bottom: 0; flex-shrink: 0; }
          .step-num { margin-bottom: 4px; }`;

if (!c.includes(oldStepMobileCSS)) { console.log('ERROR: old step mobile CSS not found'); process.exit(1); }

c = c.replace(oldStepMobileCSS, `          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }
          .step { display: block; padding: 0; border-bottom: 0.5px solid var(--border); cursor: pointer; }
          .step:last-child { border-bottom: none; }
          .step-header { display: flex; align-items: center; gap: 14px; padding: 16px 0; }
          .step-icon { width: 40px; height: 40px; min-width: 40px; margin-bottom: 0; flex-shrink: 0; }
          .step-header-text { flex: 1; min-width: 0; }
          .step-num { margin-bottom: 2px; }
          .step-chevron { display: block; color: var(--text-faint); transition: transform 0.2s; flex-shrink: 0; }
          .step.open .step-chevron { transform: rotate(180deg); }
          .step-desc { display: none; font-size: 12px; color: var(--text-secondary); line-height: 1.6; padding: 0 0 14px 54px; }
          .step.open .step-desc { display: block; }
          /* Quick-jump nav pills */
          .mobile-nav { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 0 0 4px; margin-top: 20px; -webkit-overflow-scrolling: touch; }
          .mobile-nav::-webkit-scrollbar { display: none; }
          .mobile-nav-pill { font-family: 'Figtree', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-secondary); background: var(--surface2); border: 0.5px solid var(--border); border-radius: 20px; padding: 6px 14px; white-space: nowrap; cursor: pointer; text-decoration: none; transition: all 0.15s; flex-shrink: 0; }
          .mobile-nav-pill:hover { color: var(--text-primary); border-color: var(--border-md); }`);
console.log('step mobile CSS fixed: OK');

// ── STEP 2: Hide mobile-nav on desktop (add before vault-mobile hide) ──
const desktopHide = `        .mobile-nav { display: none; }
        .vault-mobile { display: none !important; }`;
const desktopHideAlt = `        .vault-mobile { display: none !important; }`;

if (c.includes(desktopHide)) {
  console.log('desktop hide already present: OK');
} else if (c.includes(desktopHideAlt)) {
  c = c.replace(desktopHideAlt, `        .mobile-nav { display: none; }
        .vault-mobile { display: none !important; }`);
  console.log('desktop mobile-nav hide added: OK');
} else {
  console.log('desktop hide anchor not found — skipping');
}

// ── STEP 3: Add quick-jump nav JSX after hero-actions ──
const heroActions = `            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create a free agreement</a>
              <a href="#vault" className="btn-link">See how it works</a>
            </div>`;

if (!c.includes(heroActions)) { console.log('ERROR: hero-actions not found'); process.exit(1); }

if (c.includes('mobile-nav-pill')) {
  console.log('mobile nav pills already in JSX: OK');
} else {
  c = c.replace(heroActions, `            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create a free agreement</a>
              <a href="#vault" className="btn-link">See how it works</a>
            </div>
            <nav className="mobile-nav" aria-label="Jump to section">
              <a href="#how"     className="mobile-nav-pill">How it works</a>
              <a href="#helps"   className="mobile-nav-pill">Who it helps</a>
              <a href="#modes"   className="mobile-nav-pill">Deal types</a>
              <a href="#payouts" className="mobile-nav-pill">Payouts</a>
            </nav>`);
  console.log('mobile nav pills JSX added: OK');
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nMobile final fix complete.');
