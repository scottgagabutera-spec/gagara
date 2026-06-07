const fs   = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  created: ${filePath}`);
}

// ─── Shared shell ─────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black:#07070A; --surface:#0D0D12; --surface2:#111118;
    --indigo:#5B4FE8; --indigo-l:#7B70F0; --indigo-dim:rgba(91,79,232,0.1);
    --gold:#C9A84C;
    --green:#5DCC8A;
    --text-primary:#F5F5F7; --text-body:rgba(245,245,247,0.72); --text-secondary:rgba(245,245,247,0.50);
    --text-faint:rgba(245,245,247,0.20);
    --border:rgba(245,245,247,0.06); --border-md:rgba(245,245,247,0.10);
    --r-md:12px; --r-lg:16px; --r-2xl:24px;
  }
  html, body { height: 100%; }
  body { background: var(--black); color: var(--text-primary); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1; -webkit-font-smoothing: antialiased; }
  ::selection { background: rgba(91,79,232,0.25); color: #fff; }
  .topbar { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 0.5px solid var(--border); background: rgba(7,7,10,0.9); backdrop-filter: blur(24px); position: sticky; top: 0; z-index: 100; }
  .topbar-logo { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: var(--text-primary); text-decoration: none; letter-spacing: -0.3px; }
  .topbar-back { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
  .topbar-back:hover { color: var(--text-primary); }
  .page-wrap { max-width: 680px; margin: 0 auto; padding: 64px 32px 120px; }
  .page-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--indigo-l); display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .eyebrow-line { width: 20px; height: 1px; background: var(--indigo-l); }
  .page-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--text-primary); letter-spacing: -1px; line-height: 1.05; margin-bottom: 12px; }
  .page-updated { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-faint); letter-spacing: 0.06em; margin-bottom: 48px; }
  .section { margin-bottom: 48px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.3px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 0.5px solid var(--border-md); }
  .body-text { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-body); line-height: 1.8; margin-bottom: 14px; }
  .body-text:last-child { margin-bottom: 0; }
  .highlight-box { padding: 16px 20px; background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-lg); margin-bottom: 14px; }
  .highlight-box .body-text { margin-bottom: 0; }
  .contact-row { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-lg); margin-bottom: 10px; }
  .contact-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-faint); letter-spacing: 0.1em; width: 72px; flex-shrink: 0; }
  .contact-val { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-primary); }
  .contact-val a { color: var(--indigo-l); text-decoration: none; }
  .contact-val a:hover { text-decoration: underline; }
  @media (max-width: 640px) { .topbar { padding: 0 20px; } .page-wrap { padding: 40px 20px 80px; } .page-title { font-size: 28px; } }
`;

const LOGO_SVG = `
  <svg width="20" height="20" viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <circle cx="7" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
    <circle cx="23" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
    <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
    <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
    <circle cx="7" cy="15" r="2" fill="#7B70F0"/>
    <circle cx="23" cy="15" r="2" fill="#7B70F0"/>
  </svg>
`;

const topbar = `
  <header className="topbar">
    <a href="/" className="topbar-logo">${LOGO_SVG}Gagara</a>
    <a href="/" className="topbar-back">Back to home</a>
  </header>
`;

// ─── PRIVACY ──────────────────────────────────────────────────────────────────
const privacy = `'use client';
export default function Privacy() {
  return (
    <>
      <style>{\`${STYLE}\`}</style>
      ${topbar}
      <div className="page-wrap">
        <div className="page-eyebrow"><span className="eyebrow-line"/>Privacy</div>
        <h1 className="page-title">Your data belongs to you.</h1>
        <div className="page-updated">Last updated: June 2025</div>

        <div className="section">
          <div className="section-title">What we collect</div>
          <p className="body-text">When you create an account we collect your name, email address, and account type. If you verify your identity, we also collect government ID details as required by financial regulations.</p>
          <p className="body-text">When you create or participate in an agreement we store the agreement terms, the conditions both parties set, the audit log of every confirmation, and the transaction amounts and currency.</p>
          <p className="body-text">We also collect standard usage data — browser type, device type, and IP address — to keep the platform secure and functioning.</p>
        </div>

        <div className="section">
          <div className="section-title">Why we collect it</div>
          <p className="body-text">Your account information lets you sign in and be identified by the other party in an agreement. Your identity verification details are required by law before any funds can be held. Agreement data is the permanent record that protects both parties.</p>
          <p className="body-text">We do not collect data for advertising. We do not build profiles for third parties. Every piece of data we hold exists to make the agreement work or to keep your account secure.</p>
        </div>

        <div className="section">
          <div className="section-title">Who can see your data</div>
          <div className="highlight-box">
            <p className="body-text">The other party in an agreement sees your handle or name and your verification status. They do not see your email address, ID documents, or any account details beyond what is necessary to identify you in that agreement.</p>
          </div>
          <p className="body-text">We share data with our payment processor and identity verification partner only as required to process transactions and verify identities. We do not sell your data to anyone.</p>
          <p className="body-text">If compelled by law we may share data with authorities. We will tell you if we can.</p>
        </div>

        <div className="section">
          <div className="section-title">How long we keep it</div>
          <p className="body-text">Agreement records are kept permanently. This is because the audit trail may be needed as legal evidence long after an agreement closes. Account data is kept for as long as your account is active and for a minimum of seven years after closing for legal and regulatory compliance.</p>
        </div>

        <div className="section">
          <div className="section-title">Your rights</div>
          <p className="body-text">You can ask us to export your data, correct inaccurate data, or close your account at any time. Where we are legally required to retain records we will tell you what we can and cannot delete.</p>
          <p className="body-text">To exercise any of these rights, contact us at the address below.</p>
          <div className="contact-row">
            <span className="contact-label">Email</span>
            <span className="contact-val"><a href="mailto:privacy@gagara.io">privacy@gagara.io</a></span>
          </div>
        </div>
      </div>
    </>
  );
}
`;

// ─── TERMS ────────────────────────────────────────────────────────────────────
const terms = `'use client';
export default function Terms() {
  return (
    <>
      <style>{\`${STYLE}\`}</style>
      ${topbar}
      <div className="page-wrap">
        <div className="page-eyebrow"><span className="eyebrow-line"/>Terms of use</div>
        <h1 className="page-title">Plain language.<br/>Real commitments.</h1>
        <div className="page-updated">Last updated: June 2025</div>

        <div className="section">
          <div className="section-title">What Gagara is</div>
          <p className="body-text">Gagara is an escrow platform. When two parties enter an agreement, the payer deposits funds that are held securely until both parties confirm the agreed conditions are met. Gagara does not take sides, does not decide who is right, and does not release funds without mutual confirmation.</p>
          <p className="body-text">Gagara is not a bank, a payment processor, or a legal service. We are a platform that facilitates secure, mutual agreements between two parties.</p>
        </div>

        <div className="section">
          <div className="section-title">Your responsibilities</div>
          <p className="body-text">You must be at least 18 years old to use Gagara. By creating an account you confirm that you are acting on your own behalf or are authorised to act on behalf of the business you represent.</p>
          <p className="body-text">You are responsible for the agreements you create. The terms, conditions, and amounts you set are your own. Gagara holds the funds and records the confirmations but does not verify whether the underlying work or goods were actually delivered.</p>
          <p className="body-text">You agree not to use Gagara for any unlawful purpose, to launder money, to defraud the other party, or to circumvent any financial regulation that applies in your jurisdiction.</p>
        </div>

        <div className="section">
          <div className="section-title">How funds work</div>
          <div className="highlight-box">
            <p className="body-text">Once funds are deposited into a Gagara agreement, neither party can withdraw them unilaterally. Funds are only released when both parties confirm all agreed conditions are met, or when a dispute is resolved. This is the core protection Gagara provides to both sides.</p>
          </div>
          <p className="body-text">Gagara charges a platform fee on completed transactions. The fee is shown to both parties before an agreement is accepted. Fees are non-refundable once a transaction is processed.</p>
        </div>

        <div className="section">
          <div className="section-title">Disputes</div>
          <p className="body-text">If you raise a dispute, funds are frozen immediately. Gagara generates a timestamped PDF of the full agreement record — all conditions, every confirmation, and the complete audit log. This document is available to both parties and is suitable for use in legal proceedings.</p>
          <p className="body-text">Gagara does not mediate disputes directly. We provide the documentation. Resolution is between the parties or through the legal process applicable in their jurisdiction.</p>
        </div>

        <div className="section">
          <div className="section-title">Limitation of liability</div>
          <p className="body-text">Gagara is provided as-is. We work hard to keep the platform secure and available but cannot guarantee uninterrupted service. We are not liable for losses arising from the actions of the other party in an agreement, from downtime, or from circumstances outside our control.</p>
          <p className="body-text">Our total liability to you for any claim arising from your use of Gagara is limited to the fees you paid to Gagara in the six months before the claim.</p>
        </div>

        <div className="section">
          <div className="section-title">Changes to these terms</div>
          <p className="body-text">We may update these terms from time to time. When we do, we will update the date above and notify active users by email. Continued use of Gagara after changes are notified constitutes acceptance of the updated terms.</p>
          <div className="contact-row">
            <span className="contact-label">Questions</span>
            <span className="contact-val"><a href="mailto:legal@gagara.io">legal@gagara.io</a></span>
          </div>
        </div>
      </div>
    </>
  );
}
`;

// ─── SAFETY ───────────────────────────────────────────────────────────────────
const safety = `'use client';
export default function Safety() {
  return (
    <>
      <style>{\`${STYLE}\`}</style>
      ${topbar}
      <div className="page-wrap">
        <div className="page-eyebrow"><span className="eyebrow-line"/>Safety</div>
        <h1 className="page-title">Problems happen.<br/>Here is what to do.</h1>
        <div className="page-updated">Last updated: June 2025</div>

        <div className="section">
          <div className="section-title">If something feels wrong</div>
          <p className="body-text">If the other party is not responding, is pressuring you to confirm conditions that have not been met, or if anything about the agreement feels wrong — do not confirm anything. Your confirmation is required for funds to move. Withholding it keeps you protected while you investigate.</p>
          <p className="body-text">If you believe the other party has acted in bad faith or broken the agreement terms, raise a dispute from the agreement page. Funds will be frozen immediately and a full record of the agreement will be generated for both parties.</p>
        </div>

        <div className="section">
          <div className="section-title">What happens when you raise a dispute</div>
          <div className="highlight-box">
            <p className="body-text">When a dispute is raised, funds are frozen. Neither party can release or withdraw the money. Gagara automatically generates a complete, timestamped PDF of the agreement record — all agreed conditions, every confirmation event, and the full audit log.</p>
          </div>
          <p className="body-text">Both parties receive a copy of this document. It is court-ready and can be used in legal proceedings or shared with a mediator.</p>
          <p className="body-text">Gagara does not decide who is right. We hold the funds and provide the evidence. Resolution is between you, the other party, and any legal process you choose to use.</p>
        </div>

        <div className="section">
          <div className="section-title">If you suspect fraud</div>
          <p className="body-text">If you believe someone is using Gagara to commit fraud, report it to us immediately. We will freeze the relevant agreement and investigate. If we confirm fraudulent activity, we will cooperate with authorities and take action on the account involved.</p>
          <p className="body-text">Do not complete any confirmation you are not certain about. Once both parties confirm a condition, that confirmation is permanent and part of the audit record.</p>
        </div>

        <div className="section">
          <div className="section-title">Contact us</div>
          <p className="body-text">For urgent safety concerns, disputes, or to report suspected fraud, reach us here.</p>
          <div className="contact-row">
            <span className="contact-label">Safety</span>
            <span className="contact-val"><a href="mailto:safety@gagara.io">safety@gagara.io</a></span>
          </div>
          <div className="contact-row">
            <span className="contact-label">Disputes</span>
            <span className="contact-val"><a href="mailto:disputes@gagara.io">disputes@gagara.io</a></span>
          </div>
          <div className="contact-row">
            <span className="contact-label">General</span>
            <span className="contact-val"><a href="mailto:hello@gagara.io">hello@gagara.io</a></span>
          </div>
        </div>
      </div>
    </>
  );
}
`;

writeFile(path.join(__dirname, 'src/app/privacy/page.tsx'), privacy);
writeFile(path.join(__dirname, 'src/app/terms/page.tsx'), terms);
writeFile(path.join(__dirname, 'src/app/safety/page.tsx'), safety);

console.log('\nAll three footer pages created.');
