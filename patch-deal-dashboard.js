const fs = require('fs');
const path = require('path');

function patch(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let allOk = true;
  for (const [label, from, to] of replacements) {
    if (!content.includes(from)) {
      console.log(`  SKIP (not found): ${label}`);
      allOk = false;
      continue;
    }
    content = content.replace(from, to);
    console.log(`  ${label}: OK`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return allOk;
}

// ── NEW-DEAL PAGE ─────────────────────────────────────────────────────────────
const newDealPath = path.join(__dirname, 'src/app/new-deal/page.tsx');

patch(newDealPath, [
  [
    'topbar title — new deal',
    '<div className="topbar-title">New deal — Step {step+1} of {STEPS.length}</div>',
    '<div className="topbar-title">New agreement — Step {step+1} of {STEPS.length}</div>',
  ],
  [
    'payer description — vault language',
    'You lock funds into the vault. The receiver sees them. Funds release when both confirm.',
    'You secure the funds through Gagara. The receiver sees they are there. The money only moves when both of you confirm the job is done.',
  ],
  [
    'receiver description — vault language',
    'You share the deal terms. The payer locks funds. You see the money in the vault before work starts.',
    'You share the agreement terms. The payer secures the funds. You can see the money is held before you start anything.',
  ],
  [
    'personal mode description — dash style',
    'Freelancers, small jobs, money between friends.',
    'For freelancers, small jobs and agreements between individuals.',
  ],
  [
    'business mode description — dash style',
    'Service contracts, supplier deals, project milestones.',
    'For service contracts, supplier agreements and project work.',
  ],
  [
    'enterprise mode description — dash style',
    'Large contracts, multiple parties. Built for precision.',
    'For large contracts and multi-party agreements requiring precision.',
  ],
  [
    'conditions label — dash',
    'Release conditions <span style={{marginLeft:\'8px\',fontFamily:\'DM Sans\',fontSize:\'10px\',color:\'var(--text-faint)\',textTransform:\'none\',letterSpacing:\'normal\'}}>— both must confirm each one</span>',
    'Release conditions <span style={{marginLeft:\'8px\',fontFamily:\'DM Sans\',fontSize:\'10px\',color:\'var(--text-faint)\',textTransform:\'none\',letterSpacing:\'normal\'}}>both must confirm each one</span>',
  ],
  [
    'step 4 desc — deal language',
    'The other party will see exactly this when they enter the Deal Code.',
    'The other party will see exactly this when they enter the agreement code.',
  ],
  [
    'step 5 desc — deal language',
    'Share this code with the other party. They enter it at gagara.vercel.app/connect to review and accept.',
    'Share this code with the other party. They enter it at gagara.vercel.app/connect to review and accept the terms.',
  ],
  [
    'step 5 title — deal code',
    'Your Deal Code is ready',
    'Your agreement code is ready',
  ],
]);

console.log('new-deal patch complete.\n');

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────────
const dashPath = path.join(__dirname, 'src/app/dashboard/page.tsx');

patch(dashPath, [
  [
    'loading text — vault language',
    "Loading your vault\u2026",
    "Loading your dashboard\u2026",
  ],
  [
    'topbar new deal button',
    'New deal\n              </a>',
    'New agreement\n              </a>',
  ],
  [
    'deals section title',
    '<div className="deals-title">Active deals</div>',
    '<div className="deals-title">Active agreements</div>',
  ],
  [
    'sidebar my deals nav item',
    'My Deals',
    'My Agreements',
  ],
  [
    'empty state title',
    '<div className="empty-title">No deals here</div>',
    '<div className="empty-title">No agreements here</div>',
  ],
  [
    'empty state desc — all filter',
    "'Create your first deal or enter a Deal Code to get started.'",
    "'Create your first agreement or enter a code to get started.'",
  ],
  [
    'empty state desc — other filters',
    '`No ${filter} deals right now.`',
    '`No ${filter} agreements right now.`',
  ],
  [
    'empty state cta link text',
    '>Create your first deal</a>',
    '>Create your first agreement</a>',
  ],
  [
    'demo data — logo redesign dash',
    "description: 'Logo redesign — final files'",
    "description: 'Logo redesign, final files'",
  ],
  [
    'deal meta — incoming brackets',
    "'{deal.role === 'Receiver' ? '[Incoming]' : '[Outgoing]'} {deal.role}'",
    "'{deal.role === 'Receiver' ? 'Incoming' : 'Outgoing'}'",
  ],
  [
    'q-sub active deals count text',
    'Across {displayDeals.filter(d => d.role === \'Receiver\' && d.statusCode !== \'completed\').length} active deals</div>',
    'Across {displayDeals.filter(d => d.role === \'Receiver\' && d.statusCode !== \'completed\').length} active agreements</div>',
  ],
  [
    'q-sub locked by me count text',
    'Across {displayDeals.filter(d => d.role === \'Payer\' && d.statusCode === \'locked\').length} active deals</div>',
    'Across {displayDeals.filter(d => d.role === \'Payer\' && d.statusCode === \'locked\').length} active agreements</div>',
  ],
]);

console.log('dashboard patch complete.');
