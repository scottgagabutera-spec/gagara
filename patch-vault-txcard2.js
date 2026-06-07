const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Replace CSS block ──
// Find everything from .vault-mobile to the @keyframes vmPulse line
const cssStart = `        /* Mobile vault — hidden on desktop, shown on mobile */\n        .vault-mobile {`;
const cssEnd = `@keyframes vmPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }`;

const cssStartIdx = c.indexOf(cssStart);
const cssEndIdx = c.indexOf(cssEnd);

if (cssStartIdx === -1) { console.log('ERROR: CSS start not found'); process.exit(1); }
if (cssEndIdx === -1) { console.log('ERROR: CSS end not found'); process.exit(1); }

const newCSS = `        /* Mobile vault — hidden on desktop, shown on mobile */
        .vault-mobile { display: none; border-radius: var(--r-2xl) var(--r-2xl) 0 0; overflow: hidden; }

        /* Transaction card — two parties */
        .vtc-parties { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 24px 20px; gap: 12px; }
        .vtc-party { display: flex; flex-direction: column; gap: 6px; }
        .vtc-party.right { align-items: flex-end; text-align: right; }
        .vtc-role { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); }
        .vtc-avatar { width: 44px; height: 44px; border-radius: var(--r-md); background: var(--surface4); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); transition: border-color 0.4s; }
        .vtc-avatar.funded { border-color: rgba(84,72,228,0.5); }
        .vtc-avatar.done   { border-color: rgba(43,168,106,0.5); }
        .vtc-name { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .vtc-verified { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--green); display: flex; align-items: center; gap: 4px; }
        .vtc-party.right .vtc-verified { justify-content: flex-end; }
        .vtc-arrow { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .vtc-arrow-line { width: 1px; height: 20px; background: var(--border); position: relative; overflow: hidden; }
        .vtc-arrow-pulse { position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(to bottom, transparent, var(--indigo-l), transparent); animation: vtcFlow 1.8s linear infinite; opacity: 0; transition: opacity 0.4s; }
        .vtc-arrow-pulse.active { opacity: 1; }
        .vtc-arrow-pulse.green { background: linear-gradient(to bottom, transparent, var(--green), transparent); }
        .vtc-arrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-md); transition: all 0.4s; flex-shrink: 0; }
        .vtc-arrow-dot.active { background: var(--indigo-l); }
        .vtc-arrow-dot.done   { background: var(--green); }
        @keyframes vtcFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
        .vtc-amount-wrap { border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        .vtc-amount { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 300; letter-spacing: -1.5px; color: var(--text-primary); transition: color 0.5s; line-height: 1; }
        .vtc-amount.released { color: var(--green); }
        .vtc-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 10px; border-radius: 5px; transition: all 0.4s; }
        .vtc-badge.locked   { color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(84,72,228,0.2); }
        .vtc-badge.released { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(43,168,106,0.2); }
        .vtc-badge.pending  { color: var(--text-faint); background: rgba(238,238,248,0.03); border: 0.5px solid var(--border); }
        .vtc-timeline { display: flex; flex-direction: column; }
        .vtc-event { display: flex; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 0.5px solid var(--border); transition: background 0.3s; }
        .vtc-event:last-child { border-bottom: none; }
        .vtc-event.active { background: rgba(84,72,228,0.03); }
        .vtc-event-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--border-md); transition: all 0.4s; }
        .vtc-event.active .vtc-event-dot { background: var(--indigo-l); animation: vtcPulse 1.4s ease-in-out infinite; }
        .vtc-event.done   .vtc-event-dot { background: var(--green); }
        .vtc-event-text { font-family: 'Figtree', sans-serif; font-size: 12px; color: var(--text-secondary); flex: 1; transition: color 0.3s; }
        .vtc-event.active .vtc-event-text { color: var(--text-primary); font-weight: 500; }
        .vtc-event-time { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); white-space: nowrap; }
        .vtc-id { padding: 10px 20px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.08em; border-top: 0.5px solid var(--border); display: flex; justify-content: space-between; }
        .vtc-id-note { color: var(--indigo-l); }
        @keyframes vtcPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.5); } }`;

c = c.slice(0, cssStartIdx) + newCSS + c.slice(cssEndIdx + cssEnd.length);
console.log('CSS replaced: OK');

// ── STEP 2: Replace JSX block ──
const jsxStart = `            {/* ── MOBILE VAULT (shown on mobile, hidden on desktop) ── */}\n            <div className="vault-mobile">`;
const jsxEnd = `            </div>\n\n            {/* ── DESKTOP VAULT`;

const jsxStartIdx = c.indexOf(jsxStart);
const jsxEndIdx = c.indexOf(jsxEnd);

if (jsxStartIdx === -1) { console.log('ERROR: JSX start not found'); process.exit(1); }
if (jsxEndIdx === -1) { console.log('ERROR: JSX end not found'); process.exit(1); }

const newJSX = `            {/* ── MOBILE VAULT — Live transaction card (mobile only) ── */}
            <div className="vault-mobile">

              <div className="vtc-parties">
                <div className="vtc-party">
                  <div className="vtc-role">Paying</div>
                  <div className={\`vtc-avatar \${released ? 'done' : funded ? 'funded' : ''}\`}>G</div>
                  <div className="vtc-name">@gaga</div>
                  <div className="vtc-verified">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                </div>
                <div className="vtc-arrow">
                  <div className={\`vtc-arrow-dot \${released ? 'done' : funded ? 'active' : ''}\`} />
                  <div className="vtc-arrow-line">
                    <div className={\`vtc-arrow-pulse \${funded ? 'active' : ''} \${released ? 'green' : ''}\`} />
                  </div>
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{flexShrink:0}}>
                    <path d="M0 0l4 5 4-5" fill={released ? '#2BA86A' : funded ? '#7268ED' : 'rgba(238,238,248,0.15)'} style={{transition:'fill 0.4s'}}/>
                  </svg>
                  <div className="vtc-arrow-line" style={{transform:'scaleY(-1)'}}>
                    <div className={\`vtc-arrow-pulse \${funded ? 'active' : ''} \${released ? 'green' : ''}\`} style={{animationDelay:'0.9s'}} />
                  </div>
                  <div className={\`vtc-arrow-dot \${released ? 'done' : funded ? 'active' : ''}\`} />
                </div>
                <div className="vtc-party right">
                  <div className="vtc-role">Receiving</div>
                  <div className={\`vtc-avatar \${released ? 'done' : working ? 'funded' : ''}\`} style={{marginLeft:'auto'}}>C</div>
                  <div className="vtc-name">@client</div>
                  <div className="vtc-verified">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                </div>
              </div>

              <div className="vtc-amount-wrap">
                <div className={\`vtc-amount \${released ? 'released' : ''}\`}>$800.00</div>
                <div className={\`vtc-badge \${released ? 'released' : funded ? 'locked' : 'pending'}\`}>
                  {released ? 'Released' : funded ? 'Reserved' : 'Pending'}
                </div>
              </div>

              <div className="vtc-timeline">
                {[
                  { text: 'Agreement created by @gaga',     time: '09:12', done: true,      active: false },
                  { text: '@client joined',                  time: '09:15', done: true,      active: false },
                  { text: '$800 reserved — work can start', time: '09:23', done: funded,    active: !funded },
                  { text: 'Work confirmed complete',         time: '10:44', done: working,   active: funded && !working },
                  { text: 'Both sides confirmed done',       time: '11:02', done: confirmed, active: working && !confirmed },
                  { text: '$800 sent to @client',            time: '11:02', done: released,  active: confirmed && !released },
                ].map((ev, i) => (
                  <div key={i} className={\`vtc-event \${ev.done ? 'done' : ev.active ? 'active' : ''}\`}>
                    <div className="vtc-event-dot" />
                    <div className="vtc-event-text">{ev.text}</div>
                    {(ev.done || ev.active) && <div className="vtc-event-time">{ev.time}</div>}
                  </div>
                ))}
              </div>

              <div className="vtc-id">
                <span>GGR-4829-KXMT</span>
                <span className="vtc-id-note">Managed by Gagara</span>
              </div>

`;

c = c.slice(0, jsxStartIdx) + newJSX + c.slice(jsxEndIdx);
console.log('JSX replaced: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nTransaction card patch complete.');
