'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Role      = 'payer' | 'receiver' | null;
type Mode      = 'personal' | 'business' | 'enterprise' | null;
type Release   = 'single' | 'milestones' | 'scheduled';

interface Milestone { id: string; description: string; percent: number; }
interface Condition  { id: string; text: string; }

interface DealState {
  role:        Role;
  mode:        Mode;
  amount:      string;
  currency:    string;
  description: string;
  timeline:    string;
  releaseType: Release;
  milestones:  Milestone[];
  conditions:  Condition[];
}

const INITIAL: DealState = {
  role: null, mode: null,
  amount: '', currency: 'USD',
  description: '', timeline: '',
  releaseType: 'single',
  milestones: [
    { id: 'm1', description: '', percent: 50 },
    { id: 'm2', description: '', percent: 50 },
  ],
  conditions: [{ id: 'c1', text: '' }],
};

const uid = () => Math.random().toString(36).slice(2, 8);

// Generate GGR-XXXX-XXXX code
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode = () => {
  const seg = (n: number) => Array.from({length:n}, () => CHARS[Math.floor(Math.random()*CHARS.length)]).join('');
  return `GGR-${seg(4)}-${seg(4)}`;
};

const STEPS = ['Role','Mode','Details','Conditions','Review','Share'];

export default function NewDeal() {
  const router = useRouter();
  const [step,    setStep]    = useState(0);
  const [deal,    setDeal]    = useState<DealState>(INITIAL);
  const [code,    setCode]    = useState('');
  const [copied,  setCopied]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [userId,  setUserId]  = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/sign-in'); return; }
      setUserId(session.user.id);
    };
    init();
  }, [router]);

  const update = (patch: Partial<DealState>) => setDeal(d => ({...d, ...patch}));

  const next = async () => {
    if (step === 4) {
      // Save deal to Supabase
      setSaving(true); setError('');
      try {
        const newCode = genCode();
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

        const { error: insertError } = await supabase.from('deals').insert({
          code:           newCode,
          mode:           deal.mode,
          status:         'pending',
          amount:         parseFloat(deal.amount),
          currency:       deal.currency,
          description:    deal.description,
          deadline:       deal.timeline || null,
          release_type:   deal.releaseType,
          payer_id:       deal.role === 'payer' ? userId : null,
          receiver_id:    deal.role === 'receiver' ? userId : null,
          conditions:     deal.conditions.filter(c => c.text.trim()).map(c => c.text),
          milestones:     deal.releaseType === 'milestones'
                            ? deal.milestones.map(m => ({ label: m.description, percent: m.percent }))
                            : [],
          code_expires_at: expiresAt,
        });

        if (insertError) throw insertError;
        setCode(newCode);
        setStep(s => s + 1);
      } catch (e: any) {
        setError(e.message || 'Failed to create deal. Please try again.');
      } finally {
        setSaving(false);
      }
      return;
    }
    setStep(s => Math.min(s + 1, 5));
  };

  const back = () => setStep(s => Math.max(s - 1, 0));

  const totalPercent = deal.milestones.reduce((s, m) => s + m.percent, 0);

  const canNext = () => {
    if (step === 0) return !!deal.role;
    if (step === 1) return !!deal.mode;
    if (step === 2) {
      if (!deal.amount || !deal.description) return false;
      const amt = parseFloat(deal.amount);
      if (deal.mode === 'personal'   && (amt < 1      || amt > 2000))  return false;
      if (deal.mode === 'business'   && (amt < 200    || amt > 50000)) return false;
      if (deal.mode === 'enterprise' && amt < 10000)                   return false;
      return true;
    }
    if (step === 3) {
      if (deal.releaseType === 'milestones') return totalPercent === 100 && deal.milestones.every(m => m.description.trim());
      return deal.conditions.every(c => c.text.trim());
    }
    if (step === 4) return true;
    return false;
  };

  const modeLimit = deal.mode === 'personal' ? '$1 – $2,000'
    : deal.mode === 'business' ? '$200 – $50,000' : '$10,000+';

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`You've been invited to a Gagara escrow deal.\n\nDeal Code: ${code}\n\nOpen Gagara to review and accept:\nhttps://gagara.vercel.app/connect`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:#07070A; --surface:#0D0D12; --surface2:#111118; --surface3:#16161F; --surface4:#1A1A28;
          --indigo:#5B4FE8; --indigo-l:#7B70F0; --indigo-dim:rgba(91,79,232,0.1);
          --gold:#C9A84C; --gold-dim:rgba(201,168,76,0.08);
          --green:#5DCC8A; --green-dim:rgba(93,204,138,0.08);
          --red:#E05252; --red-dim:rgba(224,82,82,0.08);
          --text-primary:#F5F5F7; --text-body:rgba(245,245,247,0.72); --text-secondary:rgba(245,245,247,0.50);
          --text-label:rgba(245,245,247,0.38); --text-faint:rgba(245,245,247,0.20);
          --border:rgba(245,245,247,0.06); --border-md:rgba(245,245,247,0.10); --border-hi:rgba(245,245,247,0.16);
          --r-sm:8px; --r-md:12px; --r-lg:16px; --r-2xl:24px;
        }
        html, body { height:100%; }
        body { background:var(--black); color:var(--text-primary); font-family:'DM Sans',sans-serif; font-size:14px; line-height:1; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::selection { background:rgba(91,79,232,0.25); color:#fff; }

        .shell { min-height:100vh; display:grid; grid-template-columns:1fr minmax(0,560px) 1fr; grid-template-rows:auto 1fr; }

        .topbar { grid-column:1/-1; height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 32px; border-bottom:0.5px solid var(--border); background:rgba(7,7,10,0.9); backdrop-filter:blur(24px); position:sticky; top:0; z-index:100; }
        .topbar-logo { display:flex; align-items:center; gap:10px; font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:var(--text-primary); text-decoration:none; letter-spacing:-0.3px; }
        .topbar-title { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); position:absolute; left:50%; transform:translateX(-50%); }
        .topbar-back { display:flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-secondary); background:none; border:none; cursor:pointer; transition:color 0.15s; text-decoration:none; }
        .topbar-back:hover { color:var(--text-primary); }

        .progress-bar { grid-column:1/-1; height:2px; background:var(--border); position:relative; }
        .progress-fill { position:absolute; top:0; left:0; height:100%; background:linear-gradient(90deg,var(--indigo),var(--indigo-l)); transition:width 0.4s cubic-bezier(0.16,1,0.3,1); border-radius:0 2px 2px 0; }

        .content { grid-column:2; padding:48px 0 80px; display:flex; flex-direction:column; gap:32px; }

        .step-header { display:flex; flex-direction:column; gap:8px; }
        .step-eyebrow { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--indigo-l); display:flex; align-items:center; gap:10px; }
        .step-eyebrow-line { width:20px; height:1px; background:var(--indigo-l); }
        .step-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--text-primary); letter-spacing:-0.8px; line-height:1.05; }
        .step-desc { font-family:'DM Sans',sans-serif; font-size:14px; color:var(--text-secondary); line-height:1.6; margin-top:4px; }

        .choice-grid { display:flex; flex-direction:column; gap:10px; }
        .choice-card { padding:20px 24px; border:0.5px solid var(--border-md); border-radius:var(--r-lg); background:var(--surface); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:16px; text-align:left; width:100%; }
        .choice-card:hover { background:var(--surface2); border-color:var(--border-hi); }
        .choice-card.selected { background:var(--indigo-dim); border-color:rgba(91,79,232,0.4); }
        .choice-icon { width:44px; height:44px; border-radius:var(--r-md); background:var(--surface3); border:0.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); flex-shrink:0; transition:all 0.15s; }
        .choice-card.selected .choice-icon { background:var(--indigo-dim); border-color:rgba(91,79,232,0.3); color:var(--indigo-l); }
        .choice-body { flex:1; min-width:0; }
        .choice-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:var(--text-primary); letter-spacing:-0.2px; margin-bottom:4px; }
        .choice-desc { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); line-height:1.5; }
        .choice-badge { font-family:'DM Mono',monospace; font-size:10px; padding:4px 10px; border-radius:5px; white-space:nowrap; flex-shrink:0; }
        .badge-indigo { color:var(--indigo-l); background:var(--indigo-dim); border:0.5px solid rgba(91,79,232,0.2); }
        .badge-gold   { color:var(--gold); background:var(--gold-dim); border:0.5px solid rgba(201,168,76,0.2); }

        .fields { display:flex; flex-direction:column; gap:16px; }
        .field { display:flex; flex-direction:column; gap:8px; }
        .field-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-label); }
        .field-hint { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--text-faint); margin-top:-4px; }
        .field-input { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-md); padding:13px 16px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--text-primary); transition:border-color 0.15s; outline:none; width:100%; }
        .field-input:focus { border-color:rgba(91,79,232,0.5); }
        .field-input::placeholder { color:var(--text-faint); }
        .field-input.mono { font-family:'DM Mono',monospace; font-size:20px; letter-spacing:-0.5px; }
        textarea.field-input { resize:none; line-height:1.6; min-height:80px; }
        .amount-row { display:flex; gap:10px; }
        .currency-sel { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-md); padding:13px 16px; font-family:'DM Mono',monospace; font-size:13px; color:var(--text-primary); outline:none; cursor:pointer; flex-shrink:0; }
        .mode-hint { display:flex; align-items:center; gap:8px; padding:10px 14px; background:var(--indigo-dim); border:0.5px solid rgba(91,79,232,0.15); border-radius:var(--r-md); font-family:'DM Mono',monospace; font-size:10px; color:var(--indigo-l); letter-spacing:0.06em; }

        .release-tabs { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:20px; }
        .release-tab { padding:12px 8px; border-radius:var(--r-md); background:var(--surface); border:0.5px solid var(--border-md); cursor:pointer; transition:all 0.15s; text-align:center; }
        .release-tab:hover { background:var(--surface2); }
        .release-tab.active { background:var(--indigo-dim); border-color:rgba(91,79,232,0.35); }
        .rt-title { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; color:var(--text-primary); margin-bottom:3px; }
        .rt-desc { font-family:'DM Sans',sans-serif; font-size:10px; color:var(--text-faint); line-height:1.4; }

        .milestones { display:flex; flex-direction:column; gap:10px; }
        .milestone-row { display:grid; grid-template-columns:1fr 90px 36px; gap:8px; align-items:center; }
        .percent-input { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-md); padding:12px 14px; font-family:'DM Mono',monospace; font-size:14px; color:var(--text-primary); outline:none; width:100%; text-align:right; }
        .percent-input:focus { border-color:rgba(91,79,232,0.5); }
        .percent-err { color:var(--red); }
        .percent-ok  { color:var(--green); }
        .total-row { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:var(--r-md); background:var(--surface2); border:0.5px solid var(--border); font-family:'DM Mono',monospace; font-size:11px; }

        .conditions { display:flex; flex-direction:column; gap:8px; }
        .condition-row { display:grid; grid-template-columns:1fr 36px; gap:8px; align-items:flex-start; }
        .icon-btn-sm { width:36px; height:36px; border-radius:var(--r-md); background:var(--surface2); border:0.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-faint); cursor:pointer; transition:all 0.15s; flex-shrink:0; align-self:center; }
        .icon-btn-sm:hover { color:var(--text-primary); border-color:var(--border-md); }
        .icon-btn-sm.remove:hover { color:var(--red); border-color:rgba(224,82,82,0.3); background:var(--red-dim); }
        .add-btn { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:var(--r-md); background:none; border:0.5px dashed var(--border-md); color:var(--text-secondary); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:12px; transition:all 0.15s; width:100%; }
        .add-btn:hover { color:var(--text-primary); border-color:var(--border-hi); background:var(--surface2); }

        .legal-note { padding:16px 18px; background:rgba(201,168,76,0.05); border:0.5px solid rgba(201,168,76,0.15); border-radius:var(--r-md); display:flex; gap:12px; align-items:flex-start; }
        .legal-icon { color:var(--gold); flex-shrink:0; margin-top:1px; }
        .legal-text { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-body); line-height:1.6; }
        .legal-text strong { color:var(--gold); font-weight:500; }

        .review-card { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); overflow:hidden; }
        .review-section { padding:20px 24px; border-bottom:0.5px solid var(--border); }
        .review-section:last-child { border-bottom:none; }
        .review-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-faint); margin-bottom:12px; }
        .review-amount { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; letter-spacing:-1.5px; color:var(--text-primary); }
        .review-row { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:6px 0; }
        .review-key { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); }
        .review-val { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-primary); text-align:right; font-weight:500; }
        .condition-pill { display:flex; align-items:flex-start; gap:8px; padding:8px 12px; background:var(--surface2); border:0.5px solid var(--border); border-radius:var(--r-md); margin-bottom:6px; }
        .condition-pill:last-child { margin-bottom:0; }
        .condition-num { font-family:'DM Mono',monospace; font-size:9px; color:var(--indigo-l); flex-shrink:0; margin-top:2px; }
        .condition-text { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-body); line-height:1.5; }
        .confirm-notice { padding:14px 18px; background:var(--green-dim); border:0.5px solid rgba(93,204,138,0.2); border-radius:var(--r-md); font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-body); line-height:1.6; display:flex; gap:10px; align-items:flex-start; }
        .confirm-notice svg { color:var(--green); flex-shrink:0; margin-top:1px; }

        .deal-code-box { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); padding:36px 32px; text-align:center; position:relative; overflow:hidden; }
        .deal-code-box::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:300px; height:0.5px; background:linear-gradient(90deg,transparent,var(--indigo-l),transparent); }
        .code-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-faint); margin-bottom:16px; }
        .code-value { font-family:'DM Mono',monospace; font-size:28px; font-weight:500; color:var(--text-primary); letter-spacing:0.06em; margin-bottom:8px; }
        .code-expiry { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-faint); margin-bottom:24px; }
        .share-actions { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
        .share-btn { display:flex; align-items:center; gap:8px; padding:10px 18px; border-radius:var(--r-md); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; border:none; }
        .sb-copy { background:var(--indigo); color:#fff; }
        .sb-copy:hover { background:var(--indigo-l); }
        .sb-copy.done { background:var(--green-dim); color:var(--green); border:0.5px solid rgba(93,204,138,0.25); }
        .sb-whatsapp { background:var(--surface2); color:var(--text-primary); border:0.5px solid var(--border-md); }
        .sb-whatsapp:hover { background:var(--surface3); }

        .share-divider { display:flex; align-items:center; gap:12px; margin:16px 0; }
        .share-divider-line { flex:1; height:0.5px; background:var(--border); }
        .share-divider-text { font-family:'DM Mono',monospace; font-size:9px; color:var(--text-faint); letter-spacing:0.1em; }
        .pdf-note { padding:14px 18px; background:var(--surface2); border:0.5px solid var(--border); border-radius:var(--r-md); display:flex; gap:10px; align-items:flex-start; }
        .pdf-note svg { color:var(--text-faint); flex-shrink:0; margin-top:1px; }
        .pdf-note-text { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); line-height:1.5; }
        .pdf-note-text strong { color:var(--text-primary); }

        .error-box { background:rgba(224,82,82,0.08); border:0.5px solid rgba(224,82,82,0.25); border-radius:var(--r-md); padding:12px 14px; font-family:'DM Sans',sans-serif; font-size:12px; color:var(--red); line-height:1.5; }

        .step-footer { display:flex; gap:10px; align-items:center; justify-content:space-between; padding-top:8px; }
        .btn-back { display:flex; align-items:center; gap:8px; padding:12px 20px; border-radius:var(--r-md); background:none; border:0.5px solid var(--border-md); color:var(--text-secondary); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; }
        .btn-back:hover { color:var(--text-primary); border-color:var(--border-hi); }
        .btn-next { display:flex; align-items:center; gap:8px; padding:12px 28px; border-radius:var(--r-md); background:var(--indigo); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; margin-left:auto; }
        .btn-next:hover:not(:disabled) { background:var(--indigo-l); }
        .btn-next:disabled { opacity:0.35; cursor:not-allowed; }
        .btn-next.final { background:var(--green); }
        .btn-next.final:hover:not(:disabled) { background:#4db87a; }

        .step-dots { display:flex; gap:6px; align-items:center; }
        .step-dot { width:6px; height:6px; border-radius:50%; background:var(--border-md); transition:all 0.2s; }
        .step-dot.done    { background:var(--indigo-l); }
        .step-dot.current { background:var(--text-primary); width:18px; border-radius:3px; }

        @media (max-width:640px) {
          .shell { grid-template-columns:1fr; }
          .content { padding:32px 20px 80px; }
          .topbar { padding:0 20px; }
          .topbar-title { display:none; }
          .release-tabs { grid-template-columns:1fr; }
          .share-actions { flex-direction:column; }
          .share-btn { justify-content:center; }
        }
      `}</style>

      {/* Progress */}
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-fill" style={{width:`${((step+1)/STEPS.length)*100}%`}} />
      </div>

      <div className="shell">
        <header className="topbar">
          <a href="/dashboard" className="topbar-logo">
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <circle cx="7" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="23" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
              <circle cx="7" cy="15" r="2" fill="#7B70F0"/>
              <circle cx="23" cy="15" r="2" fill="#7B70F0"/>
            </svg>
            Gagara
          </a>
          <div className="topbar-title">New deal — Step {step+1} of {STEPS.length}</div>
          <a href="/dashboard" className="topbar-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Cancel
          </a>
        </header>

        <main className="content">

          {error && <div className="error-box">{error}</div>}

          {/* STEP 0: ROLE */}
          {step === 0 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 1 of 6</div>
                <div className="step-title">What is your role<br/>in this deal?</div>
                <div className="step-desc">This determines who locks the funds and who receives them.</div>
              </div>
              <div className="choice-grid">
                <button className={`choice-card ${deal.role==='payer'?'selected':''}`} onClick={() => update({role:'payer'})}>
                  <div className="choice-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg></div>
                  <div className="choice-body">
                    <div className="choice-title">I am paying</div>
                    <div className="choice-desc">You lock funds into the vault. The receiver sees them. Funds release when both confirm.</div>
                  </div>
                  <span className="choice-badge badge-indigo">Payer</span>
                </button>
                <button className={`choice-card ${deal.role==='receiver'?'selected':''}`} onClick={() => update({role:'receiver'})}>
                  <div className="choice-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
                  <div className="choice-body">
                    <div className="choice-title">I am receiving</div>
                    <div className="choice-desc">You share the deal terms. The payer locks funds. You see the money in the vault before work starts.</div>
                  </div>
                  <span className="choice-badge badge-indigo">Receiver</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 1: MODE */}
          {step === 1 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 2 of 6</div>
                <div className="step-title">Choose the deal mode</div>
                <div className="step-desc">Each mode has different amount limits. This is set once for this deal.</div>
              </div>
              <div className="choice-grid">
                {[
                  {key:'personal', title:'Personal', desc:'Freelancers, small jobs, money between friends.', range:'$1 – $2,000', badge:'badge-indigo'},
                  {key:'business', title:'Business', desc:'Service contracts, supplier deals, project milestones.', range:'$200 – $50,000', badge:'badge-indigo'},
                  {key:'enterprise', title:'Enterprise', desc:'Large contracts, multiple parties. Built for precision.', range:'$10,000+', badge:'badge-gold'},
                ].map(m => (
                  <button key={m.key} className={`choice-card ${deal.mode===m.key?'selected':''}`} onClick={() => update({mode:m.key as Mode})}>
                    <div className="choice-body">
                      <div className="choice-title">{m.title}</div>
                      <div className="choice-desc">{m.desc}</div>
                    </div>
                    <span className={`choice-badge ${m.badge}`}>{m.range}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 3 of 6</div>
                <div className="step-title">Deal details</div>
                <div className="step-desc">Set the amount, describe what this deal is for, and agree a timeline.</div>
              </div>
              <div className="fields">
                <div className="field">
                  <div className="field-label">Amount</div>
                  <div className="amount-row">
                    <select className="currency-sel" value={deal.currency} onChange={e => update({currency:e.target.value})}>
                      <option>USD</option><option>EUR</option><option>GBP</option><option>KES</option><option>PHP</option><option>NGN</option>
                    </select>
                    <input className="field-input mono" type="number" min="0" placeholder="0.00" value={deal.amount} onChange={e => update({amount:e.target.value})}/>
                  </div>
                  {deal.mode && (() => {
                    const amt = parseFloat(deal.amount || '0');
                    const outOfRange =
                      (deal.mode === 'personal'   && deal.amount && (amt < 1      || amt > 2000))  ||
                      (deal.mode === 'business'   && deal.amount && (amt < 200    || amt > 50000)) ||
                      (deal.mode === 'enterprise' && deal.amount && amt < 10000);
                    return (
                      <div className="mode-hint" style={{background: outOfRange ? 'rgba(224,82,82,0.08)' : undefined, borderColor: outOfRange ? 'rgba(224,82,82,0.2)' : undefined, color: outOfRange ? 'var(--red)' : undefined}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {outOfRange ? `Amount out of range for ${deal.mode} mode — limit is ${modeLimit}` : `${deal.mode.charAt(0).toUpperCase()+deal.mode.slice(1)} mode limit: ${modeLimit}`}
                      </div>
                    );
                  })()}
                </div>
                <div className="field">
                  <div className="field-label">What is this deal for?</div>
                  <textarea className="field-input" placeholder="Describe the work, goods, or agreement clearly." value={deal.description} onChange={e => update({description:e.target.value})} rows={3}/>
                </div>
                <div className="field">
                  <div className="field-label">Expected completion (optional)</div>
                  <input className="field-input" type="date" value={deal.timeline} onChange={e => update({timeline:e.target.value})}/>
                  <div className="field-hint">Both parties can propose timeline changes later.</div>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: CONDITIONS */}
          {step === 3 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 4 of 6</div>
                <div className="step-title">Set the release conditions</div>
                <div className="step-desc">Both parties must confirm all conditions before any funds are released.</div>
              </div>
              <div className="release-tabs">
                {[
                  {key:'single', title:'Single release', desc:'Full amount at once.'},
                  {key:'milestones', title:'By milestone', desc:'Split by percentage.'},
                  {key:'scheduled', title:'Scheduled', desc:'Fixed date tranches.'},
                ].map(r => (
                  <button key={r.key} className={`release-tab ${deal.releaseType===r.key?'active':''}`} onClick={() => update({releaseType:r.key as Release})}>
                    <div className="rt-title">{r.title}</div>
                    <div className="rt-desc">{r.desc}</div>
                  </button>
                ))}
              </div>
              {deal.releaseType === 'milestones' && (
                <>
                  <div className="field-label" style={{marginBottom:'8px'}}>Milestones</div>
                  <div className="milestones">
                    {deal.milestones.map((m,i) => (
                      <div key={m.id} className="milestone-row">
                        <input className="field-input" placeholder={`Milestone ${i+1}`} value={m.description} onChange={e => { const ms=[...deal.milestones]; ms[i]={...ms[i],description:e.target.value}; update({milestones:ms}); }}/>
                        <div style={{position:'relative'}}>
                          <input className="percent-input" type="number" min="1" max="100" value={m.percent} onChange={e => { const ms=[...deal.milestones]; ms[i]={...ms[i],percent:Number(e.target.value)}; update({milestones:ms}); }}/>
                          <span style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',fontFamily:'DM Mono',fontSize:'11px',color:'var(--text-faint)',pointerEvents:'none'}}>%</span>
                        </div>
                        {deal.milestones.length > 2 && <button className="icon-btn-sm remove" onClick={() => update({milestones:deal.milestones.filter((_,j)=>j!==i)})}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                        {deal.milestones.length <= 2 && <div style={{width:'36px'}}/>}
                      </div>
                    ))}
                    <div className="total-row">
                      <span style={{fontFamily:'DM Sans',fontSize:'12px',color:'var(--text-secondary)'}}>Total</span>
                      <span className={totalPercent===100?'percent-ok':'percent-err'}>{totalPercent}% {totalPercent===100?'— correct':'— must equal 100%'}</span>
                    </div>
                    <button className="add-btn" onClick={() => update({milestones:[...deal.milestones,{id:uid(),description:'',percent:0}]})}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add milestone
                    </button>
                  </div>
                </>
              )}
              <div style={{marginTop:'8px'}}>
                <div className="field-label" style={{marginBottom:'8px'}}>Release conditions <span style={{marginLeft:'8px',fontFamily:'DM Sans',fontSize:'10px',color:'var(--text-faint)',textTransform:'none',letterSpacing:'normal'}}>— both must confirm each one</span></div>
                <div className="conditions">
                  {deal.conditions.map((c,i) => (
                    <div key={c.id} className="condition-row">
                      <textarea className="field-input" rows={2} placeholder={`Condition ${i+1}`} value={c.text} onChange={e => { const cs=[...deal.conditions]; cs[i]={...cs[i],text:e.target.value}; update({conditions:cs}); }}/>
                      {deal.conditions.length > 1 && <button className="icon-btn-sm remove" onClick={() => update({conditions:deal.conditions.filter((_,j)=>j!==i)})}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                      {deal.conditions.length === 1 && <div style={{width:'36px'}}/>}
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => update({conditions:[...deal.conditions,{id:uid(),text:''}]})}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add condition
                  </button>
                </div>
              </div>
              <div className="legal-note">
                <div className="legal-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div className="legal-text"><strong>If there is a dispute</strong> — Gagara generates a full PDF of all agreed conditions, every confirmation, and the complete audit trail. Timestamped and court-ready.</div>
              </div>
            </>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 5 of 6</div>
                <div className="step-title">Review your deal</div>
                <div className="step-desc">The other party will see exactly this when they enter the Deal Code.</div>
              </div>
              <div className="review-card">
                <div className="review-section">
                  <div className="review-label">Amount</div>
                  <div className="review-amount">{deal.currency} {Number(deal.amount).toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                </div>
                <div className="review-section">
                  <div className="review-label">Deal details</div>
                  <div className="review-row"><span className="review-key">Role</span><span className="review-val">{deal.role==='payer'?'You are paying':'You are receiving'}</span></div>
                  <div className="review-row"><span className="review-key">Mode</span><span className="review-val">{deal.mode?deal.mode.charAt(0).toUpperCase()+deal.mode.slice(1):''}</span></div>
                  <div className="review-row"><span className="review-key">Description</span><span className="review-val" style={{maxWidth:'240px',textAlign:'right'}}>{deal.description}</span></div>
                  {deal.timeline && <div className="review-row"><span className="review-key">Deadline</span><span className="review-val">{deal.timeline}</span></div>}
                  <div className="review-row"><span className="review-key">Release</span><span className="review-val">{deal.releaseType==='single'?'Single release':deal.releaseType==='milestones'?`${deal.milestones.length} milestones`:'Scheduled'}</span></div>
                </div>
                <div className="review-section">
                  <div className="review-label">Conditions — both must confirm</div>
                  {deal.conditions.filter(c=>c.text.trim()).map((c,i) => (
                    <div key={c.id} className="condition-pill">
                      <span className="condition-num">0{i+1}</span>
                      <span className="condition-text">{c.text}</span>
                    </div>
                  ))}
                  {deal.releaseType==='milestones' && deal.milestones.map((m,i) => (
                    <div key={m.id} className="condition-pill">
                      <span className="condition-num">M{i+1}</span>
                      <span className="condition-text">{m.description} — {m.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="confirm-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Nothing is locked until both sides agree. The other party reviews all terms before accepting.</span>
              </div>
            </>
          )}

          {/* STEP 5: SHARE */}
          {step === 5 && (
            <>
              <div className="step-header">
                <div className="step-eyebrow"><span className="step-eyebrow-line"/>Step 6 of 6</div>
                <div className="step-title">Your Deal Code is ready</div>
                <div className="step-desc">Share this code with the other party. They enter it at gagara.vercel.app/connect to review and accept.</div>
              </div>
              <div className="deal-code-box">
                <div className="code-label">Deal code</div>
                <div className="code-value">{code}</div>
                <div className="code-expiry">Expires in 48 hours · Single use only</div>
                <div className="share-actions">
                  <button className={`share-btn sb-copy ${copied?'done':''}`} onClick={copyCode}>
                    {copied ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy code</>}
                  </button>
                  <button className="share-btn sb-whatsapp" onClick={shareWhatsApp}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                    Share via WhatsApp
                  </button>
                </div>
              </div>
              <div className="share-divider">
                <div className="share-divider-line"/>
                <div className="share-divider-text">Dispute protection</div>
                <div className="share-divider-line"/>
              </div>
              <div className="pdf-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div className="pdf-note-text"><strong>Gagara generates a court-ready PDF</strong> of the full deal — all agreed conditions, every confirmation, and the complete timestamped audit trail. Both parties can download it at any time from the deal page.</div>
              </div>
            </>
          )}

          {/* FOOTER */}
          <div className="step-footer">
            {step > 0 && step < 5 && (
              <button className="btn-back" onClick={back}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
            )}
            <div className="step-dots" aria-hidden="true">
              {STEPS.map((_,i) => <div key={i} className={`step-dot ${i<step?'done':i===step?'current':''}`}/>)}
            </div>
            {step < 5 && (
              <button className={`btn-next ${step===4?'final':''}`} onClick={next} disabled={!canNext() || saving}>
                {saving ? 'Creating deal…' : step===4 ? 'Generate Deal Code' : 'Continue'}
                {!saving && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
              </button>
            )}
            {step === 5 && (
              <a href="/dashboard" className="btn-next" style={{textDecoration:'none',marginLeft:'auto'}}>
                Go to dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
