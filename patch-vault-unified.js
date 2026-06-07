const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Replace all vault CSS ──
const cssVaultStart = `        .vault-wrap {`;
const cssVaultEnd = `        .audit {`;

const si = c.indexOf(cssVaultStart);
const ei = c.indexOf(cssVaultEnd);
if (si === -1 || ei === -1) { console.log('ERROR: vault CSS bounds not found'); process.exit(1); }

const newVaultCSS = `        .vault-wrap { padding: 0 48px 96px; width: 100%; }
        .vault-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 8px; }
        .vault-meta-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-label); display: flex; align-items: center; gap: 12px; }
        .vault-meta-label::before { content: ''; width: 20px; height: 0.5px; background: var(--text-label); flex-shrink: 0; }
        .vault-deal-id { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--indigo-l); letter-spacing: 0.06em; }
        .vault-card { border: 0.5px solid var(--border-md); border-radius: var(--r-2xl); overflow: hidden; background: var(--surface); width: 100%; }

        /* Unified vault — works on all screen sizes */
        .uv-parties { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 28px 32px; gap: 16px; border-bottom: 0.5px solid var(--border); }
        .uv-party { display: flex; align-items: center; gap: 14px; }
        .uv-party.right { flex-direction: row-reverse; }
        .uv-avatar { width: 44px; height: 44px; min-width: 44px; border-radius: var(--r-md); background: var(--surface4); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); transition: border-color 0.5s; flex-shrink: 0; }
        .uv-avatar.active { border-color: rgba(84,72,228,0.6); box-shadow: 0 0 0 3px rgba(84,72,228,0.08); }
        .uv-avatar.done   { border-color: rgba(43,168,106,0.6); box-shadow: 0 0 0 3px rgba(43,168,106,0.08); }
        .uv-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .uv-party.right .uv-info { align-items: flex-end; text-align: right; }
        .uv-role { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); }
        .uv-name { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uv-verified { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--green); display: flex; align-items: center; gap: 4px; }
        .uv-party.right .uv-verified { flex-direction: row-reverse; }
        .uv-state { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); transition: color 0.4s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uv-state.active { color: var(--indigo-l); }
        .uv-state.done   { color: var(--green); }

        /* Center vault indicator */
        .uv-center { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
        .uv-center-line { width: 1px; height: 16px; position: relative; overflow: hidden; background: var(--border); }
        .uv-flow { position: absolute; top: 0; left: 0; right: 0; height: 6px; animation: uvFlow 1.6s linear infinite; opacity: 0; transition: opacity 0.4s; }
        .uv-flow.active { opacity: 1; }
        .uv-flow.indigo { background: linear-gradient(to bottom, transparent, var(--indigo-l), transparent); }
        .uv-flow.green  { background: linear-gradient(to bottom, transparent, var(--green), transparent); }
        @keyframes uvFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
        .uv-lock-wrap { width: 40px; height: 40px; border-radius: 50%; background: var(--surface3); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; transition: all 0.5s; flex-shrink: 0; }
        .uv-lock-wrap.active { background: var(--indigo-dim); border-color: rgba(84,72,228,0.4); }
        .uv-lock-wrap.done   { background: var(--green-dim);  border-color: rgba(43,168,106,0.4); }
        .uv-label { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.08em; color: var(--text-faint); text-align: center; white-space: nowrap; }

        /* Amount row */
        .uv-amount-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 0.5px solid var(--border); flex-wrap: wrap; gap: 12px; }
        .uv-amount { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 300; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1; transition: color 0.5s; }
        .uv-amount.released { color: var(--green); }
        .uv-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 11px; border-radius: 5px; transition: all 0.4s; flex-shrink: 0; }
        .uv-badge.pending  { color: var(--text-faint); background: rgba(238,238,248,0.03); border: 0.5px solid var(--border); }
        .uv-badge.locked   { color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(84,72,228,0.2); }
        .uv-badge.released { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(43,168,106,0.2); }

        /* Event log */
        .uv-log { display: flex; flex-direction: column; }
        .uv-event { display: flex; align-items: center; gap: 12px; padding: 13px 32px; border-bottom: 0.5px solid var(--border); transition: background 0.3s; }
        .uv-event:last-child { border-bottom: none; }
        .uv-event.active { background: rgba(84,72,228,0.03); }
        .uv-event-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--border-md); transition: all 0.4s; }
        .uv-event.done   .uv-event-dot { background: var(--green); }
        .uv-event.active .uv-event-dot { background: var(--indigo-l); animation: uvPulse 1.4s ease-in-out infinite; }
        .uv-event-text { font-family: 'Figtree', sans-serif; font-size: 12px; color: var(--text-secondary); flex: 1; transition: color 0.3s; min-width: 0; }
        .uv-event.active .uv-event-text { color: var(--text-primary); font-weight: 500; }
        .uv-event.done   .uv-event-text { color: var(--text-secondary); }
        .uv-event-time { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); white-space: nowrap; flex-shrink: 0; }
        .uv-footer { padding: 12px 32px; display: flex; justify-content: space-between; align-items: center; border-top: 0.5px solid var(--border); flex-wrap: wrap; gap: 8px; }
        .uv-footer-id { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.08em; }
        .uv-footer-note { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--indigo-l); letter-spacing: 0.04em; }
        @keyframes uvPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.5); } }

        /* Hide old vault classes */
        .vault-mobile { display: none !important; }
        .vault-cols   { display: none !important; }

        `;

c = c.slice(0, si) + newVaultCSS + c.slice(ei);
console.log('vault CSS replaced: OK');

// ── STEP 2: Replace vault mobile breakpoint overrides ──
const oldMobileVaultCSS = `          /* Hide the desktop 3-col layout on mobile */
          .vault-cols { display: none; }
          /* Show the mobile vault card instead */
          .vault-mobile { display: flex; flex-direction: column; }`;

if (c.includes(oldMobileVaultCSS)) {
  c = c.replace(oldMobileVaultCSS, `          .vault-wrap { padding: 0 16px 80px; }
          .uv-parties { padding: 20px 16px; gap: 8px; }
          .uv-avatar { width: 36px; height: 36px; min-width: 36px; font-size: 14px; }
          .uv-amount-row { padding: 16px; }
          .uv-amount { font-size: 32px; }
          .uv-event { padding: 12px 16px; }
          .uv-footer { padding: 10px 16px; }`);
  console.log('mobile overrides replaced: OK');
} else {
  // Try alternate — patch may have already changed it
  const altMobile = `          .vault-wrap { padding: 0 16px 80px; }`;
  if (!c.includes(altMobile)) {
    // Inject into existing @media block
    const mediaBlock = `          .closing { padding: 0 16px 80px; }`;
    if (c.includes(mediaBlock)) {
      c = c.replace(mediaBlock, `          .vault-wrap { padding: 0 16px 80px; }
          .uv-parties { padding: 20px 16px; gap: 8px; }
          .uv-avatar { width: 36px; height: 36px; min-width: 36px; font-size: 14px; }
          .uv-amount-row { padding: 16px; }
          .uv-amount { font-size: 32px; }
          .uv-event { padding: 12px 16px; }
          .uv-footer { padding: 10px 16px; }
          .closing { padding: 0 16px 80px; }`);
      console.log('mobile overrides injected via fallback: OK');
    } else {
      console.log('mobile overrides — skipped (already clean or not found)');
    }
  } else {
    console.log('mobile overrides already present: OK');
  }
}

// ── STEP 3: Replace the full vault JSX ──
const jsxStart = `          <div className="vault-card">`;
const jsxEnd = `          </div>\n        </div>\n      </div>\n\n      <div className="divider"`;

const jsxSi = c.indexOf(jsxStart);
const jsxEi = c.indexOf(jsxEnd);
if (jsxSi === -1 || jsxEi === -1) { console.log('ERROR: JSX bounds not found'); process.exit(1); }

const newJSX = `          <div className="vault-card">

            {/* ── UNIFIED VAULT — one design, all screen sizes ── */}

            {/* Two parties */}
            <div className="uv-parties">
              <div className="uv-party">
                <div className={\`uv-avatar \${released ? 'done' : funded ? 'active' : ''}\`}>G</div>
                <div className="uv-info">
                  <div className="uv-role">Paying</div>
                  <div className="uv-name">@gaga</div>
                  <div className="uv-verified">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                  <div className={\`uv-state \${released ? 'done' : funded ? 'active' : ''}\`}>
                    {released ? 'Payment sent' : funded ? 'Money reserved' : 'Waiting'}
                  </div>
                </div>
              </div>

              {/* Center lock indicator */}
              <div className="uv-center">
                <div className="uv-center-line">
                  <div className={\`uv-flow \${funded ? 'active' : ''} \${released ? 'green' : 'indigo'}\`} />
                </div>
                <div className={\`uv-lock-wrap \${released ? 'done' : funded ? 'active' : ''}\`}>
                  {!released ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={funded ? '#7268ED' : 'rgba(238,238,248,0.2)'} strokeWidth="1.5" strokeLinecap="round" style={{transition:'stroke 0.4s'}}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2BA86A" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                </div>
                <div className="uv-center-line">
                  <div className={\`uv-flow \${funded ? 'active' : ''} \${released ? 'green' : 'indigo'}\`} style={{animationDelay:'0.8s'}} />
                </div>
                <div className="uv-label">Gagara</div>
              </div>

              <div className="uv-party right">
                <div className={\`uv-avatar \${released ? 'done' : working ? 'active' : ''}\`}>C</div>
                <div className="uv-info">
                  <div className="uv-role">Receiving</div>
                  <div className="uv-name">@client</div>
                  <div className="uv-verified" style={{flexDirection:'row-reverse'}}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                  <div className={\`uv-state \${released ? 'done' : working ? 'active' : ''}\`}>
                    {released ? 'Payment received' : working ? 'Working' : 'Waiting'}
                  </div>
                </div>
              </div>
            </div>

            {/* Amount + badge */}
            <div className="uv-amount-row">
              <div className={\`uv-amount \${released ? 'released' : ''}\`}>$800.00</div>
              <div className={\`uv-badge \${released ? 'released' : funded ? 'locked' : 'pending'}\`}>
                {released ? 'Released' : funded ? 'Reserved' : 'Pending'}
              </div>
            </div>

            {/* Live event log */}
            <div className="uv-log">
              {[
                { text: 'Agreement created by @gaga',     time: '09:12', done: true,      active: false },
                { text: '@client joined the agreement',   time: '09:15', done: true,      active: false },
                { text: '$800 reserved — work can start', time: '09:23', done: funded,    active: !funded },
                { text: 'Work confirmed complete',        time: '10:44', done: working,   active: funded && !working },
                { text: 'Both sides confirmed done',      time: '11:02', done: confirmed, active: working && !confirmed },
                { text: '$800 sent to @client',           time: '11:02', done: released,  active: confirmed && !released },
              ].map((ev, i) => (
                <div key={i} className={\`uv-event \${ev.done ? 'done' : ev.active ? 'active' : ''}\`}>
                  <div className="uv-event-dot" />
                  <div className="uv-event-text">{ev.text}</div>
                  {(ev.done || ev.active) && <div className="uv-event-time">{ev.time}</div>}
                </div>
              ))}
            </div>

            <div className="uv-footer">
              <span className="uv-footer-id">GGR-4829-KXMT</span>
              <span className="uv-footer-note">Both sides must agree before anything moves</span>
            </div>

          </div>\n        </div>\n      </div>\n\n      <div className="divider"`;

c = c.slice(0, jsxSi) + newJSX + c.slice(jsxEi + jsxEnd.length);
console.log('vault JSX replaced: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nUnified vault complete.');
