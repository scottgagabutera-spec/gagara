const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ─────────────────────────────────────────────
// FIX 1: Replace the broken mobile vault CSS
// The old approach tried to reflow a 3-column
// desktop layout into 1 column on mobile, which
// caused the expand/shrink glitch because the
// vault figure and wires still animate at desktop
// dimensions. 
//
// New approach: on mobile, hide the full vault-cols
// entirely and show a purpose-built mobile vault
// that is a simple vertical progress card.
// ─────────────────────────────────────────────

const oldMobileVault = `          .vault-wrap { padding: 0 16px 80px; }
          .vault-cols { grid-template-columns: 1fr; }
          .party-col { border-right: none; border-bottom: 0.5px solid var(--border); padding: 24px 20px; }
          .party-col.recv { border-left: none; border-bottom: none; align-items: flex-start; text-align: left; padding: 24px 20px; }
          .party-col.recv .p-id       { flex-direction: row; }
          .party-col.recv .p-verified { justify-content: flex-start; }
          .party-col.recv .p-eye      { justify-content: flex-start; }
          .vault-mid { border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); padding: 24px 20px; flex-direction: row; justify-content: center; align-items: center; gap: 16px; flex-wrap: wrap; }
          .wire-svg { display: none; }
          .vault-fig { width: 88px !important; height: 88px !important; min-width: 88px !important; max-width: 88px !important; min-height: 88px !important; max-height: 88px !important; }
          .vault-fig svg { width: 88px !important; height: 88px !important; }
          .vault-price-tag { font-size: 13px; padding: 3px 9px; }
          .audit { padding: 16px 20px; }`;

const newMobileVault = `          .vault-wrap { padding: 0 16px 80px; }
          /* Hide the desktop 3-col layout on mobile */
          .vault-cols { display: none; }
          /* Show the mobile vault card instead */
          .vault-mobile { display: flex; flex-direction: column; }
          .audit { padding: 16px 20px; }`;

c = c.replace(oldMobileVault, newMobileVault);
console.log('mobile vault CSS: OK');

// ─────────────────────────────────────────────
// FIX 2: Add mobile vault CSS classes
// These are the styles for the new mobile-only
// vertical progress card. Clean, premium, animated.
// ─────────────────────────────────────────────

const oldDesktopOnlyCSS = `        @media (max-width: 1024px) {`;

const newMobileCSS = `        /* Mobile vault — hidden on desktop, shown on mobile */
        .vault-mobile { display: none; border-radius: var(--r-2xl) var(--r-2xl) 0 0; overflow: hidden; }
        .vm-header { padding: 20px 20px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 0.5px solid var(--border); }
        .vm-id { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--indigo-l); letter-spacing: 0.08em; }
        .vm-amount { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 300; letter-spacing: -1px; color: var(--text-primary); transition: color 0.5s; }
        .vm-amount.released { color: var(--green); }
        .vm-steps { display: flex; flex-direction: column; }
        .vm-step { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-bottom: 0.5px solid var(--border); position: relative; transition: background 0.4s; }
        .vm-step:last-child { border-bottom: none; }
        .vm-step.active { background: rgba(84,72,228,0.04); }
        .vm-step.done   { background: rgba(43,168,106,0.03); }
        .vm-dot-wrap { width: 32px; height: 32px; border-radius: 50%; border: 0.5px solid var(--border-md); background: var(--surface2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.4s; }
        .vm-step.active .vm-dot-wrap { border-color: rgba(84,72,228,0.4); background: var(--indigo-dim); }
        .vm-step.done   .vm-dot-wrap { border-color: rgba(43,168,106,0.4); background: var(--green-dim); }
        .vm-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-faint); transition: all 0.4s; }
        .vm-step.active .vm-dot { background: var(--indigo-l); animation: vmPulse 1.5s ease-in-out infinite; }
        .vm-step.done   .vm-dot { background: var(--green); }
        .vm-step-label { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: color 0.4s; flex: 1; }
        .vm-step.active .vm-step-label { color: var(--text-primary); }
        .vm-step.done   .vm-step-label { color: var(--green); }
        .vm-step-actor { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); white-space: nowrap; transition: color 0.4s; }
        .vm-step.active .vm-step-actor { color: var(--indigo-l); }
        .vm-step.done   .vm-step-actor { color: var(--green); opacity: 0.7; }
        .vm-parties { display: grid; grid-template-columns: 1fr 1fr; border-top: 0.5px solid var(--border); }
        .vm-party { padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; }
        .vm-party:first-child { border-right: 0.5px solid var(--border); }
        .vm-party-role { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); }
        .vm-party-name { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .vm-party-state { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-secondary); transition: color 0.4s; }
        .vm-party-state.active { color: var(--indigo-l); }
        .vm-party-state.done   { color: var(--green); }
        @keyframes vmPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }

        @media (max-width: 1024px) {`;

c = c.replace(oldDesktopOnlyCSS, newMobileCSS);
console.log('mobile vault styles: OK');

// ─────────────────────────────────────────────
// FIX 3: Add the mobile vault JSX into the page
// Inserted right after the opening vault-card div,
// before the desktop vault-cols div.
// This is a clean vertical step-by-step card that
// shows the same animation phases as the desktop
// version but in a format that works on any phone.
// ─────────────────────────────────────────────

const oldVaultCard = `          <div className="vault-card">
            <div className="vault-cols">`;

const newVaultCard = `          <div className="vault-card">

            {/* ── MOBILE VAULT (shown on mobile, hidden on desktop) ── */}
            <div className="vault-mobile">
              <div className="vm-header">
                <div className="vm-id">GGR-4829-KXMT</div>
                <div className={\`vm-amount \${released ? 'released' : ''}\`}>
                  {released ? '$800.00 sent' : '$800.00'}
                </div>
              </div>
              <div className="vm-steps">
                {[
                  { label: 'Agreement created',       actor: '@gaga',          done: true,      active: false },
                  { label: 'Both sides connected',    actor: '@client joined', done: true,      active: false },
                  { label: '$800 reserved by payer',  actor: '@gaga',          done: funded,    active: !funded && phase === 0 },
                  { label: 'Work in progress',        actor: '@client',        done: working,   active: funded && !working },
                  { label: 'Payer confirmed done',    actor: '@gaga',          done: confirmed, active: working && !confirmed },
                  { label: 'Payment released',        actor: 'Gagara',         done: released,  active: confirmed && !released },
                ].map((s, i) => (
                  <div key={i} className={\`vm-step \${s.done ? 'done' : ''} \${s.active ? 'active' : ''}\`}>
                    <div className="vm-dot-wrap">
                      <div className="vm-dot">
                        {s.done && (
                          <svg style={{position:'absolute',width:'12px',height:'12px',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}} viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6l2.5 2.5L9.5 4" stroke="#2BA86A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="vm-step-label">{s.label}</div>
                    <div className="vm-step-actor">{s.actor}</div>
                  </div>
                ))}
              </div>
              <div className="vm-parties">
                <div className="vm-party">
                  <div className="vm-party-role">Payer</div>
                  <div className="vm-party-name">@gaga</div>
                  <div className={\`vm-party-state \${released ? 'done' : funded ? 'active' : ''}\`}>
                    {released ? 'Payment sent' : funded ? 'Money reserved' : 'Waiting'}
                  </div>
                </div>
                <div className="vm-party">
                  <div className="vm-party-role">Receiver</div>
                  <div className="vm-party-name">@client</div>
                  <div className={\`vm-party-state \${released ? 'done' : working ? 'active' : ''}\`}>
                    {released ? 'Payment received' : working ? 'Working' : 'Waiting'}
                  </div>
                </div>
              </div>
            </div>

            {/* ── DESKTOP VAULT (hidden on mobile, shown on desktop) ── */}
            <div className="vault-cols">`;

c = c.replace(oldVaultCard, newVaultCard);
console.log('mobile vault JSX: OK');

// ─────────────────────────────────────────────
// FIX 4: Close the extra desktop vault div
// We wrapped vault-cols in a new div so we need
// to close it before the audit log.
// ─────────────────────────────────────────────

const oldVaultClose = `            </div>

            <div className="audit"`;

const newVaultClose = `            </div>
            </div>{/* end desktop vault-cols wrapper */}

            <div className="audit"`;

c = c.replace(oldVaultClose, newVaultClose);
console.log('vault close div: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nVault mobile fix complete.');
