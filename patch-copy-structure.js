const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ── STEP 1: Rewrite "Who it helps" section ──
const oldHelpsH = '          <h2 className="sec-h2">For anyone who has ever wondered <em>what if this goes wrong.</em></h2>\n          <p className="sec-desc">You do not need a bad experience to want certainty before you start. Gagara is for anyone taking on work or paying for something where the stakes matter.</p>';
if (!c.includes(oldHelpsH)) { console.log('ERROR: helps heading not found'); process.exit(1); }
c = c.replace(oldHelpsH, '          <h2 className="sec-h2">Anyone who has ever hesitated <em>before saying yes.</em></h2>\n          <p className="sec-desc">The hesitation is not distrust. It is the uncertainty of what happens if the other side does not follow through. Gagara removes that uncertainty before anyone starts.</p>');
console.log('helps heading: OK');

// ── STEP 2: Rewrite story bodies ──
c = c.replace(
  "body: 'You delivered everything you agreed on. Now you cannot get paid. With Gagara, the money was already in the vault before you started. You would not have needed to chase anyone.'",
  "body: 'The work was done. The agreed amount sat in Gagara the whole time, locked until both sides confirmed. No chasing. No excuses. The moment you confirmed, it was yours.'"
);
c = c.replace(
  "situation: <>You delivered everything.<br /><em>Then the silence started.</em></>",
  "situation: <>You finished the job.<br /><em>Then the silence started.</em></>"
);
c = c.replace(
  "outcome: 'When you finish the work, the payment is already waiting for you.'",
  "outcome: 'The money was already there before you started.'"
);
console.log('story 01: OK');

c = c.replace(
  "body: 'You transferred the money upfront and trusted them to deliver. They did not. With Gagara, you stay in control. The money does not leave until you confirm you got what you paid for.'",
  "body: 'With Gagara, you never send money directly to the other person. It goes into a secured hold that neither of you can touch alone. You get it back if the work does not happen. They get it only when it does.'"
);
c = c.replace(
  "situation: <>You paid for the job.<br /><em>The work never came.</em></>",
  "situation: <>You sent the money.<br /><em>Nothing arrived.</em></>"
);
c = c.replace(
  "outcome: 'The money does not move until you confirm you got what you paid for.'",
  "outcome: 'Neither side can act alone. That is the protection.'"
);
console.log('story 02: OK');

c = c.replace(
  "body: 'You spent time, materials, and energy preparing for a big job. Then the client changed their mind. With Gagara, both sides commit before anyone starts. If you do what was agreed, the payment is there. That is the whole point.'",
  "body: 'Before anyone lifts a finger, both sides confirm the terms and the amount is locked in. If the other side walks away after committing, the record is there. Nothing disappears.'"
);
c = c.replace(
  "situation: <>You invested weeks of work.<br /><em>They changed their mind.</em></>",
  "situation: <>You prepared for weeks.<br /><em>They pulled out.</em></>"
);
c = c.replace(
  "outcome: 'You start with confidence, not just hope.'",
  "outcome: 'Commitment is shown before work begins, not promised after.'"
);
console.log('story 03: OK');

// ── STEP 3: Rewrite "How it works" desc ──
c = c.replace(
  '          <p className="sec-desc">Every agreement on Gagara works the same way. You both agreed to the same thing before anyone started. Both of you can see every step as it happens. Nothing is hidden.</p>',
  '          <p className="sec-desc">Both sides see the same thing from the start. The amount is locked before work begins. It stays locked until both of you confirm it is done. No one can move it alone.</p>'
);
console.log('how it works desc: OK');

// ── STEP 4: Rewrite step titles and descriptions ──
c = c.replace(
  "title:'Agree on the terms',       desc:'One person writes up the agreement — the amount, what is expected, and by when. They share a simple code with the other person so both are looking at the same thing.'",
  "title:'Set the terms',             desc:'One person writes up the agreement. The amount, what is expected, and by when. They share a short code with the other person so both are looking at exactly the same thing.'"
);
c = c.replace(
  "title:'Payment goes into the agreement', desc:'The person paying puts the money in through Gagara. It is reserved and cannot be taken back. The person doing the work can see it is there before they lift a finger.'",
  "title:'Money is locked in',         desc:'The person paying puts the amount into Gagara. It is secured and cannot be taken back by either side. The person doing the work can see it sitting there before they begin.'"
);
c = c.replace(
  "title:'Work gets done',             desc:'The job is carried out. Both sides can see progress. If there are milestones, each one is tracked and confirmed separately.'",
  "title:'Work happens',               desc:'The job is carried out. Both sides can follow progress. If there are stages, each one is confirmed separately before moving to the next.'"
);
c = c.replace(
  "title:'Both sides say yes',         desc:'When the work is done, both of you confirm it. One person saying yes is not enough. Both must agree before the money moves.'",
  "title:'Both sides confirm',         desc:'When the work is done, both of you say so. One side confirming is not enough. The secured amount only moves when both agree it is done.'"
);
c = c.replace(
  "title:'Payment is sent',            desc:'Once both confirm, the money goes straight to the receiver. The full record of the deal stays on file permanently.'",
  "title:'Money is released',          desc:'The moment both sides confirm, the secured amount goes straight to the receiver. The full record of the agreement stays on file permanently.'"
);
console.log('steps rewritten: OK');

// ── STEP 5: Rewrite Modes heading ──
c = c.replace(
  '          <h2 className="sec-h2">A small favour or a big project. <em>Gagara fits both.</em></h2>\n          <p className="sec-desc">Each time you create an agreement, you pick how much protection you need based on the size and importance of the work. Your account stays the same either way.</p>',
  '          <h2 className="sec-h2">From a small favour <em>to a major contract.</em></h2>\n          <p className="sec-desc">Every agreement lets you choose how much structure you need. The same protection applies either way. The amount locked in Gagara cannot move until both sides are satisfied.</p>'
);
console.log('modes heading: OK');

c = c.replace(
  "desc:'Paying someone to fix something, sending money for a service, or any small agreement between two people. Simple and quick to set up.'",
  "desc:'A quick agreement between two people. Someone pays, someone delivers. The amount is locked until the job is confirmed done by both sides.'"
);
c = c.replace(
  "desc:'Service agreements, supplier payments, or project work paid in stages as it gets done. Built for situations where the details and the timeline both matter.'",
  "desc:'Work paid in stages as it is delivered. Each stage is confirmed separately. Neither side can skip ahead or hold the other back.'"
);
c = c.replace(
  "desc:'Large agreements involving multiple people, big amounts, and formal conditions that everyone needs to sign off on. Built for when getting it wrong is not an option.'",
  "desc:'Large agreements with formal conditions. Multiple parties. Big amounts. Every condition must be met and confirmed before anything is released.'"
);
console.log('mode descriptions: OK');

// ── STEP 6: Rewrite Payouts heading ──
c = c.replace(
  '          <h2 className="sec-h2">You get paid <em>the moment it is confirmed done.</em></h2>\n          <p className="sec-desc">Once both of you confirm the work is done, payment goes out straight away. The person receiving the money chooses how they want to be paid before the agreement even begins.</p>',
  '          <h2 className="sec-h2">The moment both sides confirm, <em>the money moves.</em></h2>\n          <p className="sec-desc">The receiver chooses how they want it before the agreement even starts. The moment both sides say it is done, it goes. No manual steps. No waiting for someone to remember.</p>'
);
console.log('payouts heading: OK');

// ── STEP 7: Rewrite closing ──
c = c.replace(
  '              <div className="cb-tag">Certainty before you start. Every time.</div>\n              <h2 className="cb-h">Start every agreement knowing<br /><em>exactly how it ends.</em></h2>\n              <p className="cb-p">The moment you are not sure whether to say yes — whether to take the job, sign the contract, or trust someone with your money — that is exactly when Gagara helps. Both sides put their commitment down before anyone starts. When the work is done, everyone gets what was agreed.</p>',
  '              <div className="cb-tag">Both sides protected. Every time.</div>\n              <h2 className="cb-h">Say yes with confidence,<br /><em>not just hope.</em></h2>\n              <p className="cb-p">The hesitation before you start is real. Gagara is built for that moment. Both sides lock in their commitment before anyone begins. The amount is secured and stays that way until both sides confirm the job is done. Not the person who put it in. Not the person waiting to receive it. Neither can touch it before then.</p>'
);
console.log('closing: OK');

c = c.replace(
  "['Both sides protected','Everyone sees the same thing','No one acts alone','Conditions agreed before you start','Full history saved','Help if something goes wrong','Works across borders','Any currency']",
  "['Neither side can act alone','Locked until both confirm','Full record kept permanently','Works across borders','Any size of agreement','Any currency','Help if something goes wrong','Free to create']"
);
console.log('closing tags: OK');

// ── STEP 8: Add mobile accordion CSS for stories and modes ──
const mobileAnchor = '          .step.open .step-desc { display: block; }';
if (!c.includes(mobileAnchor)) { console.log('ERROR: mobile accordion anchor not found'); process.exit(1); }
c = c.replace(mobileAnchor, `          .step.open .step-desc { display: block; }
          .stories-grid { background: none; border: 0.5px solid var(--border); border-radius: var(--r-2xl); overflow: hidden; padding: 0 16px; }
          .story-card { border-radius: 0; border-bottom: 0.5px solid var(--border); padding: 16px 0; background: none; cursor: pointer; }
          .story-card:last-child { border-bottom: none; }
          .story-situation-row { display: flex; align-items: flex-start; gap: 10px; }
          .story-num { flex-shrink: 0; }
          .story-chevron { color: var(--text-faint); transition: transform 0.2s; flex-shrink: 0; margin-top: 2px; }
          .story-card.open .story-chevron { transform: rotate(180deg); }
          .story-body { display: none; font-size: 12px; line-height: 1.6; padding-top: 10px; color: var(--text-secondary); }
          .story-card.open .story-body { display: block; }
          .story-outcome { display: none; padding-top: 8px; }
          .story-card.open .story-outcome { display: flex; }
          .modes-grid { background: none; border: 0.5px solid var(--border); border-radius: var(--r-2xl); overflow: hidden; padding: 0 16px; }
          .mode-card { border-radius: 0; border-bottom: 0.5px solid var(--border); padding: 16px 0; background: none; cursor: pointer; }
          .mode-card:last-child { border-bottom: none; }
          .mc-header-row { display: flex; align-items: center; gap: 12px; }
          .mode-chevron { color: var(--text-faint); transition: transform 0.2s; flex-shrink: 0; }
          .mode-card.open .mode-chevron { transform: rotate(180deg); }
          .mc-desc { display: none; font-size: 12px; line-height: 1.6; padding-top: 8px; color: var(--text-secondary); }
          .mode-card.open .mc-desc { display: block; }
          .mc-range { display: none; padding-top: 6px; }
          .mode-card.open .mc-range { display: block; }
          .mc-list { display: none; padding-top: 6px; }
          .mode-card.open .mc-list { display: block; }`);
console.log('mobile accordion CSS: OK');

// ── STEP 9: Add onClick + chevron to story cards ──
const oldStoryCard = '              <div key={i} className="story-card">\n                <div className="story-num">{s.n}</div>\n                <div className="story-situation">{s.situation}</div>\n                <div className="story-body">{s.body}</div>';
if (!c.includes(oldStoryCard)) { console.log('ERROR: story card not found'); process.exit(1); }
c = c.replace(oldStoryCard,
  '              <div key={i} className="story-card" onClick={e => e.currentTarget.classList.toggle(\'open\')}>\n                <div className="story-situation-row">\n                  <div className="story-num">{s.n}</div>\n                  <div className="story-situation" style={{flex:1}}>{s.situation}</div>\n                  <svg className="story-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>\n                </div>\n                <div className="story-body">{s.body}</div>'
);
console.log('story accordion JSX: OK');

// ── STEP 10: Add onClick + chevron to mode cards (using string concat to avoid backtick conflict) ──
const oldModeOpen = '              <div key={i} className={`mode-card ${m.gold ? \'gold-card\' : \'\'}`}>\n                <div className="mc-n">{m.n}</div>\n                <div className="mc-icon" aria-hidden="true">{m.icon}</div>\n                <div className="mc-title">{m.title}</div>';
if (!c.includes(oldModeOpen)) { console.log('ERROR: mode card not found'); process.exit(1); }
c = c.replace(oldModeOpen,
  '              <div key={i} className={`mode-card ${m.gold ? \'gold-card\' : \'\'}`} onClick={e => e.currentTarget.classList.toggle(\'open\')}>\n                <div className="mc-header-row">\n                  <div className="mc-icon" aria-hidden="true">{m.icon}</div>\n                  <div className="mc-title" style={{flex:1}}>{m.title}</div>\n                  <svg className="mode-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>\n                </div>'
);
console.log('mode accordion JSX: OK');

// ── STEP 11: Swap section order (helps before how) ──
const divider = '      <div className="divider" aria-hidden="true" />';
const howComment = '      {/* \u2500\u2500 HOW IT WORKS \u2500\u2500 */}';
const helpsComment = '      {/* \u2500\u2500 WHO IT HELPS \u2500\u2500 */}';
const modesComment = '      {/* \u2500\u2500 MODES \u2500\u2500 */}';

const howStart = c.indexOf(divider + '\n\n' + howComment);
const helpsStart = c.indexOf(divider + '\n\n' + helpsComment);
const modesStart = c.indexOf(divider + '\n\n' + modesComment);

if (howStart === -1 || helpsStart === -1 || modesStart === -1) {
  console.log('section swap: anchors not found, skipping swap');
  console.log('  howStart:', howStart, 'helpsStart:', helpsStart, 'modesStart:', modesStart);
} else if (helpsStart < howStart) {
  console.log('section order already correct (helps before how): OK');
} else {
  const howBlock = c.slice(howStart, helpsStart);
  const helpsBlock = c.slice(helpsStart, modesStart);
  c = c.slice(0, howStart) + helpsBlock + howBlock + c.slice(modesStart);
  if (c.indexOf('id="helps"') < c.indexOf('id="how"')) {
    console.log('section order swapped: OK');
  } else {
    console.log('WARNING: swap attempted but verify manually');
  }
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nFull patch complete.');
