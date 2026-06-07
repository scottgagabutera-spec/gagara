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

// ── SIGN-IN PAGE ──────────────────────────────────────────────────────────────
const signInPath = path.join(__dirname, 'src/app/sign-in/page.tsx');

patch(signInPath, [
  [
    'panel subtitle',
    'Continue to your vault and active deals',
    'Continue to your dashboard and active agreements'
  ],
  [
    'kyc note — fund a vault',
    'You can explore Gagara and create deals freely. Identity verification is only required at the moment you fund a vault.',
    'You can explore Gagara and create agreements freely. Identity verification is only required when you secure your first agreement with funds.'
  ],
]);

console.log('sign-in patch complete.\n');

// ── GET-STARTED PAGE ──────────────────────────────────────────────────────────
const getStartedPath = path.join(__dirname, 'src/app/get-started/page.tsx');

patch(getStartedPath, [
  [
    'step 1 subtitle — too technical',
    'This is permanent and determines your identity verification requirements. Your deal mode is chosen separately each time.',
    'Choose how you will use Gagara. This stays the same across your account. You pick the agreement type each time you create one.'
  ],
  [
    'individual type description — dashes',
    'Freelancers, contractors, personal users, sole traders. Verified with government ID.',
    'For individuals. Freelancers, contractors, personal users and sole traders. Verified with a government ID when you are ready to secure funds.'
  ],
  [
    'business type description — dashes',
    'Registered companies, startups, agencies, NGOs, SMBs. Verified with company registration.',
    'For organisations. Companies, startups, agencies and NGOs. Verified with your company registration when you are ready to secure funds.'
  ],
  [
    'kyc note step 2 — fund a vault',
    'Identity verification is only required when you fund a vault for the first time. Explore freely until then.',
    'You can create and explore agreements without any verification. Identity verification is only required when you secure your first agreement with funds.'
  ],
  [
    'done state description',
    'Check your email to confirm your address, then go to your dashboard.',
    'Check your email to confirm your address. Once confirmed you can create your first agreement.'
  ],
]);

console.log('get-started patch complete.');
