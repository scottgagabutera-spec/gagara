'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AccountType = 'individual' | 'business';
type Step = 'type' | 'details' | 'done';

export default function GetStarted() {
  const router = useRouter();
  const [mounted, setMounted]       = useState(false);
  const [step, setStep]             = useState<Step>('type');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [name, setName]             = useState('');
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]           = useState('');
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const p = new URLSearchParams(window.location.search);
    const r = p.get('redirectTo');
    if (r) setRedirectTo(r);
  }, []);

  const handleGoogle = async () => {
    if (!accountType) return;
    setGoogleLoading(true); setError('');
    if (redirectTo) localStorage.setItem('gagara_redirect', redirectTo);
    localStorage.setItem('gagara_account_type', accountType);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      const { data, error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (e) throw e;
      if (data.user) {
        // Update account_type on profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          account_type: accountType,
        });
        setStep('done');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const C = {
    black:'#07070A', surface:'#0D0D12', surface2:'#111118', surface3:'#16161F',
    indigo:'#5B4FE8', indigoL:'#7B70F0', indigoDim:'rgba(91,79,232,0.1)',
    gold:'#C9A84C', goldDim:'rgba(201,168,76,0.08)',
    green:'#5DCC8A', greenDim:'rgba(93,204,138,0.08)',
    red:'#E05252',
    textP:'#F5F5F7', textS:'rgba(245,245,247,0.50)', textF:'rgba(245,245,247,0.20)',
    border:'rgba(245,245,247,0.06)', borderMd:'rgba(245,245,247,0.10)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: ${C.black};
          color: ${C.textP};
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        ::selection { background: rgba(91,79,232,0.25); color:#fff; }
        input::placeholder { color: ${C.textF}; }
        .tb { transition: transform 100ms ease, filter 100ms ease; }
        .tb:active { transform: scale(0.97); filter: brightness(0.9); }

        .glow {
          position: fixed; pointer-events: none; z-index: 0;
          width: 700px; height: 700px; border-radius: 50%;
          top: -300px; left: 50%; transform: translateX(-50%);
          background: radial-gradient(circle, rgba(91,79,232,0.05) 0%, transparent 65%);
        }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(91,79,232,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,79,232,0.02) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          background: rgba(7,7,10,0.88); backdrop-filter: blur(24px);
          border-bottom: 0.5px solid ${C.border};
        }
        .logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: ${C.textP}; text-decoration: none; letter-spacing: -0.3px;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: ${C.textS};
          text-decoration: none; transition: color 0.15s;
        }
        .nav-link:hover { color: ${C.textP}; }

        /* Progress */
        .progress-bar {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 99;
          height: 2px; background: ${C.border};
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, ${C.indigo}, ${C.indigoL});
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
          border-radius: 0 2px 2px 0;
        }

        .center {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 90px 20px 60px;
          position: relative; z-index: 1;
        }

        .panel {
          width: 100%; max-width: 460px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .panel.visible { opacity: 1; transform: translateY(0); }

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: ${C.indigoL};
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .eyebrow-line { width: 20px; height: 1px; background: ${C.indigoL}; }
        .panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800;
          color: ${C.textP}; letter-spacing: -0.8px; line-height: 1.05;
          margin-bottom: 8px;
        }
        .panel-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: ${C.textS}; line-height: 1.6;
          margin-bottom: 28px;
        }

        .card {
          background: ${C.surface};
          border: 0.5px solid ${C.borderMd};
          border-radius: 20px;
          padding: 28px;
          position: relative; overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 220px; height: 0.5px;
          background: linear-gradient(90deg, transparent, ${C.indigoL}, transparent);
        }

        .error-box {
          background: rgba(224,82,82,0.08);
          border: 0.5px solid rgba(224,82,82,0.25);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: ${C.red};
          margin-bottom: 16px; line-height: 1.5;
        }

        /* Account type cards */
        .type-grid { display: flex; flex-direction: column; gap: 10px; }
        .type-card {
          padding: 18px 20px;
          border: 0.5px solid ${C.borderMd};
          border-radius: 14px;
          background: ${C.surface2};
          cursor: pointer; transition: all 0.15s;
          display: flex; align-items: center; gap: 16px;
          text-align: left; width: 100%;
        }
        .type-card:hover { border-color: rgba(91,79,232,0.3); background: ${C.surface3}; }
        .type-card.selected {
          border-color: rgba(91,79,232,0.5);
          background: ${C.indigoDim};
        }
        .type-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: ${C.surface3}; border: 0.5px solid ${C.border};
          display: flex; align-items: center; justify-content: center;
          color: ${C.textS}; flex-shrink: 0; transition: all 0.15s;
        }
        .type-card.selected .type-icon {
          background: ${C.indigoDim};
          border-color: rgba(91,79,232,0.3);
          color: ${C.indigoL};
        }
        .type-body { flex: 1; min-width: 0; }
        .type-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          color: ${C.textP}; letter-spacing: -0.2px; margin-bottom: 3px;
        }
        .type-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: ${C.textS}; line-height: 1.5;
        }
        .type-badge {
          font-family: 'DM Mono', monospace;
          font-size: 9px; padding: 3px 9px; border-radius: 5px;
          flex-shrink: 0;
          color: ${C.indigoL}; background: ${C.indigoDim};
          border: 0.5px solid rgba(91,79,232,0.2);
        }

        /* Auth buttons */
        .auth-btns { display: flex; flex-direction: column; gap: 10px; margin-bottom: 0; }
        .btn-google {
          width: 100%; padding: 13px 16px;
          border-radius: 12px;
          border: 0.5px solid ${C.borderMd};
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-google:disabled { opacity: 0.7; cursor: wait; }

        .btn-email-toggle {
          width: 100%; padding: 13px 16px;
          border-radius: 12px;
          border: 0.5px solid ${C.borderMd};
          background: transparent; color: ${C.textS};
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.15s;
        }
        .btn-email-toggle:hover { color: ${C.textP}; background: ${C.surface2}; }

        .divider {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }
        .divider-line { flex: 1; height: 0.5px; background: ${C.border}; }
        .divider-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: ${C.textF}; letter-spacing: 0.1em;
        }

        .fields { display: flex; flex-direction: column; gap: 10px; }
        .field-input {
          width: 100%; padding: 13px 16px;
          background: ${C.surface2};
          border: 0.5px solid ${C.borderMd};
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: ${C.textP};
          outline: none; transition: border-color 0.15s;
        }
        .field-input:focus { border-color: rgba(91,79,232,0.5); }

        .btn-primary {
          width: 100%; padding: 14px;
          border-radius: 12px;
          background: ${C.indigo}; color: #fff; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
          box-shadow: 0 4px 20px rgba(91,79,232,0.3);
        }
        .btn-primary:hover { background: ${C.indigoL}; }
        .btn-primary:disabled { opacity: 0.7; cursor: wait; }

        .btn-continue {
          width: 100%; padding: 14px;
          border-radius: 12px;
          background: ${C.indigo}; color: #fff; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
          box-shadow: 0 4px 20px rgba(91,79,232,0.3);
          margin-top: 20px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-continue:hover:not(:disabled) { background: ${C.indigoL}; }
        .btn-continue:disabled { opacity: 0.35; cursor: not-allowed; }

        .panel-foot {
          text-align: center; margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: ${C.textS};
        }
        .panel-foot a { color: ${C.indigoL}; text-decoration: none; font-weight: 500; }

        .kyc-note {
          margin-top: 20px; padding: 12px 16px;
          background: rgba(201,168,76,0.05);
          border: 0.5px solid rgba(201,168,76,0.12);
          border-radius: 10px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .kyc-note svg { color: ${C.gold}; flex-shrink: 0; margin-top: 1px; }
        .kyc-note-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: ${C.textS}; line-height: 1.6;
        }

        /* Done state */
        .done-box {
          text-align: center;
          padding: 40px 28px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .done-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: ${C.greenDim};
          border: 0.5px solid rgba(93,204,138,0.25);
          display: flex; align-items: center; justify-content: center;
          color: ${C.green};
        }
        .done-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800;
          color: ${C.textP}; letter-spacing: -0.5px;
        }
        .done-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: ${C.textS}; line-height: 1.6;
          max-width: 300px;
        }
        .btn-dashboard {
          padding: 12px 28px; border-radius: 12px;
          background: ${C.indigo}; color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s; text-decoration: none;
          display: inline-block;
        }
        .btn-dashboard:hover { background: ${C.indigoL}; }

        @media (max-width: 480px) {
          .topbar { padding: 0 20px; }
          .card { padding: 20px; }
        }
      `}</style>

      <div className="grid-bg" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      {/* Progress */}
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-fill" style={{
          width: step === 'type' ? '33%' : step === 'details' ? '66%' : '100%'
        }} />
      </div>

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
        <a href={redirectTo ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : '/sign-in'} className="nav-link">
          Sign in
        </a>
      </nav>

      <div className="center">
        <div className={`panel ${mounted ? 'visible' : ''}`}>

          {/* ── STEP 1: ACCOUNT TYPE ── */}
          {step === 'type' && (
            <>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                Step 1 of 2
              </div>
              <div className="panel-title">Who are you on Gagara?</div>
              <div className="panel-sub">
                This is permanent and determines your identity verification requirements. Your deal mode is chosen separately each time.
              </div>

              <div className="type-grid">
                <button
                  className={`type-card tb ${accountType === 'individual' ? 'selected' : ''}`}
                  onClick={() => setAccountType('individual')}
                >
                  <div className="type-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                  <div className="type-body">
                    <div className="type-title">Individual</div>
                    <div className="type-desc">Freelancers, contractors, personal users, sole traders. Verified with government ID.</div>
                  </div>
                  <span className="type-badge">Personal</span>
                </button>

                <button
                  className={`type-card tb ${accountType === 'business' ? 'selected' : ''}`}
                  onClick={() => setAccountType('business')}
                >
                  <div className="type-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  </div>
                  <div className="type-body">
                    <div className="type-title">Business</div>
                    <div className="type-desc">Registered companies, startups, agencies, NGOs, SMBs. Verified with company registration.</div>
                  </div>
                  <span className="type-badge">Organisation</span>
                </button>
              </div>

              <button
                className="btn-continue tb"
                disabled={!accountType}
                onClick={() => setStep('details')}
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <div className="panel-foot">
                Already have an account?{' '}
                <a href={redirectTo ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : '/sign-in'}>Sign in</a>
              </div>
            </>
          )}

          {/* ── STEP 2: SIGN UP ── */}
          {step === 'details' && (
            <>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                Step 2 of 2 · {accountType === 'individual' ? 'Individual account' : 'Business account'}
              </div>
              <div className="panel-title">Create your account</div>
              <div className="panel-sub">Sign up with Google for the fastest start, or use email and password.</div>

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

                  <button className="btn-email-toggle tb" onClick={() => {}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                    </svg>
                    Sign up with email
                  </button>
                </div>

                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">EMAIL SIGNUP</span>
                  <div className="divider-line" />
                </div>

                <div className="fields">
                  <input
                    className="field-input"
                    type="text"
                    placeholder={accountType === 'individual' ? 'Full name' : 'Company name'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <input
                    className="field-input"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  />
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  />
                  <button className="btn-primary tb" onClick={handleSignup} disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </div>
              </div>

              <div className="kyc-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div className="kyc-note-text">
                  Identity verification is only required when you fund a vault for the first time. Explore freely until then.
                </div>
              </div>

              <div className="panel-foot">
                <button
                  onClick={() => setStep('type')}
                  style={{background:'none',border:'none',color:'rgba(245,245,247,0.50)',fontSize:'13px',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}
                >
                  ← Change account type
                </button>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <div className="card">
              <div className="done-box">
                <div className="done-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="done-title">Account created</div>
                <div className="done-desc">
                  Check your email to confirm your address, then go to your dashboard.
                </div>
                <a href={redirectTo || '/dashboard'} className="btn-dashboard">
                  Go to dashboard
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
