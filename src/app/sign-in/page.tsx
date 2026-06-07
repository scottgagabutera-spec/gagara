'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  black:'#07070A', surface:'#0D0D12', surface2:'#111118', surface3:'#16161F',
  indigo:'#5B4FE8', indigoL:'#7B70F0', indigoDim:'rgba(91,79,232,0.1)',
  gold:'#C9A84C', green:'#5DCC8A', red:'#E05252',
  textP:'#F5F5F7', textB:'rgba(245,245,247,0.72)', textS:'rgba(245,245,247,0.50)',
  textL:'rgba(245,245,247,0.38)', textF:'rgba(245,245,247,0.20)',
  border:'rgba(245,245,247,0.06)', borderMd:'rgba(245,245,247,0.10)',
};

export default function SignIn() {
  const router = useRouter();
  const [mounted, setMounted]             = useState(false);
  const [checking, setChecking]           = useState(true);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmail, setShowEmail]         = useState(false);
  const [error, setError]                 = useState('');
  const [redirectTo, setRedirectTo]       = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const p = new URLSearchParams(window.location.search);
    const r = p.get('redirectTo');
    if (r) setRedirectTo(r);

    // If already signed in, skip the sign-in page entirely
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(r || '/dashboard');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleGoogle = async () => {
    setGoogleLoading(true); setError('');
    if (redirectTo) localStorage.setItem('gagara_redirect', redirectTo);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  const handleEmail = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) throw e;
      if (data.user) router.push(redirectTo || '/dashboard');
    } catch (e: any) {
      setError(e.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while checking session
  if (checking) return (
    <div style={{ minHeight:'100vh', background:C.black, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'32px', height:'32px', border:'2px solid rgba(245,245,247,0.08)', borderTopColor:'#7B70F0', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { background: ${C.black}; color: ${C.textP}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: rgba(91,79,232,0.25); color: #fff; }
        input::placeholder { color: ${C.textF}; }
        .tb { transition: transform 100ms ease, filter 100ms ease; }
        .tb:active { transform: scale(0.97); filter: brightness(0.9); }
        .glow { position: fixed; pointer-events: none; z-index: 0; width: 700px; height: 700px; border-radius: 50%; top: -300px; left: 50%; transform: translateX(-50%); background: radial-gradient(circle, rgba(91,79,232,0.05) 0%, transparent 65%); }
        .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(91,79,232,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(91,79,232,0.02) 1px, transparent 1px); background-size: 72px 72px; }
        .topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: rgba(7,7,10,0.88); backdrop-filter: blur(24px); border-bottom: 0.5px solid ${C.border}; }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: ${C.textP}; text-decoration: none; letter-spacing: -0.3px; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-size: 13px; color: ${C.textS}; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: ${C.textP}; }
        .center { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 20px; position: relative; z-index: 1; }
        .panel { width: 100%; max-width: 420px; opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .panel.visible { opacity: 1; transform: translateY(0); }
        .panel-head { text-align: center; margin-bottom: 36px; }
        .panel-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.indigoL}; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .eyebrow-line { width: 20px; height: 1px; background: ${C.indigoL}; }
        .panel-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: ${C.textP}; letter-spacing: -0.8px; margin-bottom: 8px; }
        .panel-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: ${C.textS}; line-height: 1.6; }
        .card { background: ${C.surface}; border: 0.5px solid ${C.borderMd}; border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 220px; height: 0.5px; background: linear-gradient(90deg, transparent, ${C.indigoL}, transparent); }
        .error-box { background: rgba(224,82,82,0.08); border: 0.5px solid rgba(224,82,82,0.25); border-radius: 10px; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: ${C.red}; margin-bottom: 16px; line-height: 1.5; }
        .auth-btns { display: flex; flex-direction: column; gap: 10px; }
        .btn-google { width: 100%; padding: 13px 16px; border-radius: 12px; border: 0.5px solid ${C.borderMd}; background: #fff; color: #1a1a1a; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-google:disabled { opacity: 0.7; cursor: wait; }
        .btn-email-toggle { width: 100%; padding: 13px 16px; border-radius: 12px; border: 0.5px solid ${C.borderMd}; background: transparent; color: ${C.textS}; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.15s; }
        .btn-email-toggle:hover { color: ${C.textP}; background: ${C.surface2}; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider-line { flex: 1; height: 0.5px; background: ${C.border}; }
        .divider-text { font-family: 'DM Mono', monospace; font-size: 9px; color: ${C.textF}; letter-spacing: 0.1em; }
        .email-fields { display: flex; flex-direction: column; gap: 10px; }
        .field-input { width: 100%; padding: 13px 16px; background: ${C.surface2}; border: 0.5px solid ${C.borderMd}; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: ${C.textP}; outline: none; transition: border-color 0.15s; }
        .field-input:focus { border-color: rgba(91,79,232,0.5); }
        .btn-signin { width: 100%; padding: 14px; border-radius: 12px; background: ${C.indigo}; color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; box-shadow: 0 4px 20px rgba(91,79,232,0.3); }
        .btn-signin:hover { background: ${C.indigoL}; }
        .btn-signin:disabled { opacity: 0.7; cursor: wait; }
        .panel-foot { text-align: center; margin-top: 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: ${C.textS}; }
        .panel-foot a { color: ${C.indigoL}; text-decoration: none; font-weight: 500; }
        .panel-foot a:hover { text-decoration: underline; }
        .kyc-note { margin-top: 20px; padding: 12px 16px; background: rgba(201,168,76,0.05); border: 0.5px solid rgba(201,168,76,0.12); border-radius: 10px; display: flex; gap: 10px; align-items: flex-start; }
        .kyc-note svg { color: ${C.gold}; flex-shrink: 0; margin-top: 1px; }
        .kyc-note-text { font-family: 'DM Sans', sans-serif; font-size: 11px; color: ${C.textS}; line-height: 1.6; }
        @media (max-width: 480px) { .topbar { padding: 0 20px; } .card { padding: 20px; } }
      `}</style>

      <div className="grid-bg" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      <nav className="topbar">
        <a href="/" className="logo">
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
        <a href={redirectTo ? `/get-started?redirectTo=${encodeURIComponent(redirectTo)}` : '/get-started'} className="nav-link">
          Create account
        </a>
      </nav>

      <div className="center">
        <div className={`panel ${mounted ? 'visible' : ''}`}>
          <div className="panel-head">
            <div className="panel-eyebrow">
              <span className="eyebrow-line" />
              Welcome back
              <span className="eyebrow-line" />
            </div>
            <div className="panel-title">Sign in to Gagara</div>
            <div className="panel-sub">Continue to your dashboard and active agreements</div>
          </div>

          <div className="card">
            {error && <div className="error-box">{error}</div>}
            <div className="auth-btns">
              <button className="btn-google tb" onClick={handleGoogle} disabled={googleLoading}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? 'Redirecting…' : 'Continue with Google'}
              </button>
              <button className="btn-email-toggle tb" onClick={() => setShowEmail(v => !v)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                </svg>
                Continue with email
              </button>
            </div>

            {showEmail && (
              <>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">OR</span>
                  <div className="divider-line" />
                </div>
                <div className="email-fields">
                  <input className="field-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} autoFocus />
                  <input className="field-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} />
                  <button className="btn-signin tb" onClick={handleEmail} disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="panel-foot">
            No account?{' '}
            <a href={redirectTo ? `/get-started?redirectTo=${encodeURIComponent(redirectTo)}` : '/get-started'}>
              Get started free
            </a>
          </div>

          <div className="kyc-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div className="kyc-note-text">
              You can explore Gagara and create agreements freely. Identity verification is only required when you secure your first agreement with funds.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
