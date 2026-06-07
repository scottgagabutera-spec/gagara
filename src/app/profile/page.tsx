'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Profile {
  id:           string;
  name:         string;
  handle:       string | null;
  account_type: string;
  kyc_verified: boolean;
  avatar_color: string;
  created_at:   string;
}

const AVATAR_COLORS = [
  '#5B4FE8','#2BA86A','#C9A84C','#E05252','#7268ED',
  '#4A9EE8','#E8834F','#9B4FE8','#4FE8A0','#E84F9B',
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');
  const [name,      setName]      = useState('');
  const [handle,    setHandle]    = useState('');
  const [handleErr, setHandleErr] = useState('');
  const [color,     setColor]     = useState('#5B4FE8');
  const [email,     setEmail]     = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/sign-in'); return; }
      setEmail(session.user.email || '');

      const { data, error: e } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (e || !data) { setError('Could not load profile.'); setLoading(false); return; }

      setProfile(data);
      setName(data.name || '');
      setHandle((data.handle || '').replace('@', ''));
      setColor(data.avatar_color || '#5B4FE8');
      setLoading(false);
    };
    init();
  }, [router]);

  const validateHandle = (val: string) => {
    if (!val) return '';
    if (val.length < 3) return 'Handle must be at least 3 characters.';
    if (!/^[a-z0-9_]+$/.test(val)) return 'Only lowercase letters, numbers, and underscores.';
    return '';
  };

  const handleChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setHandle(clean);
    setHandleErr(validateHandle(clean));
  };

  const save = async () => {
    if (!profile) return;
    const err = validateHandle(handle);
    if (err) { setHandleErr(err); return; }
    if (!name.trim()) { setError('Name cannot be empty.'); return; }

    setSaving(true); setError(''); setSaved(false);

    try {
      // Check handle uniqueness if changed
      if (handle && handle !== (profile.handle || '').replace('@', '')) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('handle', handle)
          .neq('id', profile.id)
          .single();
        if (existing) { setHandleErr('This handle is already taken.'); setSaving(false); return; }
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          name:         name.trim(),
          handle:       handle || null,
          avatar_color: color,
        })
        .eq('id', profile.id);

      if (updateErr) throw updateErr;

      setProfile(p => p ? { ...p, name: name.trim(), handle: handle || null, avatar_color: color } : p);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'32px', height:'32px', border:'2px solid rgba(245,245,247,0.08)', borderTopColor:'#7B70F0', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const avatarLetter = name?.[0]?.toUpperCase() || '?';
  const accountLabel = profile?.account_type === 'business' ? 'Business' : 'Individual';
  const memberSince  = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { background: #07070A; color: #F5F5F7; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: rgba(91,79,232,0.25); color: #fff; }

        :root {
          --black:#07070A; --surface:#0D0D12; --surface2:#111118; --surface3:#16161F;
          --indigo:#5B4FE8; --indigo-l:#7B70F0; --indigo-dim:rgba(91,79,232,0.1);
          --gold:#C9A84C; --gold-dim:rgba(201,168,76,0.08);
          --green:#5DCC8A; --green-dim:rgba(93,204,138,0.08);
          --red:#E05252; --red-dim:rgba(224,82,82,0.08);
          --text-primary:#F5F5F7; --text-body:rgba(245,245,247,0.72);
          --text-secondary:rgba(245,245,247,0.50); --text-faint:rgba(245,245,247,0.20);
          --border:rgba(245,245,247,0.06); --border-md:rgba(245,245,247,0.10);
          --r-md:12px; --r-lg:16px; --r-2xl:24px;
          --topbar-h:64px;
        }

        .topbar { height: var(--topbar-h); display:flex; align-items:center; justify-content:space-between; padding:0 32px; background:rgba(7,7,10,0.92); backdrop-filter:blur(24px); border-bottom:0.5px solid var(--border); position:sticky; top:0; z-index:100; }
        .topbar-left { display:flex; align-items:center; gap:20px; }
        .topbar-logo { display:flex; align-items:center; gap:10px; font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:var(--text-primary); text-decoration:none; letter-spacing:-0.3px; }
        .topbar-sep { width:1px; height:20px; background:var(--border-md); }
        .topbar-title { font-family:'DM Mono',monospace; font-size:11px; color:var(--text-faint); letter-spacing:0.1em; text-transform:uppercase; }
        .btn-back { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:var(--r-md); background:none; border:0.5px solid var(--border-md); color:var(--text-secondary); font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all 0.15s; text-decoration:none; }
        .btn-back:hover { color:var(--text-primary); border-color:var(--border-hi,rgba(245,245,247,0.16)); }

        .page { max-width: 680px; margin: 0 auto; padding: 40px 32px 80px; display:flex; flex-direction:column; gap:20px; }

        .avatar-section { display:flex; align-items:center; gap:24px; padding:28px; background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); position:relative; overflow:hidden; }
        .avatar-section::before { content:''; position:absolute; top:0; left:0; right:0; height:0.5px; background:linear-gradient(90deg,transparent,var(--indigo-l),transparent); }
        .avatar-circle { width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:#fff; flex-shrink:0; transition:background 0.3s; }
        .avatar-info { flex:1; min-width:0; }
        .avatar-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--text-primary); letter-spacing:-0.5px; margin-bottom:4px; }
        .avatar-handle { font-family:'DM Mono',monospace; font-size:13px; color:var(--text-secondary); margin-bottom:10px; }
        .avatar-badges { display:flex; gap:8px; flex-wrap:wrap; }
        .badge { font-family:'DM Mono',monospace; font-size:9px; padding:4px 10px; border-radius:5px; letter-spacing:0.06em; }
        .badge-type { color:var(--indigo-l); background:var(--indigo-dim); border:0.5px solid rgba(91,79,232,0.2); }
        .badge-kyc-yes { color:var(--green); background:var(--green-dim); border:0.5px solid rgba(93,204,138,0.2); }
        .badge-kyc-no  { color:var(--text-faint); background:var(--surface2); border:0.5px solid var(--border); }
        .badge-member { color:var(--text-faint); background:var(--surface2); border:0.5px solid var(--border); }

        .color-picker { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
        .color-dot { width:28px; height:28px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all 0.15s; flex-shrink:0; }
        .color-dot:hover { transform:scale(1.1); }
        .color-dot.active { border-color:#fff; box-shadow:0 0 0 2px var(--indigo); }

        .card { background:var(--surface); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); overflow:hidden; }
        .card-head { padding:16px 20px; border-bottom:0.5px solid var(--border); }
        .card-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-faint); }
        .card-body { padding:20px; display:flex; flex-direction:column; gap:14px; }

        .field { display:flex; flex-direction:column; gap:6px; }
        .field-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-faint); }
        .field-hint { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--text-faint); line-height:1.5; }
        .field-input { background:var(--surface2); border:0.5px solid var(--border-md); border-radius:var(--r-md); padding:12px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--text-primary); outline:none; transition:border-color 0.15s; width:100%; }
        .field-input:focus { border-color:rgba(91,79,232,0.5); }
        .field-input::placeholder { color:var(--text-faint); }
        .field-input.err { border-color:rgba(224,82,82,0.4); }
        .field-input[disabled] { opacity:0.5; cursor:not-allowed; }
        .handle-wrap { position:relative; }
        .handle-prefix { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-family:'DM Mono',monospace; font-size:14px; color:var(--text-faint); pointer-events:none; }
        .handle-input { padding-left:26px !important; font-family:'DM Mono',monospace !important; }
        .field-err { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--red); }

        .readonly-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:0.5px solid var(--border); }
        .readonly-row:last-child { border-bottom:none; }
        .readonly-key { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); }
        .readonly-val { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-primary); font-weight:500; }
        .readonly-val.mono { font-family:'DM Mono',monospace; font-size:11px; }

        .kyc-card { padding:20px; background:rgba(201,168,76,0.05); border:0.5px solid rgba(201,168,76,0.15); border-radius:var(--r-2xl); display:flex; gap:16px; align-items:flex-start; }
        .kyc-icon { width:40px; height:40px; border-radius:var(--r-md); background:var(--gold-dim); border:0.5px solid rgba(201,168,76,0.2); display:flex; align-items:center; justify-content:center; color:var(--gold); flex-shrink:0; }
        .kyc-body { flex:1; }
        .kyc-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:var(--text-primary); letter-spacing:-0.2px; margin-bottom:6px; }
        .kyc-desc { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); line-height:1.6; margin-bottom:12px; }
        .btn-kyc { padding:9px 18px; border-radius:var(--r-md); background:var(--gold); color:var(--black); border:none; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .btn-kyc:hover { background:#d4b05a; }

        .save-row { display:flex; align-items:center; gap:12px; }
        .btn-save { padding:11px 24px; border-radius:var(--r-md); background:var(--indigo); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; }
        .btn-save:hover:not(:disabled) { background:var(--indigo-l); }
        .btn-save:disabled { opacity:0.5; cursor:not-allowed; }
        .save-confirm { font-family:'DM Mono',monospace; font-size:11px; color:var(--green); letter-spacing:0.06em; display:flex; align-items:center; gap:6px; }
        .error-box { padding:12px 14px; background:var(--red-dim); border:0.5px solid rgba(224,82,82,0.25); border-radius:var(--r-md); font-family:'DM Sans',sans-serif; font-size:12px; color:var(--red); line-height:1.5; }

        .danger-zone { padding:20px; background:var(--surface); border:0.5px solid rgba(224,82,82,0.15); border-radius:var(--r-2xl); display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .danger-label { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-secondary); }
        .danger-label strong { color:var(--text-primary); font-weight:500; display:block; margin-bottom:3px; }
        .btn-signout { padding:9px 18px; border-radius:var(--r-md); background:none; color:var(--red); border:0.5px solid rgba(224,82,82,0.3); font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.15s; }
        .btn-signout:hover { background:var(--red-dim); border-color:rgba(224,82,82,0.5); }

        @media (max-width: 640px) {
          .topbar { padding:0 20px; }
          .page { padding:24px 16px 80px; }
          .avatar-section { flex-direction:column; align-items:flex-start; }
          .danger-zone { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-left">
          <a href="/" className="topbar-logo">
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none">
              <circle cx="7" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="23" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
              <circle cx="7" cy="15" r="2" fill="#7B70F0"/>
              <circle cx="23" cy="15" r="2" fill="#7B70F0"/>
            </svg>
            Gagara
          </a>
          <div className="topbar-sep" />
          <div className="topbar-title">Profile</div>
        </div>
        <a href="/dashboard" className="btn-back">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </a>
      </header>

      <div className="page">

        {/* Avatar + identity */}
        <div className="avatar-section">
          <div className="avatar-circle" style={{ background: color }}>
            {avatarLetter}
          </div>
          <div className="avatar-info">
            <div className="avatar-name">{name || '—'}</div>
            <div className="avatar-handle">{handle ? `@${handle}` : 'No handle set'}</div>
            <div className="avatar-badges">
              <span className="badge badge-type">{accountLabel}</span>
              {profile?.kyc_verified
                ? <span className="badge badge-kyc-yes">KYC verified</span>
                : <span className="badge badge-kyc-no">Not verified</span>
              }
              <span className="badge badge-member">Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="card">
          <div className="card-head"><div className="card-label">Edit profile</div></div>
          <div className="card-body">
            {error && <div className="error-box">{error}</div>}

            <div className="field">
              <div className="field-label">{accountLabel === 'Business' ? 'Company name' : 'Full name'}</div>
              <input
                className="field-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="field-label">Handle</div>
              <div className="handle-wrap">
                <span className="handle-prefix">@</span>
                <input
                  className={`field-input handle-input ${handleErr ? 'err' : ''}`}
                  type="text"
                  placeholder="yourhandle"
                  value={handle}
                  onChange={e => handleChange(e.target.value)}
                  maxLength={30}
                />
              </div>
              {handleErr
                ? <div className="field-err">{handleErr}</div>
                : <div className="field-hint">This is how others see you in deals. Lowercase letters, numbers, and underscores only.</div>
              }
            </div>

            <div className="field">
              <div className="field-label">Avatar colour</div>
              <div className="color-picker">
                {AVATAR_COLORS.map(c => (
                  <div
                    key={c}
                    className={`color-dot ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    role="button"
                    aria-label={`Select colour ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="save-row">
              <button className="btn-save" onClick={save} disabled={saving || !!handleErr}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {saved && (
                <div className="save-confirm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account info — readonly */}
        <div className="card">
          <div className="card-head"><div className="card-label">Account details</div></div>
          <div className="card-body">
            {[
              ['Email',        email,                          true],
              ['Account type', accountLabel,                   false],
              ['Member since', memberSince,                    false],
            ].map(([k, v, mono]) => (
              <div key={String(k)} className="readonly-row">
                <span className="readonly-key">{k}</span>
                <span className={`readonly-val ${mono ? 'mono' : ''}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KYC */}
        {!profile?.kyc_verified && (
          <div className="kyc-card">
            <div className="kyc-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="kyc-body">
              <div className="kyc-title">Verify your identity</div>
              <div className="kyc-desc">
                Identity verification is required before you can fund a vault. It takes about 2 minutes and is only needed once.
                {accountLabel === 'Business' ? ' Business accounts require company registration documents.' : ' Individual accounts require a government-issued ID.'}
              </div>
              <button className="btn-kyc">Start verification</button>
            </div>
          </div>
        )}

        {/* Sign out */}
        <div className="danger-zone">
          <div className="danger-label">
            <strong>Sign out</strong>
            Signed in as {email}
          </div>
          <button className="btn-signout" onClick={signOut}>Sign out</button>
        </div>

      </div>
    </>
  );
}
