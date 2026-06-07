'use client';
export default function Safety() {
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
