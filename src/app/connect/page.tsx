'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface DealRow {
  id:              string;
  code:            string;
  amount:          number;
  currency:        string;
  description:     string;
  mode:            string;
  deadline:        string | null;
  release_type:    string;
  milestones:      { label: string; percent: number }[];
  conditions:      string[];
  payer_id:        string | null;
  receiver_id:     string | null;
  status:          string;
  code_expires_at: string;
  created_at:      string;
  payer_profile?:  { handle: string | null; name: string; kyc_verified: boolean } | null;
  receiver_profile?: { handle: string | null; name: string; kyc_verified: boolean } | null;
}

type Stage = 'entry' | 'loading' | 'notfound' | 'expired' | 'review' | 'accepting' | 'accepted' | 'declined' | 'already_connected';

export default function Connect() {
  const router = useRouter();
  const [stage,   setStage]   = useState<Stage>('entry');
  const [code,    setCode]    = useState('');
  const [error,   setError]   = useState('');
  const [deal,    setDeal]    = useState<DealRow | null>(null);
  const [userId,  setUserId]  = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState<string | null>(null);

  // Read code from URL on load (handles redirect back after sign in)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      const formatted = urlCode.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{3})(.{4})(.{4})$/, '$1-$2-$3');
      setCode(formatted);
    }
  }, []);

  // Get current session (optional — not required to view, required to accept)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        supabase
          .from('profiles')
          .select('handle, name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserHandle(data.handle || data.name);
          });
      }
    });
  }, []);

  // Format input as GGR-XXXX-XXXX
  // Auto-lookup when code arrives from URL redirect
  useEffect(() => {
    if (code.length === 12 && stage === 'entry') {
      lookup();
    }
  }, [code]);

  const formatCode = (raw: string) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length <= 3)  return clean;
    if (clean.length <= 7)  return `${clean.slice(0,3)}-${clean.slice(3)}`;
    return `${clean.slice(0,3)}-${clean.slice(3,7)}-${clean.slice(7,11)}`;
  };

  const handleInput = (val: string) => {
    setCode(formatCode(val));
    setError('');
  };

  const lookup = async () => {
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 12) {
      setError('Enter the full Deal Code — it looks like GGR-XXXX-XXXX');
      return;
    }
    setStage('loading');

    try {
      const { data, error: fetchError } = await supabase
        .from('deals')
        .select(`
          *,
          payer_profile:profiles!deals_payer_id_fkey(handle, name, kyc_verified),
          receiver_profile:profiles!deals_receiver_id_fkey(handle, name, kyc_verified)
        `)
        .eq('code', normalized)
        .single();

      if (fetchError || !data) {
        setStage('notfound');
        return;
      }

      // Check expiry
      if (new Date(data.code_expires_at) < new Date()) {
        setStage('expired');
        return;
      }

      // Check if deal already has both parties connected
      if (data.payer_id && data.receiver_id) {
        setDeal(data);
        setStage('already_connected');
        return;
      }

      // Check if current user is already one of the parties
      if (userId && (data.payer_id === userId || data.receiver_id === userId)) {
        setDeal(data);
        setStage('already_connected');
        return;
      }

      setDeal(data);
      setStage('review');
    } catch {
      setStage('notfound');
    }
  };

  const accept = async () => {
    if (!userId) {
      // Not signed in — redirect to sign in with return URL
      const returnUrl = `/connect?code=${code}`;
      router.push(`/sign-in?redirectTo=${encodeURIComponent(returnUrl)}`);
      return;
    }
    if (!deal) return;

    setStage('accepting');

    try {
      // Determine which field to fill based on who created the deal
      const updateField = deal.payer_id ? 'receiver_id' : 'payer_id';

      const { error: updateError } = await supabase
        .from('deals')
        .update({
          [updateField]: userId,
          status: 'active',
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;

      setStage('accepted');
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
      setStage('review');
    }
  };

  const decline = () => setStage('declined');
  const restart = () => { setStage('entry'); setCode(''); setDeal(null); setError(''); };

  // Helpers
  const expiresIn = (iso: string) => {
    const ms = new Date(iso).getTime() - Date.now();
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m} minutes`;
  };

  const creatorLabel = (d: DealRow) => {
    if (d.payer_id && d.payer_profile) {
      const h = d.payer_profile.handle ? `@${d.payer_profile.handle}` : d.payer_profile.name;
      return { label: 'From (Payer)', value: h, verified: d.payer_profile.kyc_verified };
    }
    if (d.receiver_id && d.receiver_profile) {
      const h = d.receiver_profile.handle ? `@${d.receiver_profile.handle}` : d.receiver_profile.name;
      return { label: 'From (Receiver)', value: h, verified: d.receiver_profile.kyc_verified };
    }
    return { label: 'From', value: 'Unknown', verified: false };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:      #07070A;
          --surface:    #0D0D12;
          --surface2:   #111118;
          --surface3:   #16161F;
          --surface4:   #1A1A28;
          --indigo:     #5B4FE8;
          --indigo-l:   #7B70F0;
          --indigo-dim: rgba(91,79,232,0.1);
          --gold:       #C9A84C;
          --gold-dim:   rgba(201,168,76,0.08);
          --green:      #5DCC8A;
          --green-dim:  rgba(93,204,138,0.08);
          --red:        #E05252;
          --red-dim:    rgba(224,82,82,0.08);

          --text-primary:   #F5F5F7;
          --text-body:      rgba(245,245,247,0.72);
          --text-secondary: rgba(245,245,247,0.50);
          --text-label:     rgba(245,245,247,0.38);
          --text-faint:     rgba(245,245,247,0.20);

          --border:    rgba(245,245,247,0.06);
          --border-md: rgba(245,245,247,0.10);
          --border-hi: rgba(245,245,247,0.16);

          --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-2xl: 24px;
        }

        html, body { height: 100%; }
        body {
          background: var(--black);
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        ::selection { background: rgba(91,79,232,0.25); color: #fff; }

        .shell { min-height: 100vh; display: flex; flex-direction: column; }

        .topbar {
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          border-bottom: 0.5px solid var(--border);
          background: rgba(7,7,10,0.9);
          backdrop-filter: blur(24px);
          position: sticky; top: 0; z-index: 100;
          flex-shrink: 0;
        }
        .topbar-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: var(--text-primary); text-decoration: none;
          letter-spacing: -0.3px;
        }
        .topbar-right { display: flex; align-items: center; gap: 16px; }
        .topbar-user {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--text-faint);
          letter-spacing: 0.06em;
        }
        .topbar-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary);
          text-decoration: none; transition: color 0.15s;
        }
        .topbar-link:hover { color: var(--text-primary); }

        .center {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 20px 80px;
        }
        .panel { width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 24px; }

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--indigo-l);
          display: flex; align-items: center; gap: 10px;
        }
        .eyebrow-line { width: 20px; height: 1px; background: var(--indigo-l); flex-shrink: 0; }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.8px; line-height: 1.05;
        }
        .page-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary); line-height: 1.6;
          margin-top: -12px;
        }

        /* Entry */
        .code-entry { display: flex; flex-direction: column; gap: 12px; }
        .code-field { display: flex; gap: 10px; }
        .code-input {
          flex: 1;
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-md);
          padding: 16px 20px;
          font-family: 'DM Mono', monospace;
          font-size: 18px; font-weight: 500;
          color: var(--text-primary); letter-spacing: 0.06em;
          outline: none; transition: border-color 0.15s;
          text-align: center;
        }
        .code-input:focus { border-color: rgba(91,79,232,0.5); }
        .code-input::placeholder { color: var(--text-faint); font-size: 14px; letter-spacing: 0.1em; }
        .code-input.err { border-color: rgba(224,82,82,0.5); }
        .error-msg { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--red); display: flex; align-items: center; gap: 6px; }
        .btn-lookup {
          padding: 16px 28px; border-radius: var(--r-md);
          background: var(--indigo); color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
        }
        .btn-lookup:hover { background: var(--indigo-l); }
        .btn-lookup:active { transform: scale(0.97); }
        .entry-note { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-faint); line-height: 1.6; text-align: center; }

        /* Loading */
        .loading-box {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          padding: 48px 32px;
          background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-2xl);
        }
        .spinner { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border-md); border-top-color: var(--indigo-l); animation: spin 0.8s linear infinite; }
        .loading-text { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Not found / expired */
        .state-box {
          padding: 40px 32px;
          background: var(--surface);
          border-radius: var(--r-2xl);
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .state-box.red  { border: 0.5px solid rgba(224,82,82,0.2); }
        .state-box.gold { border: 0.5px solid rgba(201,168,76,0.2); }
        .state-box.indigo { border: 0.5px solid rgba(91,79,232,0.2); }
        .state-icon {
          width: 48px; height: 48px; border-radius: var(--r-lg);
          display: flex; align-items: center; justify-content: center;
        }
        .state-icon.red    { background: var(--red-dim);    border: 0.5px solid rgba(224,82,82,0.2);   color: var(--red); }
        .state-icon.gold   { background: var(--gold-dim);   border: 0.5px solid rgba(201,168,76,0.2);  color: var(--gold); }
        .state-icon.indigo { background: var(--indigo-dim); border: 0.5px solid rgba(91,79,232,0.2);   color: var(--indigo-l); }
        .state-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.3px; }
        .state-desc  { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.6; max-width: 280px; }
        .btn-retry {
          margin-top: 4px; padding: 10px 20px; border-radius: var(--r-md);
          background: var(--surface2); color: var(--text-primary);
          border: 0.5px solid var(--border-md);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-retry:hover { background: var(--surface3); }

        /* Deal card */
        .deal-card {
          background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-2xl);
          overflow: hidden; position: relative;
        }
        .deal-card::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 260px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--indigo-l), transparent);
        }
        .deal-header { padding: 24px 24px 20px; border-bottom: 0.5px solid var(--border); }
        .deal-code-tag {
          font-family: 'DM Mono', monospace; font-size: 10px; color: var(--indigo-l);
          letter-spacing: 0.1em; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .deal-code-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--indigo-l); animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .deal-amount { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; letter-spacing: -1.5px; color: var(--text-primary); margin-bottom: 6px; }
        .deal-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-body); line-height: 1.5; }

        .deal-meta { padding: 16px 24px; border-bottom: 0.5px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
        .meta-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .meta-key { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-secondary); flex-shrink: 0; }
        .meta-val { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-primary); font-weight: 500; text-align: right; display: flex; align-items: center; gap: 6px; }
        .verified-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-family: 'DM Mono', monospace; font-size: 9px; color: var(--green);
          background: var(--green-dim); border: 0.5px solid rgba(93,204,138,0.2);
          padding: 2px 7px; border-radius: 4px;
        }
        .mode-badge { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(91,79,232,0.2); padding: 2px 7px; border-radius: 4px; }
        .expiry-badge { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gold); background: var(--gold-dim); border: 0.5px solid rgba(201,168,76,0.2); padding: 2px 7px; border-radius: 4px; }

        .deal-conditions { padding: 16px 24px; border-bottom: 0.5px solid var(--border); }
        .deal-conditions:last-child { border-bottom: none; }
        .section-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; }
        .condition-item { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-bottom: 0.5px solid var(--border); }
        .condition-item:last-child { border-bottom: none; }
        .condition-num { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--indigo-l); flex-shrink: 0; margin-top: 2px; min-width: 16px; }
        .condition-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.5; }
        .milestone-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 0.5px solid var(--border); }
        .milestone-item:last-child { border-bottom: none; }
        .milestone-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.4; }
        .milestone-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--indigo-l); white-space: nowrap; flex-shrink: 0; }

        .vault-notice { padding: 16px 24px; display: flex; gap: 12px; align-items: flex-start; }
        .vault-notice svg { color: var(--indigo-l); flex-shrink: 0; margin-top: 1px; }
        .vault-notice-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.6; }
        .vault-notice-text strong { color: var(--text-primary); font-weight: 500; }

        /* Auth nudge */
        .auth-nudge {
          padding: 14px 18px;
          background: var(--indigo-dim); border: 0.5px solid rgba(91,79,232,0.2); border-radius: var(--r-md);
          display: flex; gap: 12px; align-items: flex-start;
        }
        .auth-nudge svg { color: var(--indigo-l); flex-shrink: 0; margin-top: 1px; }
        .auth-nudge-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.6; }
        .auth-nudge-text strong { color: var(--text-primary); font-weight: 500; }

        /* Actions */
        .deal-actions { display: flex; flex-direction: column; gap: 10px; }
        .btn-accept {
          width: 100%; padding: 15px; border-radius: var(--r-md);
          background: var(--green); color: var(--black); border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-accept:hover { background: #4db87a; }
        .btn-accept:active { transform: scale(0.98); }
        .btn-accept:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-decline {
          width: 100%; padding: 13px; border-radius: var(--r-md);
          background: none; color: var(--text-secondary); border: 0.5px solid var(--border-md);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-decline:hover { color: var(--red); border-color: rgba(224,82,82,0.3); background: var(--red-dim); }
        .action-note { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--text-faint); text-align: center; line-height: 1.5; }

        /* Result */
        .result-box {
          padding: 48px 32px; background: var(--surface); border-radius: var(--r-2xl);
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;
          position: relative; overflow: hidden;
        }
        .result-box.success::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 300px; height: 0.5px; background: linear-gradient(90deg, transparent, var(--green), transparent); }
        .result-box.declined-box::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 300px; height: 0.5px; background: linear-gradient(90deg, transparent, var(--red), transparent); }
        .result-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .result-icon.success  { background: var(--green-dim);  border: 0.5px solid rgba(93,204,138,0.25);  color: var(--green); }
        .result-icon.declined { background: var(--red-dim);    border: 0.5px solid rgba(224,82,82,0.25);   color: var(--red); }
        .result-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
        .result-desc  { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.6; max-width: 300px; }
        .result-code  { font-family: 'DM Mono', monospace; font-size: 14px; color: var(--indigo-l); letter-spacing: 0.08em; padding: 8px 16px; background: var(--indigo-dim); border: 0.5px solid rgba(91,79,232,0.2); border-radius: var(--r-md); }
        .btn-dashboard { padding: 12px 28px; border-radius: var(--r-md); background: var(--indigo); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; text-decoration: none; display: inline-block; }
        .btn-dashboard:hover { background: var(--indigo-l); }

        @media (max-width: 640px) {
          .topbar { padding: 0 20px; }
          .center { padding: 32px 16px 64px; }
          .code-field { flex-direction: column; }
          .btn-lookup { width: 100%; }
        }
      `}</style>

      <div className="shell">
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
            Gagara
          </a>
          <div className="topbar-right">
            {userHandle && <span className="topbar-user">@{userHandle.replace('@','')}</span>}
            <a href="/dashboard" className="topbar-link">Dashboard</a>
          </div>
        </header>

        <div className="center">
          <div className="panel">

            {/* ENTRY */}
            {stage === 'entry' && (
              <>
                <div className="eyebrow"><span className="eyebrow-line"/>Enter Deal Code</div>
                <div className="page-title">You received a deal.<br/>Review it here.</div>
                <div className="page-desc">The other party shared a Deal Code with you. Enter it below to see the full terms before you agree to anything.</div>
                <div className="code-entry">
                  <div className="code-field">
                    <input
                      className={`code-input ${error ? 'err' : ''}`}
                      type="text"
                      placeholder="GGR-XXXX-XXXX"
                      value={code}
                      maxLength={12}
                      onChange={e => handleInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && lookup()}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Deal Code"
                    />
                    <button className="btn-lookup" onClick={lookup}>Look up</button>
                  </div>
                  {error && (
                    <div className="error-msg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </div>
                  )}
                  <div className="entry-note">No account needed to review a deal.<br/>You only need to sign in if you choose to accept.</div>
                </div>
              </>
            )}

            {/* LOADING */}
            {stage === 'loading' && (
              <div className="loading-box">
                <div className="spinner" aria-hidden="true"/>
                <div className="loading-text">Looking up deal</div>
              </div>
            )}

            {/* ACCEPTING */}
            {stage === 'accepting' && (
              <div className="loading-box">
                <div className="spinner" aria-hidden="true"/>
                <div className="loading-text">Connecting you to this deal</div>
              </div>
            )}

            {/* NOT FOUND */}
            {stage === 'notfound' && (
              <div className="state-box red">
                <div className="state-icon red">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="state-title">Deal not found</div>
                <div className="state-desc">This code does not match any active deal. It may have been typed incorrectly.</div>
                <button className="btn-retry" onClick={restart}>Try again</button>
              </div>
            )}

            {/* EXPIRED */}
            {stage === 'expired' && (
              <div className="state-box gold">
                <div className="state-icon gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="state-title">Deal code expired</div>
                <div className="state-desc">This Deal Code is no longer valid. Ask the other party to create a new deal and share the updated code.</div>
                <button className="btn-retry" onClick={restart}>Enter another code</button>
              </div>
            )}

            {/* ALREADY CONNECTED */}
            {stage === 'already_connected' && (
              <div className="state-box indigo">
                <div className="state-icon indigo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="state-title">Deal already connected</div>
                <div className="state-desc">Both parties are already linked to this deal. Check your dashboard for its status.</div>
                <a href="/dashboard" className="btn-dashboard" style={{marginTop:'4px'}}>Go to dashboard</a>
              </div>
            )}

            {/* REVIEW */}
            {stage === 'review' && deal && (() => {
              const creator = creatorLabel(deal);
              return (
                <>
                  <div className="eyebrow"><span className="eyebrow-line"/>Review deal terms</div>
                  <div className="page-title">Read carefully before you accept.</div>
                  <div className="page-desc">These are the exact terms set by the other party. Once you accept, both of you are committed.</div>

                  <div className="deal-card">
                    <div className="deal-header">
                      <div className="deal-code-tag">
                        <span className="deal-code-dot" aria-hidden="true"/>
                        {deal.code}
                      </div>
                      <div className="deal-amount">{deal.currency} {deal.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                      <div className="deal-desc">{deal.description}</div>
                    </div>

                    <div className="deal-meta">
                      <div className="meta-row">
                        <span className="meta-key">{creator.label}</span>
                        <span className="meta-val">
                          {creator.value}
                          {creator.verified && (
                            <span className="verified-badge">
                              <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(93,204,138,0.1)" stroke="#5DCC8A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#5DCC8A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              KYC verified
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-key">Deal mode</span>
                        <span className="meta-val"><span className="mode-badge">{deal.mode ? deal.mode.charAt(0).toUpperCase() + deal.mode.slice(1) : '—'}</span></span>
                      </div>
                      {deal.deadline && (
                        <div className="meta-row">
                          <span className="meta-key">Deadline</span>
                          <span className="meta-val">{new Date(deal.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span>
                        </div>
                      )}
                      <div className="meta-row">
                        <span className="meta-key">Release type</span>
                        <span className="meta-val">
                          {deal.release_type === 'milestones'
                            ? `${deal.milestones?.length ?? 0} milestones`
                            : deal.release_type === 'scheduled' ? 'Scheduled' : 'Single release'}
                        </span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-key">Code expires</span>
                        <span className="meta-val"><span className="expiry-badge">{expiresIn(deal.code_expires_at)}</span></span>
                      </div>
                    </div>

                    {deal.release_type === 'milestones' && deal.milestones?.length > 0 && (
                      <div className="deal-conditions">
                        <div className="section-label">Payment milestones</div>
                        {deal.milestones.map((m, i) => (
                          <div key={i} className="milestone-item">
                            <div className="milestone-label">{m.label}</div>
                            <div className="milestone-pct">{m.percent}%</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {deal.conditions?.length > 0 && (
                      <div className="deal-conditions">
                        <div className="section-label">Release conditions — both must confirm every one</div>
                        {deal.conditions.map((c, i) => (
                          <div key={i} className="condition-item">
                            <span className="condition-num">0{i+1}</span>
                            <span className="condition-text">{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="vault-notice">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      <div className="vault-notice-text">
                        <strong>Funds are held in the Gagara vault.</strong> Neither party can touch the money alone. It releases only when both confirm all conditions are met.
                      </div>
                    </div>
                  </div>

                  {!userId && (
                    <div className="auth-nudge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div className="auth-nudge-text">
                        <strong>You need to sign in to accept.</strong> Tapping Accept will take you to sign in and bring you straight back to this deal.
                      </div>
                    </div>
                  )}

                  {error && (
                    <div style={{padding:'12px 14px',background:'rgba(224,82,82,0.08)',border:'0.5px solid rgba(224,82,82,0.25)',borderRadius:'var(--r-md)',fontFamily:'DM Sans',fontSize:'12px',color:'var(--red)'}}>
                      {error}
                    </div>
                  )}

                  <div className="deal-actions">
                    <button className="btn-accept" onClick={accept}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {userId ? 'Accept this deal' : 'Sign in to accept'}
                    </button>
                    <button className="btn-decline" onClick={decline}>Decline</button>
                    <div className="action-note">
                      By accepting, you confirm you have read and agreed to all conditions above. The other party will be notified immediately.
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ACCEPTED */}
            {stage === 'accepted' && (
              <div className="result-box success">
                <div className="result-icon success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="result-title">You are connected</div>
                <div className="result-code">{deal?.code}</div>
                <div className="result-desc">
                  Both parties are now linked. Once funds are deposited into the vault, the deal becomes active and you will both see the balance.
                </div>
                <a href="/dashboard" className="btn-dashboard">Go to dashboard</a>
              </div>
            )}

            {/* DECLINED */}
            {stage === 'declined' && (
              <div className="result-box declined-box">
                <div className="result-icon declined">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <div className="result-title">Deal declined</div>
                <div className="result-desc">You have declined this deal. The other party has been notified. No funds were moved and nothing was committed.</div>
                <button className="btn-retry" onClick={restart}>Enter another code</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
