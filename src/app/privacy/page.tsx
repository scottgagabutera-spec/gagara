'use client';
export default function Privacy() {
  return (
    <>
      <style>{`
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
`}</style>
      
  <header className="topbar">
    <a href="/" className="topbar-logo">
  <svg width="20" height="20" viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <circle cx="7" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
    <circle cx="23" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
    <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
    <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
    <circle cx="7" cy="15" r="2" fill="#7B70F0"/>
    <circle cx="23" cy="15" r="2" fill="#7B70F0"/>
  </svg>
Gagara</a>
    <a href="/" className="topbar-back">Back to home</a>
  </header>

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
