const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Add quick-jump nav CSS + collapsible step CSS into mobile media block ──
const mobileInsertAfter = `          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }`;

if (!c.includes(mobileInsertAfter)) { console.log('ERROR: mobile steps CSS anchor not found'); process.exit(1); }

c = c.replace(mobileInsertAfter, `          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }
          /* Quick-jump nav — mobile only */
          .mobile-nav { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 0 0 4px; margin-top: 20px; -webkit-overflow-scrolling: touch; }
          .mobile-nav::-webkit-scrollbar { display: none; }
          .mobile-nav-pill { font-family: 'Figtree', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-secondary); background: var(--surface2); border: 0.5px solid var(--border); border-radius: 20px; padding: 6px 14px; white-space: nowrap; cursor: pointer; text-decoration: none; transition: all 0.15s; flex-shrink: 0; }
          .mobile-nav-pill:hover { color: var(--text-primary); border-color: var(--border-md); }
          /* Collapsible steps on mobile */
          .step { cursor: pointer; border-bottom: 0.5px solid var(--border); padding: 16px 0; }
          .step-header { display: flex; align-items: center; gap: 14px; }
          .step-icon { width: 40px; height: 40px; flex-shrink: 0; margin-bottom: 0; }
          .step-header-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
          .step-chevron { color: var(--text-faint); transition: transform 0.2s; flex-shrink: 0; }
          .step.open .step-chevron { transform: rotate(180deg); }
          .step-desc { display: none; font-size: 12px; color: var(--text-secondary); line-height: 1.6; padding: 10px 0 0 54px; }
          .step.open .step-desc { display: block; }`);
console.log('mobile CSS added: OK');

// ── STEP 2: Add desktop override to hide mobile-nav ──
const desktopHide = `        .vault-mobile { display: none !important; }`;
if (c.includes(desktopHide)) {
  c = c.replace(desktopHide, `        .mobile-nav { display: none; }
        .vault-mobile { display: none !important; }`);
  console.log('desktop mobile-nav hide: OK');
} else {
  // fallback: add before .vault-cols
  const fallback = `        .vault-cols   { display: none !important; }`;
  if (c.includes(fallback)) {
    c = c.replace(fallback, `        .mobile-nav { display: none; }
        .vault-cols   { display: none !important; }`);
    console.log('desktop mobile-nav hide (fallback): OK');
  } else {
    console.log('desktop mobile-nav hide — skipped');
  }
}

// ── STEP 3: Add quick-jump nav JSX after hero-actions ──
const oldHeroActions = `            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create a free agreement</a>
              <a href="#vault" className="btn-link">See how it works</a>
            </div>`;

if (!c.includes(oldHeroActions)) { console.log('ERROR: hero-actions JSX not found'); process.exit(1); }

c = c.replace(oldHeroActions, `            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create a free agreement</a>
              <a href="#vault" className="btn-link">See how it works</a>
            </div>
            <nav className="mobile-nav" aria-label="Jump to section">
              <a href="#how"     className="mobile-nav-pill">How it works</a>
              <a href="#helps"   className="mobile-nav-pill">Who it helps</a>
              <a href="#modes"   className="mobile-nav-pill">Deal types</a>
              <a href="#payouts" className="mobile-nav-pill">Payouts</a>
            </nav>`);
console.log('quick-jump nav JSX added: OK');

// ── STEP 4: Replace steps JSX with collapsible accordion ──
const oldStepsGrid = `          <div className="steps-grid">
            {[
              { n:'01', title:'Agree on the terms',       desc:'One person writes up the agreement — the amount, what is expected, and by when. They share a simple code with the other person so both are looking at the same thing.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              { n:'02', title:'Payment goes into the vault', desc:'The person paying puts the money in through Gagara. It is reserved and cannot be taken back. The person doing the work can see it is there before they lift a finger.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
              { n:'03', title:'Work gets done',             desc:'The job is carried out. Both sides can see progress. If there are milestones, each one is tracked and confirmed separately.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
              { n:'04', title:'Both sides say yes',         desc:'When the work is done, both of you confirm it. One person saying yes is not enough. Both must agree before the money moves.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { n:'05', title:'Payment is sent',            desc:'Once both confirm, the money goes straight to the receiver. The full record of the deal stays on file permanently.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg> },
            ].map((s, i) => (
              <div key={i} className={\`step \${phase >= i ? (phase === i ? 'active' : 'done') : ''}\`}>
                <div className="step-icon" aria-hidden="true">{s.icon}</div>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>`;

if (!c.includes(oldStepsGrid)) { console.log('ERROR: steps grid JSX not found'); process.exit(1); }

c = c.replace(oldStepsGrid, `          <div className="steps-grid" id="steps-accordion">
            {[
              { n:'01', title:'Agree on the terms',       desc:'One person writes up the agreement — the amount, what is expected, and by when. They share a simple code with the other person so both are looking at the same thing.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              { n:'02', title:'Payment goes into the agreement', desc:'The person paying puts the money in through Gagara. It is reserved and cannot be taken back. The person doing the work can see it is there before they lift a finger.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
              { n:'03', title:'Work gets done',             desc:'The job is carried out. Both sides can see progress. If there are milestones, each one is tracked and confirmed separately.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
              { n:'04', title:'Both sides say yes',         desc:'When the work is done, both of you confirm it. One person saying yes is not enough. Both must agree before the money moves.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { n:'05', title:'Payment is sent',            desc:'Once both confirm, the money goes straight to the receiver. The full record of the deal stays on file permanently.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg> },
            ].map((s, i) => (
              <div key={i} className={\`step \${phase >= i ? (phase === i ? 'active' : 'done') : ''}\`}
                onClick={e => {
                  const el = e.currentTarget;
                  el.classList.toggle('open');
                }}>
                <div className="step-header">
                  <div className="step-icon" aria-hidden="true">{s.icon}</div>
                  <div className="step-header-text">
                    <div className="step-num">{s.n}</div>
                    <div className="step-title">{s.title}</div>
                  </div>
                  <svg className="step-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>`);
console.log('steps accordion JSX: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nMobile nav + steps accordion complete.');
