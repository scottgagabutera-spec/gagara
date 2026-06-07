const fs = require('fs');
const path = require('path');

function patch(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [label, from, to] of replacements) {
    if (!content.includes(from)) {
      console.log(`  SKIP (not found): ${label}`);
      continue;
    }
    content = content.replace(from, to);
    console.log(`  ${label}: OK`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// ── DEAL PAGE ─────────────────────────────────────────────────────────────────
const dealPath = path.join(__dirname, 'src/app/deal/[id]/page.tsx');

patch(dealPath, [
  [
    'error — deal not found',
    "setError('Deal not found or you do not have access.');",
    "setError('Agreement not found or you do not have access.');",
  ],
  [
    'error — not a party',
    "setError('You are not a party to this deal.');",
    "setError('You are not a party to this agreement.');",
  ],
  [
    'error — deal not found fallback',
    "<p>{error || 'Deal not found.'}</p>",
    "<p>{error || 'Agreement not found.'}</p>",
  ],
  [
    'audit log — deal created',
    "event: 'Deal created'",
    "event: 'Agreement created'",
  ],
  [
    'complete banner — deal complete',
    '<strong>Deal complete.</strong> All conditions confirmed by both parties. All funds have been released. Download the full audit PDF from the panel.',
    '<strong>Agreement complete.</strong> All conditions confirmed by both parties. All funds have been released. Download the full audit PDF from the panel.',
  ],
  [
    'balance strip label — in vault',
    '<div className="balance-label">In vault</div>',
    '<div className="balance-label">Secured</div>',
  ],
  [
    'deal info sidebar label',
    "'Deal info'",
    "'Agreement info'",
  ],
]);

console.log('deal page patch complete.\n');

// ── CONNECT PAGE ──────────────────────────────────────────────────────────────
const connectPath = path.join(__dirname, 'src/app/connect/page.tsx');

patch(connectPath, [
  [
    'entry eyebrow',
    'Enter Deal Code</div>',
    'Enter agreement code</div>',
  ],
  [
    'entry page title',
    'You received a deal.<br/>Review it here.',
    'Someone shared an agreement with you.<br/>Review it here.',
  ],
  [
    'entry page desc',
    'The other party shared a Deal Code with you. Enter it below to see the full terms before you agree to anything.',
    'The other party shared an agreement code with you. Enter it below to see the full terms before you agree to anything.',
  ],
  [
    'entry error — deal code dash',
    "setError('Enter the full Deal Code \u2014 it looks like GGR-XXXX-XXXX');",
    "setError('Enter the full agreement code. It looks like GGR-XXXX-XXXX');",
  ],
  [
    'entry note — deal language',
    'No account needed to review a deal.<br/>You only need to sign in if you choose to accept.',
    'No account needed to review an agreement.<br/>You only need to sign in if you choose to accept.',
  ],
  [
    'loading text — looking up deal',
    '<div className="loading-text">Looking up deal</div>',
    '<div className="loading-text">Looking up agreement</div>',
  ],
  [
    'loading text — connecting',
    '<div className="loading-text">Connecting you to this deal</div>',
    '<div className="loading-text">Connecting you to this agreement</div>',
  ],
  [
    'not found state title',
    '<div className="state-title">Deal not found</div>',
    '<div className="state-title">Agreement not found</div>',
  ],
  [
    'not found state desc',
    '<div className="state-desc">This code does not match any active deal. It may have been typed incorrectly.</div>',
    '<div className="state-desc">This code does not match any active agreement. It may have been typed incorrectly.</div>',
  ],
  [
    'expired state title',
    '<div className="state-title">Deal code expired</div>',
    '<div className="state-title">Agreement code expired</div>',
  ],
  [
    'expired state desc',
    '<div className="state-desc">This Deal Code is no longer valid. Ask the other party to create a new deal and share the updated code.</div>',
    '<div className="state-desc">This agreement code is no longer valid. Ask the other party to create a new agreement and share the updated code.</div>',
  ],
  [
    'already connected state title',
    '<div className="state-title">Deal already connected</div>',
    '<div className="state-title">Agreement already connected</div>',
  ],
  [
    'already connected state desc',
    '<div className="state-desc">Both parties are already linked to this deal. Check your dashboard for its status.</div>',
    '<div className="state-desc">Both parties are already linked to this agreement. Check your dashboard for its status.</div>',
  ],
  [
    'review eyebrow',
    'Review deal terms</div>',
    'Review agreement terms</div>',
  ],
  [
    'review page desc',
    'These are the exact terms set by the other party. Once you accept, both of you are committed.',
    'These are the exact terms set by the other party. Once you accept, both of you are committed to them.',
  ],
  [
    'conditions section label — dash',
    'Release conditions \u2014 both must confirm every one',
    'Release conditions. Both must confirm every one.',
  ],
  [
    'vault notice — vault language',
    '<strong>Funds are held in the Gagara vault.</strong> Neither party can touch the money alone. It releases only when both confirm all conditions are met.',
    '<strong>Your money is protected by both parties.</strong> Neither side can touch the funds alone. The money only moves when both of you confirm every condition is met.',
  ],
  [
    'auth nudge — sign in to accept',
    '<strong>You need to sign in to accept.</strong> Tapping Accept will take you to sign in and bring you straight back to this deal.',
    '<strong>You need to sign in to accept.</strong> Tapping Accept will take you to sign in and bring you straight back to this agreement.',
  ],
  [
    'accept button — deal language',
    "userId ? 'Accept this deal' : 'Sign in to accept'",
    "userId ? 'Accept this agreement' : 'Sign in to accept'",
  ],
  [
    'action note — deal language',
    'By accepting, you confirm you have read and agreed to all conditions above. The other party will be notified immediately.',
    'By accepting, you confirm you have read and agreed to all conditions above. The other party will be notified right away.',
  ],
  [
    'accepted result desc — vault language',
    'Both parties are now linked. Once funds are deposited into the vault, the deal becomes active and you will both see the balance.',
    'Both parties are now linked. Once funds are secured, the agreement becomes active and you will both see the balance.',
  ],
  [
    'declined result desc — deal language',
    'You have declined this deal. The other party has been notified. No funds were moved and nothing was committed.',
    'You have declined this agreement. The other party has been notified. No funds were moved and nothing was committed.',
  ],
  [
    'notification text — accepted deal',
    '`Someone accepted your deal ${deal.code} \u2014 both parties are now connected`',
    '`Someone accepted your agreement ${deal.code}. Both parties are now connected.`',
  ],
]);

console.log('connect page patch complete.');
