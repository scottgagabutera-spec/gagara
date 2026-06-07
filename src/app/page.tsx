'use client';

import { useState, useEffect } from 'react';

export default function GagaraHome() {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const timers = [
      setTimeout(() => setPhase(1), 2500),
      setTimeout(() => setPhase(2), 5000),
      setTimeout(() => setPhase(3), 7500),
      setTimeout(() => setPhase(4), 9500),
      setTimeout(() => setPhase(0), 13000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [mounted, phase === 0 ? phase : null]);

  const funded    = phase >= 1;
  const working   = phase >= 2;
  const confirmed = phase >= 3;
  const released  = phase >= 4;

  const auditLog = [
    { t: '09:12', e: 'Deal created',             a: '@gaga'           },
    { t: '09:15', e: 'Both parties connected',    a: '@client joined'  },
    ...(funded    ? [{ t: '09:23', e: '$800 deposited to vault', a: '@gaga'           }] : []),
    ...(working   ? [{ t: '10:44', e: 'Milestone 1 complete',    a: '@client'         }] : []),
    ...(confirmed ? [{ t: '11:02', e: 'Confirmed by payer',      a: '@gaga'           }] : []),
    ...(released  ? [{ t: '11:02', e: '$800 released',           a: 'via Interledger' }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:      #050508;
          --surface:    #0B0B14;
          --surface2:   #0F0F1A;
          --surface3:   #141422;
          --surface4:   #1A1A2C;
          --indigo:     #5448E4;
          --indigo-l:   #7268ED;
          --indigo-dim: rgba(84,72,228,0.1);
          --gold:       #C4A052;
          --gold-dim:   rgba(196,160,82,0.07);
          --green:      #2BA86A;
          --green-dim:  rgba(43,168,106,0.09);

          --text-primary:   rgba(238,238,248,0.92);
          --text-body:      rgba(238,238,248,0.78);
          --text-secondary: rgba(238,238,248,0.58);
          --text-label:     rgba(238,238,248,0.48);
          --text-faint:     rgba(238,238,248,0.22);

          --border:     rgba(238,238,248,0.07);
          --border-md:  rgba(238,238,248,0.11);

          --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 20px; --r-2xl: 24px;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--text-primary);
          font-family: 'Figtree', sans-serif;
          font-size: 16px; line-height: 1;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          max-width: 100%;
        }

        ::selection { background: rgba(84,72,228,0.25); color: #fff; }

        body::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 256px;
        }
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(84,72,228,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(84,72,228,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .glow-1 { position: fixed; pointer-events: none; z-index: 0; width: 900px; height: 900px; border-radius: 50%; top: -500px; right: -350px; background: radial-gradient(circle, rgba(84,72,228,0.04) 0%, transparent 60%); }
        .glow-2 { position: fixed; pointer-events: none; z-index: 0; width: 700px; height: 700px; border-radius: 50%; bottom: -350px; left: -250px; background: radial-gradient(circle, rgba(196,160,82,0.025) 0%, transparent 60%); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 400; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(5,5,8,0.88); backdrop-filter: blur(40px) saturate(1.5);
          border-bottom: 0.5px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); text-decoration: none; letter-spacing: -0.2px; flex-shrink: 0; }
        .nav-links { display: flex; gap: 40px; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-links a { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 400; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; white-space: nowrap; }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-actions { display: flex; gap: 8px; align-items: center; }
        .btn-ghost { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 400; color: var(--text-secondary); background: none; border: none; padding: 9px 16px; border-radius: var(--r-sm); cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { color: var(--text-primary); background: rgba(238,238,248,0.04); }
        .btn-primary { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 500; background: var(--indigo); color: #fff; border: none; padding: 10px 22px; border-radius: var(--r-sm); cursor: pointer; letter-spacing: -0.1px; transition: background 0.15s, transform 0.1s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: var(--indigo-l); }
        .btn-primary:active { transform: scale(0.98); }

        .hero { position: relative; z-index: 1; min-height: 100svh; display: flex; flex-direction: column; justify-content: center; padding: 96px 48px 80px; max-width: 1280px; margin: 0 auto; }
        .hero-tag { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; color: var(--indigo-l); margin-bottom: 40px; display: flex; align-items: center; gap: 12px; opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .hero-tag-line { width: 24px; height: 1px; background: var(--indigo-l); flex-shrink: 0; }
        .hero-h1 { font-family: 'Fraunces', serif; font-size: clamp(44px, 5.5vw, 72px); font-weight: 300; line-height: 0.92; letter-spacing: -3px; color: var(--text-primary); opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
        .hero-h1 em { font-style: italic; font-weight: 300; color: var(--indigo-l); }
        .hero-rule { width: 100%; height: 0.5px; margin: 48px 0; background: linear-gradient(90deg, var(--indigo), rgba(84,72,228,0.06), transparent); opacity: 0; animation: fadeUp 0.6s ease 0.42s forwards; }
        .hero-body { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: end; opacity: 0; animation: fadeUp 0.7s ease 0.52s forwards; }
        .hero-desc { font-family: 'Figtree', sans-serif; font-size: 17px; font-weight: 400; color: var(--text-body); line-height: 1.72; max-width: 420px; }
        .hero-desc strong { color: var(--text-primary); font-weight: 600; }
        .hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 32px; }
        .hero-stats { display: flex; gap: 40px; }
        .stat-val { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 300; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1; margin-bottom: 8px; }
        .stat-val span { color: var(--indigo-l); }
        .stat-label { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-secondary); line-height: 1.5; }
        .hero-actions { display: flex; gap: 12px; align-items: center; }
        .btn-link { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 400; color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 10px 0; transition: color 0.15s; text-decoration: none; display: inline-block; }
        .btn-link:hover { color: var(--text-primary); }

        .page-max { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; overflow: hidden; }

        .section { padding: 96px 48px; }
        .sec-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--indigo-l); margin-bottom: 16px; }
        .sec-h2 { font-family: 'Fraunces', serif; font-size: clamp(32px, 3.5vw, 48px); font-weight: 300; line-height: 0.96; letter-spacing: -1.8px; color: var(--text-primary); margin-bottom: 16px; }
        .sec-h2 em { font-style: italic; color: var(--indigo-l); }
        .sec-desc { font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 400; color: var(--text-body); line-height: 1.72; max-width: 500px; margin-bottom: 56px; }
        .divider { height: 0.5px; background: var(--border); position: relative; z-index: 1; }

        .vault-wrap { padding: 0 48px 96px; width: 100%; }
        .vault-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 8px; }
        .vault-meta-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-label); display: flex; align-items: center; gap: 12px; }
        .vault-meta-label::before { content: ''; width: 20px; height: 0.5px; background: var(--text-label); flex-shrink: 0; }
        .vault-deal-id { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--indigo-l); letter-spacing: 0.06em; }
        .vault-card { border: 0.5px solid var(--border-md); border-radius: var(--r-2xl); overflow: hidden; background: var(--surface); width: 100%; }

        /* Unified vault — works on all screen sizes */
        .uv-parties { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 28px 32px; gap: 16px; border-bottom: 0.5px solid var(--border); }
        .uv-party { display: flex; align-items: center; gap: 14px; }
        .uv-party.right { flex-direction: row-reverse; }
        .uv-avatar { width: 44px; height: 44px; min-width: 44px; border-radius: var(--r-md); background: var(--surface4); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); transition: border-color 0.5s; flex-shrink: 0; }
        .uv-avatar.active { border-color: rgba(84,72,228,0.6); box-shadow: 0 0 0 3px rgba(84,72,228,0.08); }
        .uv-avatar.done   { border-color: rgba(43,168,106,0.6); box-shadow: 0 0 0 3px rgba(43,168,106,0.08); }
        .uv-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .uv-party.right .uv-info { align-items: flex-end; text-align: right; }
        .uv-role { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); }
        .uv-name { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uv-verified { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--green); display: flex; align-items: center; gap: 4px; }
        .uv-party.right .uv-verified { flex-direction: row-reverse; }
        .uv-state { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); transition: color 0.4s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .uv-state.active { color: var(--indigo-l); }
        .uv-state.done   { color: var(--green); }

        /* Center vault indicator */
        .uv-center { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
        .uv-center-line { width: 1px; height: 16px; position: relative; overflow: hidden; background: var(--border); }
        .uv-flow { position: absolute; top: 0; left: 0; right: 0; height: 6px; animation: uvFlow 1.6s linear infinite; opacity: 0; transition: opacity 0.4s; }
        .uv-flow.active { opacity: 1; }
        .uv-flow.indigo { background: linear-gradient(to bottom, transparent, var(--indigo-l), transparent); }
        .uv-flow.green  { background: linear-gradient(to bottom, transparent, var(--green), transparent); }
        @keyframes uvFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
        .uv-lock-wrap { width: 40px; height: 40px; border-radius: 50%; background: var(--surface3); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; transition: all 0.5s; flex-shrink: 0; }
        .uv-lock-wrap.active { background: var(--indigo-dim); border-color: rgba(84,72,228,0.4); }
        .uv-lock-wrap.done   { background: var(--green-dim);  border-color: rgba(43,168,106,0.4); }
        .uv-label { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.08em; color: var(--text-faint); text-align: center; white-space: nowrap; }

        /* Amount row */
        .uv-amount-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 0.5px solid var(--border); flex-wrap: wrap; gap: 12px; }
        .uv-amount { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 300; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1; transition: color 0.5s; }
        .uv-amount.released { color: var(--green); }
        .uv-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 11px; border-radius: 5px; transition: all 0.4s; flex-shrink: 0; }
        .uv-badge.pending  { color: var(--text-faint); background: rgba(238,238,248,0.03); border: 0.5px solid var(--border); }
        .uv-badge.locked   { color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(84,72,228,0.2); }
        .uv-badge.released { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(43,168,106,0.2); }

        /* Event log */
        .uv-log { display: flex; flex-direction: column; }
        .uv-event { display: flex; align-items: center; gap: 12px; padding: 13px 32px; border-bottom: 0.5px solid var(--border); transition: background 0.3s; }
        .uv-event:last-child { border-bottom: none; }
        .uv-event.active { background: rgba(84,72,228,0.03); }
        .uv-event-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--border-md); transition: all 0.4s; }
        .uv-event.done   .uv-event-dot { background: var(--green); }
        .uv-event.active .uv-event-dot { background: var(--indigo-l); animation: uvPulse 1.4s ease-in-out infinite; }
        .uv-event-text { font-family: 'Figtree', sans-serif; font-size: 12px; color: var(--text-secondary); flex: 1; transition: color 0.3s; min-width: 0; }
        .uv-event.active .uv-event-text { color: var(--text-primary); font-weight: 500; }
        .uv-event.done   .uv-event-text { color: var(--text-secondary); }
        .uv-event-time { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); white-space: nowrap; flex-shrink: 0; }
        .uv-footer { padding: 12px 32px; display: flex; justify-content: space-between; align-items: center; border-top: 0.5px solid var(--border); flex-wrap: wrap; gap: 8px; }
        .uv-footer-id { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.08em; }
        .uv-footer-note { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--indigo-l); letter-spacing: 0.04em; }
        @keyframes uvPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.5); } }

        /* Hide old vault classes */
        .vault-mobile { display: none !important; }
        .vault-cols   { display: none !important; }

                .audit { border-top: 0.5px solid var(--border); background: rgba(5,5,8,0.6); border-radius: 0 0 var(--r-2xl) var(--r-2xl); padding: 20px 36px; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; width: 100%; }
        .audit::-webkit-scrollbar { display: none; }
        .audit-item { flex-shrink: 0; padding-right: 32px; margin-right: 32px; border-right: 0.5px solid var(--border); display: flex; flex-direction: column; gap: 3px; opacity: 0; animation: fadeUp 0.3s ease forwards; }
        .audit-item:last-child { border-right: none; padding-right: 0; margin-right: 0; }
        .ai-time  { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); }
        .ai-event { font-family: 'Figtree', sans-serif; font-size: 12px; color: var(--text-body); font-weight: 400; }
        .ai-actor { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--indigo-l); }

        /* Real stories section */
        .stories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 0.5px solid var(--border); border-radius: var(--r-2xl); overflow: hidden; margin-bottom: 0; }
        .story-card { background: var(--surface); padding: 40px 32px; position: relative; overflow: hidden; }
        .story-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--indigo); opacity: 0.4; }
        .story-num { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.12em; margin-bottom: 24px; }
        .story-situation { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 300; color: var(--text-primary); letter-spacing: -0.4px; margin-bottom: 14px; line-height: 1.2; }
        .story-situation em { font-style: italic; color: var(--indigo-l); }
        .story-body { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-body); line-height: 1.7; margin-bottom: 20px; }
        .story-outcome { display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--green); letter-spacing: 0.06em; }
        .story-outcome-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

        .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); position: relative; }
        .steps-grid::before { content: ''; position: absolute; top: 29px; left: 29px; right: 29px; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(84,72,228,0.35) 10%, rgba(84,72,228,0.35) 90%, transparent); z-index: 0; }
        .step { display: flex; flex-direction: column; align-items: flex-start; padding-right: 20px; position: relative; z-index: 1; }
        .step-icon { width: 58px; height: 58px; border-radius: var(--r-md); background: var(--surface2); border: 0.5px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--text-faint); transition: all 0.3s; }
        .step.active .step-icon { background: var(--indigo-dim); border-color: rgba(84,72,228,0.3); color: var(--indigo-l); }
        .step.done   .step-icon { background: var(--green-dim);  border-color: rgba(43,168,106,0.25); color: var(--green); }
        .step-num   { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.12em; margin-bottom: 6px; }
        .step-title { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
        .step-desc  { font-family: 'Figtree', sans-serif; font-size: 12px; font-weight: 400; color: var(--text-secondary); line-height: 1.55; }

        .modes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 0.5px solid var(--border); border-radius: var(--r-2xl); overflow: hidden; }
        .mode-card { background: var(--surface); padding: 44px 36px; position: relative; overflow: hidden; transition: background 0.2s; }
        .mode-card:hover { background: var(--surface2); }
        .mode-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--indigo); opacity: 0; transition: opacity 0.2s; }
        .mode-card:hover::before { opacity: 1; }
        .mode-card.gold-card::before { background: var(--gold); }
        .mc-n     { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.12em; margin-bottom: 24px; }
        .mc-icon  { width: 44px; height: 44px; border-radius: var(--r-md); background: var(--surface3); border: 0.5px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .mc-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 300; color: var(--text-primary); letter-spacing: -0.6px; margin-bottom: 10px; line-height: 1; }
        .mc-desc  { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-body); line-height: 1.65; margin-bottom: 20px; }
        .mc-range { display: inline-flex; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--gold); background: var(--gold-dim); border: 0.5px solid rgba(196,160,82,0.15); padding: 4px 10px; border-radius: 5px; margin-bottom: 20px; letter-spacing: 0.04em; }
        .mc-list  { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .mc-list li { font-family: 'Figtree', sans-serif; font-size: 12px; font-weight: 400; color: var(--text-secondary); line-height: 1.4; display: flex; align-items: flex-start; gap: 9px; }
        .mc-list li::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--indigo-l); flex-shrink: 0; margin-top: 6px; }

        .payout-table { border: 0.5px solid var(--border); border-radius: var(--r-2xl); overflow: hidden; }
        .pt-head { display: grid; grid-template-columns: 1fr auto; padding: 13px 32px; background: rgba(84,72,228,0.04); border-bottom: 0.5px solid var(--border); }
        .pt-head span { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); }
        .pt-row { display: grid; grid-template-columns: 1fr auto; padding: 22px 32px; gap: 24px; border-bottom: 0.5px solid var(--border); align-items: center; transition: background 0.15s; }
        .pt-row:last-child { border-bottom: none; }
        .pt-row:hover { background: var(--surface2); }
        .pt-method { font-family: 'Figtree', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 3px; }
        .pt-desc   { font-family: 'Figtree', sans-serif; font-size: 12px; font-weight: 400; color: var(--text-secondary); }
        .pt-speed  { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; color: var(--green); white-space: nowrap; text-align: right; }
        .pt-speed.slow { color: var(--text-secondary); }

        .closing { padding: 0 48px 120px; }
        .closing-box { background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-2xl); padding: 88px 72px; text-align: center; position: relative; overflow: hidden; }
        .closing-box::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 440px; height: 0.5px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .closing-box::after  { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 0%, rgba(84,72,228,0.035) 0%, transparent 55%); }
        .cb-inner { position: relative; z-index: 1; }
        .cb-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 36px; display: flex; align-items: center; justify-content: center; gap: 14px; }
        .cb-tag::before, .cb-tag::after { content: ''; flex: 1; max-width: 44px; height: 0.5px; background: var(--gold); opacity: 0.3; }
        .cb-h { font-family: 'Fraunces', serif; font-size: clamp(32px, 3.5vw, 48px); font-weight: 300; line-height: 0.96; letter-spacing: -2px; color: var(--text-primary); max-width: 720px; margin: 0 auto 20px; }
        .cb-h em { font-style: italic; color: var(--indigo-l); }
        .cb-p { font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 400; color: var(--text-body); line-height: 1.72; max-width: 480px; margin: 0 auto 44px; }
        .cb-btns { display: flex; gap: 12px; justify-content: center; align-items: center; margin-bottom: 44px; }
        .cb-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .cb-tag-item { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.07em; color: var(--text-label); background: rgba(238,238,248,0.03); border: 0.5px solid var(--border-md); padding: 5px 11px; border-radius: 5px; }

        footer { position: relative; z-index: 1; border-top: 0.5px solid var(--border); padding: 40px 48px; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .f-logo { display: flex; align-items: center; gap: 10px; font-family: 'Figtree', sans-serif; font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .f-nav  { display: flex; gap: 28px; list-style: none; }
        .f-nav a { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 400; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
        .f-nav a:hover { color: var(--text-primary); }
        .f-copy { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.06em; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes wirePulse { 0% { stroke-dashoffset: 100; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        .wire-pulse-anim   { stroke-dasharray: 24 76; animation: wirePulse 1.8s linear infinite; }
        .wire-pulse-anim-r { stroke-dasharray: 24 76; animation: wirePulse 1.8s linear 0.9s infinite; }

        /* Mobile vault — hidden on desktop, shown on mobile */
        .vault-mobile { display: none; border-radius: var(--r-2xl) var(--r-2xl) 0 0; overflow: hidden; }

        /* Transaction card — two parties */
        .vtc-parties { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 24px 20px; gap: 12px; }
        .vtc-party { display: flex; flex-direction: column; gap: 6px; }
        .vtc-party.right { align-items: flex-end; text-align: right; }
        .vtc-role { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-faint); }
        .vtc-avatar { width: 44px; height: 44px; border-radius: var(--r-md); background: var(--surface4); border: 0.5px solid var(--border-md); display: flex; align-items: center; justify-content: center; font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 600; color: var(--text-primary); transition: border-color 0.4s; }
        .vtc-avatar.funded { border-color: rgba(84,72,228,0.5); }
        .vtc-avatar.done   { border-color: rgba(43,168,106,0.5); }
        .vtc-name { font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .vtc-verified { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--green); display: flex; align-items: center; gap: 4px; }
        .vtc-party.right .vtc-verified { justify-content: flex-end; }
        .vtc-arrow { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .vtc-arrow-line { width: 1px; height: 20px; background: var(--border); position: relative; overflow: hidden; }
        .vtc-arrow-pulse { position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(to bottom, transparent, var(--indigo-l), transparent); animation: vtcFlow 1.8s linear infinite; opacity: 0; transition: opacity 0.4s; }
        .vtc-arrow-pulse.active { opacity: 1; }
        .vtc-arrow-pulse.green { background: linear-gradient(to bottom, transparent, var(--green), transparent); }
        .vtc-arrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-md); transition: all 0.4s; flex-shrink: 0; }
        .vtc-arrow-dot.active { background: var(--indigo-l); }
        .vtc-arrow-dot.done   { background: var(--green); }
        @keyframes vtcFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
        .vtc-amount-wrap { border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        .vtc-amount { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 300; letter-spacing: -1.5px; color: var(--text-primary); transition: color 0.5s; line-height: 1; }
        .vtc-amount.released { color: var(--green); }
        .vtc-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 10px; border-radius: 5px; transition: all 0.4s; }
        .vtc-badge.locked   { color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(84,72,228,0.2); }
        .vtc-badge.released { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(43,168,106,0.2); }
        .vtc-badge.pending  { color: var(--text-faint); background: rgba(238,238,248,0.03); border: 0.5px solid var(--border); }
        .vtc-timeline { display: flex; flex-direction: column; }
        .vtc-event { display: flex; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 0.5px solid var(--border); transition: background 0.3s; }
        .vtc-event:last-child { border-bottom: none; }
        .vtc-event.active { background: rgba(84,72,228,0.03); }
        .vtc-event-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--border-md); transition: all 0.4s; }
        .vtc-event.active .vtc-event-dot { background: var(--indigo-l); animation: vtcPulse 1.4s ease-in-out infinite; }
        .vtc-event.done   .vtc-event-dot { background: var(--green); }
        .vtc-event-text { font-family: 'Figtree', sans-serif; font-size: 12px; color: var(--text-secondary); flex: 1; transition: color 0.3s; }
        .vtc-event.active .vtc-event-text { color: var(--text-primary); font-weight: 500; }
        .vtc-event-time { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); white-space: nowrap; }
        .vtc-id { padding: 10px 20px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.08em; border-top: 0.5px solid var(--border); display: flex; justify-content: space-between; }
        .vtc-id-note { color: var(--indigo-l); }
        @keyframes vtcPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.5); } }

        @media (max-width: 1024px) {
          .nav { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 88px 24px 64px; }
          .hero-body { grid-template-columns: 1fr; gap: 40px; }
          .hero-right { align-items: flex-start; }
          .hero-stats { gap: 28px; }
          .vault-wrap { padding: 0 16px 80px; }
          .vault-wrap { padding: 0 16px 80px; }
          .uv-parties { padding: 20px 16px; gap: 8px; }
          .uv-avatar { width: 36px; height: 36px; min-width: 36px; font-size: 14px; }
          .uv-amount-row { padding: 16px; }
          .uv-amount { font-size: 32px; }
          .uv-event { padding: 12px 16px; }
          .uv-footer { padding: 10px 16px; }
          .audit { padding: 16px 20px; }
          .section { padding: 64px 24px; }
          .steps-grid { grid-template-columns: 1fr; gap: 0; }
          .steps-grid::before { display: none; }
          .step { flex-direction: row; align-items: flex-start; gap: 16px; padding: 16px 0; padding-right: 0; border-bottom: 0.5px solid var(--border); }
          .step:last-child { border-bottom: none; }
          .step-icon { width: 40px; height: 40px; min-width: 40px; margin-bottom: 0; flex-shrink: 0; }
          .step-num { margin-bottom: 4px; }
          .modes-grid { grid-template-columns: 1fr; }
          .stories-grid { grid-template-columns: 1fr; }
          .closing { padding: 0 16px 80px; }
          .closing-box { padding: 48px 24px; }
          .cb-btns { flex-direction: column; }
          footer { flex-direction: column; gap: 24px; padding: 40px 24px; text-align: center; }
          .f-nav { flex-wrap: wrap; justify-content: center; }
        }

        @media (max-width: 480px) {
          .hero-stats { flex-direction: column; gap: 20px; }
          .p-amount { font-size: 32px; }
        }
      `}</style>

      <div className="bg-grid" aria-hidden="true" />
      <div className="glow-1" aria-hidden="true" />
      <div className="glow-2" aria-hidden="true" />

      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7" cy="15" r="5" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5" stroke="#5448E4" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5448E4"/>
            <circle cx="7" cy="15" r="2" fill="#5448E4"/>
            <circle cx="23" cy="15" r="2" fill="#5448E4"/>
          </svg>
          Gagara
        </a>
        <div className="nav-links">
          <a href="#vault">See the vault</a>
          <a href="#how">How it works</a>
          <a href="#situations">Who it helps</a>
          <a href="#modes">Deal types</a>
        </div>
        <div className="nav-actions">
          <a href="/sign-in" className="btn-ghost">Sign in</a>
          <a href="/get-started" className="btn-primary">Get started</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-tag">
          <span className="hero-tag-line" aria-hidden="true" />
          You want to engage. But what if they don't follow through?
        </div>
        <h1 className="hero-h1">
          No more starting and<br /><em>hoping for the best.</em>
        </h1>
        <div className="hero-rule" aria-hidden="true" />
        <div className="hero-body">
          <p className="hero-desc">
            Before anyone starts, both sides confirm their commitment through Gagara.
            The person paying shows the money is real and ready. The person working knows they will be paid the moment the job is done.<br /><br />
            <strong>No chasing. No excuses. No surprises.</strong> Everyone knows exactly what happens and when.
          </p>
          <div className="hero-right">
            <div className="hero-stats">
              <div>
                <div className="stat-val">2<span>×</span></div>
                <div className="stat-label">Both sides covered<br />Not just one person</div>
              </div>
              <div>
                <div className="stat-val"><span>0</span></div>
                <div className="stat-label">Surprises<br />Everyone sees every step</div>
              </div>
              <div>
                <div className="stat-val"><span>∞</span></div>
                <div className="stat-label">Kinds of agreement<br />Small favour to big contract</div>
              </div>
            </div>
            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create a free agreement</a>
              <a href="#vault" className="btn-link">See how it works</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── VAULT ── */}
      <div className="page-max">
        <div className="vault-wrap" id="vault">
          <div className="vault-meta">
            <div className="vault-meta-label">How your agreement looks — live example</div>
            <div className="vault-deal-id">GGR-4829-KXMT</div>
          </div>
          <div className="vault-card">

            {/* ── UNIFIED VAULT — one design, all screen sizes ── */}

            {/* Two parties */}
            <div className="uv-parties">
              <div className="uv-party">
                <div className={`uv-avatar ${released ? 'done' : funded ? 'active' : ''}`}>G</div>
                <div className="uv-info">
                  <div className="uv-role">Paying</div>
                  <div className="uv-name">@gaga</div>
                  <div className="uv-verified">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                  <div className={`uv-state ${released ? 'done' : funded ? 'active' : ''}`}>
                    {released ? 'Payment sent' : funded ? 'Money reserved' : 'Waiting'}
                  </div>
                </div>
              </div>

              {/* Center lock indicator */}
              <div className="uv-center">
                <div className="uv-center-line">
                  <div className={`uv-flow ${funded ? 'active' : ''} ${released ? 'green' : 'indigo'}`} />
                </div>
                <div className={`uv-lock-wrap ${released ? 'done' : funded ? 'active' : ''}`}>
                  {!released ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={funded ? '#7268ED' : 'rgba(238,238,248,0.2)'} strokeWidth="1.5" strokeLinecap="round" style={{transition:'stroke 0.4s'}}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2BA86A" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                </div>
                <div className="uv-center-line">
                  <div className={`uv-flow ${funded ? 'active' : ''} ${released ? 'green' : 'indigo'}`} style={{animationDelay:'0.8s'}} />
                </div>
                <div className="uv-label">Gagara</div>
              </div>

              <div className="uv-party right">
                <div className={`uv-avatar ${released ? 'done' : working ? 'active' : ''}`}>C</div>
                <div className="uv-info">
                  <div className="uv-role">Receiving</div>
                  <div className="uv-name">@client</div>
                  <div className="uv-verified" style={{flexDirection:'row-reverse'}}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified
                  </div>
                  <div className={`uv-state ${released ? 'done' : working ? 'active' : ''}`}>
                    {released ? 'Payment received' : working ? 'Working' : 'Waiting'}
                  </div>
                </div>
              </div>
            </div>

            {/* Amount + badge */}
            <div className="uv-amount-row">
              <div className={`uv-amount ${released ? 'released' : ''}`}>$800.00</div>
              <div className={`uv-badge ${released ? 'released' : funded ? 'locked' : 'pending'}`}>
                {released ? 'Released' : funded ? 'Reserved' : 'Pending'}
              </div>
            </div>

            {/* Live event log */}
            <div className="uv-log">
              {[
                { text: 'Agreement created by @gaga',     time: '09:12', done: true,      active: false },
                { text: '@client joined the agreement',   time: '09:15', done: true,      active: false },
                { text: '$800 reserved — work can start', time: '09:23', done: funded,    active: !funded },
                { text: 'Work confirmed complete',        time: '10:44', done: working,   active: funded && !working },
                { text: 'Both sides confirmed done',      time: '11:02', done: confirmed, active: working && !confirmed },
                { text: '$800 sent to @client',           time: '11:02', done: released,  active: confirmed && !released },
              ].map((ev, i) => (
                <div key={i} className={`uv-event ${ev.done ? 'done' : ev.active ? 'active' : ''}`}>
                  <div className="uv-event-dot" />
                  <div className="uv-event-text">{ev.text}</div>
                  {(ev.done || ev.active) && <div className="uv-event-time">{ev.time}</div>}
                </div>
              ))}
            </div>

            <div className="uv-footer">
              <span className="uv-footer-id">GGR-4829-KXMT</span>
              <span className="uv-footer-note">Both sides must agree before anything moves</span>
            </div>

          </div>
        </div>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ── HOW IT WORKS ── */}
      <div className="page-max">
        <section className="section" id="how">
          <div className="sec-tag">How it works</div>
          <h2 className="sec-h2">Here is exactly <em>what happens.</em></h2>
          <p className="sec-desc">Every agreement on Gagara works the same way. You both agreed to the same thing before anyone started. Both of you can see every step as it happens. Nothing is hidden.</p>
          <div className="steps-grid">
            {[
              { n:'01', title:'Agree on the terms',       desc:'One person writes up the agreement — the amount, what is expected, and by when. They share a simple code with the other person so both are looking at the same thing.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              { n:'02', title:'Payment goes into the vault', desc:'The person paying puts the money in through Gagara. It is reserved and cannot be taken back. The person doing the work can see it is there before they lift a finger.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
              { n:'03', title:'Work gets done',             desc:'The job is carried out. Both sides can see progress. If there are milestones, each one is tracked and confirmed separately.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
              { n:'04', title:'Both sides say yes',         desc:'When the work is done, both of you confirm it. One person saying yes is not enough. Both must agree before the money moves.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { n:'05', title:'Payment is sent',            desc:'Once both confirm, the money goes straight to the receiver. The full record of the deal stays on file permanently.', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg> },
            ].map((s, i) => {
              const isActive = i === phase;
              const isDone   = i < phase || released;
              return (
                <div key={i} className={`step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                  <div className="step-icon" aria-hidden="true">{s.icon}</div>
                  <div className="step-num">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ── REAL SITUATIONS ── */}
      <div className="page-max">
        <section className="section" id="situations">
          <div className="sec-tag">Who it helps</div>
          <h2 className="sec-h2">For anyone who has ever wondered <em>what if this goes wrong.</em></h2>
          <p className="sec-desc">You do not need a bad experience to want certainty before you start. Gagara is for anyone taking on work or paying for something where the stakes matter.</p>
          <div className="stories-grid">
            {[
              {
                n: '01',
                situation: <>You delivered everything.<br /><em>Then the silence started.</em></>,
                body: 'You delivered everything you agreed on. Now you cannot get paid. With Gagara, the money was already in the vault before you started. You would not have needed to chase anyone.',
                outcome: 'When you finish the work, the payment is already waiting for you.',
              },
              {
                n: '02',
                situation: <>You paid for the job.<br /><em>The work never came.</em></>,
                body: 'You transferred the money upfront and trusted them to deliver. They did not. With Gagara, you stay in control. The money does not leave until you confirm you got what you paid for.',
                outcome: 'The money does not move until you confirm you got what you paid for.',
              },
              {
                n: '03',
                situation: <>You invested weeks of work.<br /><em>They changed their mind.</em></>,
                body: 'You spent time, materials, and energy preparing for a big job. Then the client changed their mind. With Gagara, both sides commit before anyone starts. If you do what was agreed, the payment is there. That is the whole point.',
                outcome: 'You start with confidence, not just hope.',
              },
            ].map((s, i) => (
              <div key={i} className="story-card">
                <div className="story-num">{s.n}</div>
                <div className="story-situation">{s.situation}</div>
                <div className="story-body">{s.body}</div>
                <div className="story-outcome">
                  <div className="story-outcome-dot" />
                  {s.outcome}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ── MODES ── */}
      <div className="page-max">
        <section className="section" id="modes">
          <div className="sec-tag">Deal types</div>
          <h2 className="sec-h2">A small favour or a big project. <em>Gagara fits both.</em></h2>
          <p className="sec-desc">Each time you create an agreement, you pick how much protection you need based on the size and importance of the work. Your account stays the same either way.</p>
          <div className="modes-grid">
            {[
              { n:'01', gold:false, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.3" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, title:'Personal', desc:'Paying someone to fix something, sending money for a service, or any small agreement between two people. Simple and quick to set up.', range:'Up to $2,000', features:['Single payment on completion','Deal code shared by message','Both sides confirm before release','Full record kept on file'] },
              { n:'02', gold:false, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.3" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title:'Business', desc:'Service agreements, supplier payments, or project work paid in stages as it gets done. Built for situations where the details and the timeline both matter.', range:'$200 to $50,000', features:['Pay in milestones as work is delivered','Timeline changes tracked and logged','Full audit trail for both parties','Dispute documentation if needed'] },
              { n:'03', gold:true,  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, title:'Enterprise', desc:'Large agreements involving multiple people, big amounts, and formal conditions that everyone needs to sign off on. Built for when getting it wrong is not an option.', range:'$10,000 and above', features:['Multiple parties in one deal','Court-ready PDF generated automatically','API access for teams','Dedicated support if a dispute arises'] },
            ].map((m, i) => (
              <div key={i} className={`mode-card ${m.gold ? 'gold-card' : ''}`}>
                <div className="mc-n">{m.n}</div>
                <div className="mc-icon" aria-hidden="true">{m.icon}</div>
                <div className="mc-title">{m.title}</div>
                <div className="mc-desc">{m.desc}</div>
                <div className="mc-range">{m.range}</div>
                <ul className="mc-list">{m.features.map((f,j) => <li key={j}>{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ── PAYOUTS ── */}
      <div className="page-max">
        <section className="section" id="payouts">
          <div className="sec-tag">Getting paid</div>
          <h2 className="sec-h2">You get paid <em>the moment it is confirmed done.</em></h2>
          <p className="sec-desc">Once both of you confirm the work is done, payment goes out straight away. The person receiving the money chooses how they want to be paid before the agreement even begins.</p>
          <div className="payout-table">
            <div className="pt-head"><span>How you get paid</span><span>How fast</span></div>
            {[
              { method:'Gagara to Gagara',               desc:'Both parties use Gagara. Instant transfer within the platform.',           speed:'Under 1 second',  fast:true  },
              { method:'SEPA Instant',                   desc:'European bank accounts. Available any time of day.',                       speed:'Under 10 seconds',fast:true  },
              { method:'Faster Payments (UK)',            desc:'UK bank accounts. Free and available around the clock.',                  speed:'Under 2 minutes', fast:true  },
              { method:'Stablecoin (USDC or USDT)',       desc:'Cross-border payments without needing a traditional bank.',              speed:'2 to 5 minutes',  fast:true  },
              { method:'Mobile money (M-Pesa, GCash)',   desc:'Works in Africa and Southeast Asia. No bank account needed.',             speed:'Under 5 minutes', fast:true  },
              { method:'Bank transfer',                   desc:'Works with any bank account anywhere in the world.',                     speed:'1 to 3 days',     fast:false },
            ].map((p, i) => (
              <div key={i} className="pt-row">
                <div><div className="pt-method">{p.method}</div><div className="pt-desc">{p.desc}</div></div>
                <div className={`pt-speed ${p.fast ? '' : 'slow'}`}>{p.speed}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CLOSING ── */}
      <div className="page-max">
        <div className="closing">
          <div className="closing-box">
            <div className="cb-inner">
              <div className="cb-tag">Certainty before you start. Every time.</div>
              <h2 className="cb-h">Start every agreement knowing<br /><em>exactly how it ends.</em></h2>
              <p className="cb-p">The moment you are not sure whether to say yes — whether to take the job, sign the contract, or trust someone with your money — that is exactly when Gagara helps. Both sides put their commitment down before anyone starts. When the work is done, everyone gets what was agreed.</p>
              <div className="cb-btns">
                <a href="/get-started" className="btn-primary">Create your first agreement</a>
                <a href="/sign-in" className="btn-ghost">Sign in</a>
              </div>
              <div className="cb-tags">
                {['Both sides protected','Everyone sees the same thing','No one acts alone','Conditions agreed before you start','Full history saved','Help if something goes wrong','Works across borders','Any currency'].map((tag,i) => (
                  <span key={i} className="cb-tag-item">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="f-logo">
          <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7" cy="15" r="5" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5" stroke="#5448E4" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5448E4"/>
            <circle cx="7" cy="15" r="2" fill="#5448E4"/>
            <circle cx="23" cy="15" r="2" fill="#5448E4"/>
          </svg>
          Gagara
        </div>
        <ul className="f-nav">
          <li><a href="#vault">How it works</a></li>
          <li><a href="#how">The steps</a></li>
          <li><a href="#situations">Who it helps</a></li>
          <li><a href="#modes">Agreement types</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/safety">Safety</a></li>
        </ul>
        <div className="f-copy">© 2026 Gagara</div>
      </footer>
    </>
  );
}
