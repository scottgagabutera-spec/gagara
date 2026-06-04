'use client';

import { useState, useEffect } from 'react';

export default function GagaraHome() {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { t: '09:12', e: 'Deal created',                  a: '@gaga'           },
    { t: '09:15', e: 'Both parties connected',         a: '@client joined'  },
    ...(funded    ? [{ t: '09:23', e: '$800 deposited to vault',    a: '@gaga'           }] : []),
    ...(working   ? [{ t: '10:44', e: 'Milestone 1 complete',       a: '@client'         }] : []),
    ...(confirmed ? [{ t: '11:02', e: 'Confirmed by payer',         a: '@gaga'           }] : []),
    ...(released  ? [{ t: '11:02', e: '$800 released',              a: 'via Interledger' }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── DESIGN TOKENS ──
           Font roles:
           - Fraunces   → headlines only (H1, H2)
           - Figtree    → everything users read (body, nav, buttons, descriptions)
           - IBM Plex Mono → data only (codes, timestamps, labels, badges)

           Color roles:
           - --text-primary   92% → main readable text
           - --text-body      78% → body paragraphs
           - --text-secondary 58% → supporting descriptions
           - --text-label     48% → mono labels, non-critical
           - --text-faint     22% → decorative only

           Spacing: 8px grid — 8,16,24,32,40,48,64,80,96,128
        */
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
          --red:        #E05252;

          --text-primary:   rgba(238,238,248,0.92);
          --text-body:      rgba(238,238,248,0.78);
          --text-secondary: rgba(238,238,248,0.58);
          --text-label:     rgba(238,238,248,0.48);
          --text-faint:     rgba(238,238,248,0.22);

          --border:     rgba(238,238,248,0.07);
          --border-md:  rgba(238,238,248,0.11);
          --border-str: rgba(238,238,248,0.16);

          --r-sm: 8px;
          --r-md: 12px;
          --r-lg: 16px;
          --r-xl: 20px;
          --r-2xl: 24px;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--text-primary);
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }

        ::selection { background: rgba(84,72,228,0.25); color: #fff; }

        /* ── TEXTURE ── */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        /* ── GRID ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(84,72,228,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(84,72,228,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* ── GLOWS ── */
        .glow-1 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 900px; height: 900px; border-radius: 50%;
          top: -500px; right: -350px;
          background: radial-gradient(circle, rgba(84,72,228,0.04) 0%, transparent 60%);
        }
        .glow-2 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 700px; height: 700px; border-radius: 50%;
          bottom: -350px; left: -250px;
          background: radial-gradient(circle, rgba(196,160,82,0.025) 0%, transparent 60%);
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 400;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(5,5,8,0.88);
          backdrop-filter: blur(40px) saturate(1.5);
          border-bottom: 0.5px solid var(--border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 600;
          color: var(--text-primary); text-decoration: none;
          letter-spacing: -0.2px; flex-shrink: 0;
        }
        .nav-links {
          display: flex; gap: 40px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-links a {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-secondary); text-decoration: none;
          transition: color 0.15s; white-space: nowrap;
        }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-actions { display: flex; gap: 8px; align-items: center; }
        .btn-ghost {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-secondary); background: none; border: none;
          padding: 9px 16px; border-radius: var(--r-sm);
          cursor: pointer; transition: all 0.15s;
          text-decoration: none; display: inline-block;
        }
        .btn-ghost:hover { color: var(--text-primary); background: rgba(238,238,248,0.04); }
        .btn-primary {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 500;
          background: var(--indigo); color: #fff; border: none;
          padding: 10px 22px; border-radius: var(--r-sm);
          cursor: pointer; letter-spacing: -0.1px;
          transition: background 0.15s, transform 0.1s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { background: var(--indigo-l); }
        .btn-primary:active { transform: scale(0.98); }

        /* ── HERO ── */
        .hero {
          position: relative; z-index: 1;
          min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 96px 48px 80px;
          max-width: 1280px; margin: 0 auto;
        }
        .hero-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--indigo-l); margin-bottom: 40px;
          display: flex; align-items: center; gap: 12px;
          opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        .hero-tag-line { width: 24px; height: 1px; background: var(--indigo-l); flex-shrink: 0; }
        .hero-h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(56px, 8.5vw, 120px);
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -3px;
          color: var(--text-primary);
          opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .hero-h1 em {
          font-style: italic; font-weight: 300;
          color: var(--indigo-l);
        }
        .hero-rule {
          width: 100%; height: 0.5px; margin: 48px 0;
          background: linear-gradient(90deg, var(--indigo), rgba(84,72,228,0.06), transparent);
          opacity: 0; animation: fadeUp 0.6s ease 0.42s forwards;
        }
        .hero-body {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end;
          opacity: 0; animation: fadeUp 0.7s ease 0.52s forwards;
        }
        .hero-desc {
          font-family: 'Figtree', sans-serif;
          font-size: 17px; font-weight: 400;
          color: var(--text-body); line-height: 1.72;
          max-width: 420px;
        }
        .hero-desc strong { color: var(--text-primary); font-weight: 600; }
        .hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 32px; }
        .hero-stats { display: flex; gap: 40px; }
        .stat-val {
          font-family: 'Fraunces', serif;
          font-size: 40px; font-weight: 300;
          letter-spacing: -1.5px; color: var(--text-primary); line-height: 1;
          margin-bottom: 8px;
        }
        .stat-val span { color: var(--indigo-l); }
        .stat-label {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-secondary); line-height: 1.5;
        }
        .hero-actions { display: flex; gap: 12px; align-items: center; }
        .btn-link {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-secondary); background: none; border: none;
          cursor: pointer; padding: 10px 0;
          transition: color 0.15s; text-decoration: none; display: inline-block;
        }
        .btn-link:hover { color: var(--text-primary); }

        /* ── PAGE MAX ── */
        .page-max {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
        }

        /* ── SECTION ── */
        .section { padding: 96px 48px; }

        /* ── SECTION HEADER ── */
        .sec-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--indigo-l); margin-bottom: 16px;
        }
        .sec-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(38px, 4.5vw, 60px);
          font-weight: 300; line-height: 0.96;
          letter-spacing: -1.8px; color: var(--text-primary);
          margin-bottom: 16px;
        }
        .sec-h2 em { font-style: italic; color: var(--indigo-l); }
        .sec-desc {
          font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 400;
          color: var(--text-body); line-height: 1.72;
          max-width: 500px; margin-bottom: 56px;
        }

        /* ── DIVIDER ── */
        .divider { height: 0.5px; background: var(--border); position: relative; z-index: 1; }

        /* ══════════════════════════════
           VAULT SECTION
        ══════════════════════════════ */
        .vault-wrap { padding: 0 48px 96px; }

        .vault-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px;
        }
        .vault-meta-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-label);
          display: flex; align-items: center; gap: 12px;
        }
        .vault-meta-label::before {
          content: ''; width: 20px; height: 0.5px;
          background: var(--text-label); flex-shrink: 0;
        }
        .vault-deal-id {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: var(--indigo-l); letter-spacing: 0.06em;
        }

        /* Card that holds the vault */
        .vault-card {
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          overflow: hidden;
          background: var(--surface);
        }

        /* Three columns */
        .vault-cols {
          display: grid;
          grid-template-columns: 1fr 256px 1fr;
        }

        /* Party columns */
        .party-col {
          padding: 40px 36px;
          display: flex; flex-direction: column;
          justify-content: space-between; gap: 24px;
          border-right: 0.5px solid var(--border);
        }
        .party-col.recv {
          border-right: none;
          border-left: 0.5px solid var(--border);
          align-items: flex-end; text-align: right;
        }

        .p-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text-faint);
        }
        .p-id { display: flex; align-items: center; gap: 12px; }
        .party-col.recv .p-id { flex-direction: row-reverse; }
        .p-avatar {
          width: 40px; height: 40px; border-radius: var(--r-md);
          background: var(--surface4); border: 0.5px solid var(--border-md);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 600; color: var(--text-primary);
          flex-shrink: 0;
        }
        .p-name {
          font-family: 'Figtree', sans-serif;
          font-size: 15px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 3px;
        }
        .p-verified {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: var(--green);
          display: flex; align-items: center; gap: 5px;
        }
        .party-col.recv .p-verified { justify-content: flex-end; }

        .p-amount-block {}
        .p-amount-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-faint); margin-bottom: 8px;
        }
        .p-amount {
          font-family: 'Fraunces', serif;
          font-size: 40px; font-weight: 300;
          letter-spacing: -1.5px; line-height: 1;
          color: var(--text-primary); transition: color 0.5s;
        }
        .p-amount.pending { color: var(--text-label); font-style: italic; }
        .p-amount.done    { color: var(--green); }
        .p-state {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; margin-top: 8px; letter-spacing: 0.04em;
          color: var(--text-faint); transition: color 0.4s;
        }
        .p-state.locked  { color: var(--indigo-l); }
        .p-state.success { color: var(--green); }

        .p-eye {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 13px;
          background: var(--indigo-dim);
          border: 0.5px solid rgba(84,72,228,0.2);
          border-radius: var(--r-sm);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.07em;
          color: var(--indigo-l);
        }
        .party-col.recv .p-eye { justify-content: flex-end; }
        .eye-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--indigo-l); flex-shrink: 0;
          animation: blink 2.5s ease-in-out infinite;
        }

        /* Vault center column */
        .vault-mid {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 32px 20px; gap: 14px;
          position: relative;
        }

        /* Wire lines — positioned relative to vault-mid */
        .wire-svg {
          position: absolute; top: 50%;
          height: 1px; width: 100%;
          transform: translateY(-50%);
          overflow: visible; pointer-events: none;
        }
        .wire-svg.left  { right: 100%; }
        .wire-svg.right { left: 100%; }

        .vault-mid-id {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--indigo-l);
          letter-spacing: 0.1em; text-align: center;
        }

        /* Vault SVG container — FIXED SIZE, no animation on load */
        .vault-fig {
          position: relative;
          width: 132px; height: 132px;
          flex-shrink: 0;
        }
        .vault-price-tag {
          position: absolute;
          top: -16px; left: 50%; transform: translateX(-50%);
          background: var(--surface3);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-sm);
          padding: 4px 11px;
          font-family: 'Fraunces', serif;
          font-size: 16px; font-weight: 300;
          color: var(--text-primary); letter-spacing: -0.4px;
          white-space: nowrap; z-index: 2;
          transition: color 0.5s;
        }
        .vault-price-tag.released { color: var(--green); }

        .vault-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 11px; border-radius: 5px;
          transition: all 0.4s;
        }
        .vb-locked {
          color: var(--indigo-l); background: var(--indigo-dim);
          border: 0.5px solid rgba(84,72,228,0.2);
        }
        .vb-done {
          color: var(--green); background: var(--green-dim);
          border: 0.5px solid rgba(43,168,106,0.2);
        }

        .vault-note {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-faint); text-align: center; line-height: 1.6;
        }

        /* Audit strip */
        .audit {
          border-top: 0.5px solid var(--border);
          background: rgba(5,5,8,0.6);
          border-radius: 0 0 var(--r-2xl) var(--r-2xl);
          padding: 20px 36px;
          display: flex; gap: 0; overflow-x: auto;
          scrollbar-width: none;
        }
        .audit::-webkit-scrollbar { display: none; }
        .audit-item {
          flex-shrink: 0;
          padding-right: 32px; margin-right: 32px;
          border-right: 0.5px solid var(--border);
          display: flex; flex-direction: column; gap: 3px;
          opacity: 0; animation: fadeUp 0.3s ease forwards;
        }
        .audit-item:last-child { border-right: none; padding-right: 0; margin-right: 0; }
        .ai-time {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--text-faint);
        }
        .ai-event {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; color: var(--text-body); font-weight: 400;
        }
        .ai-actor {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--indigo-l);
        }

        /* ══════════════════════════════
           DEAL STEPS
        ══════════════════════════════ */
        .steps-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute;
          top: 29px; left: 29px; right: 29px; height: 0.5px;
          background: linear-gradient(90deg,
            transparent,
            rgba(84,72,228,0.35) 10%,
            rgba(84,72,228,0.35) 90%,
            transparent
          );
          z-index: 0;
        }
        .step {
          display: flex; flex-direction: column;
          align-items: flex-start; padding-right: 20px;
          position: relative; z-index: 1;
        }
        .step-icon {
          width: 58px; height: 58px; border-radius: var(--r-md);
          background: var(--surface2); border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; color: var(--text-faint);
          transition: all 0.3s;
        }
        .step.active .step-icon {
          background: var(--indigo-dim);
          border-color: rgba(84,72,228,0.3); color: var(--indigo-l);
        }
        .step.done .step-icon {
          background: var(--green-dim);
          border-color: rgba(43,168,106,0.25); color: var(--green);
        }
        .step-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--text-faint);
          letter-spacing: 0.12em; margin-bottom: 6px;
        }
        .step-title {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 6px;
        }
        .step-desc {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--text-secondary); line-height: 1.55;
        }

        /* ══════════════════════════════
           MODES
        ══════════════════════════════ */
        .modes-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: var(--r-2xl); overflow: hidden;
        }
        .mode-card {
          background: var(--surface); padding: 44px 36px;
          position: relative; overflow: hidden; transition: background 0.2s;
        }
        .mode-card:hover { background: var(--surface2); }
        .mode-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: var(--indigo); opacity: 0; transition: opacity 0.2s;
        }
        .mode-card:hover::before { opacity: 1; }
        .mode-card.gold-card::before { background: var(--gold); }

        .mc-n {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--text-faint);
          letter-spacing: 0.12em; margin-bottom: 24px;
        }
        .mc-icon {
          width: 44px; height: 44px; border-radius: var(--r-md);
          background: var(--surface3); border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .mc-title {
          font-family: 'Fraunces', serif;
          font-size: 24px; font-weight: 300;
          color: var(--text-primary); letter-spacing: -0.6px;
          margin-bottom: 10px; line-height: 1;
        }
        .mc-desc {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-body); line-height: 1.65; margin-bottom: 20px;
        }
        .mc-range {
          display: inline-flex;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: var(--gold);
          background: var(--gold-dim);
          border: 0.5px solid rgba(196,160,82,0.15);
          padding: 4px 10px; border-radius: 5px;
          margin-bottom: 20px; letter-spacing: 0.04em;
        }
        .mc-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .mc-list li {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--text-secondary); line-height: 1.4;
          display: flex; align-items: flex-start; gap: 9px;
        }
        .mc-list li::before {
          content: ''; width: 3px; height: 3px; border-radius: 50%;
          background: var(--indigo-l); flex-shrink: 0; margin-top: 6px;
        }

        /* ══════════════════════════════
           PAYOUTS
        ══════════════════════════════ */
        .payout-table {
          border: 0.5px solid var(--border);
          border-radius: var(--r-2xl); overflow: hidden;
        }
        .pt-head {
          display: grid; grid-template-columns: 1fr auto;
          padding: 13px 32px;
          background: rgba(84,72,228,0.04);
          border-bottom: 0.5px solid var(--border);
        }
        .pt-head span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-faint);
        }
        .pt-row {
          display: grid; grid-template-columns: 1fr auto;
          padding: 22px 32px; gap: 24px;
          border-bottom: 0.5px solid var(--border);
          align-items: center; transition: background 0.15s;
        }
        .pt-row:last-child { border-bottom: none; }
        .pt-row:hover { background: var(--surface2); }
        .pt-method {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 3px;
        }
        .pt-desc {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 400; color: var(--text-secondary);
        }
        .pt-speed {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; font-weight: 500;
          color: var(--green); white-space: nowrap; text-align: right;
        }
        .pt-speed.slow { color: var(--text-secondary); }

        /* ══════════════════════════════
           CLOSING
        ══════════════════════════════ */
        .closing { padding: 0 48px 120px; }
        .closing-box {
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          padding: 88px 72px;
          text-align: center; position: relative; overflow: hidden;
        }
        .closing-box::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 440px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .closing-box::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 0%, rgba(84,72,228,0.035) 0%, transparent 55%);
        }
        .cb-inner { position: relative; z-index: 1; }
        .cb-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 36px;
          display: flex; align-items: center; justify-content: center; gap: 14px;
        }
        .cb-tag::before, .cb-tag::after {
          content: ''; flex: 1; max-width: 44px;
          height: 0.5px; background: var(--gold); opacity: 0.3;
        }
        .cb-h {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 4.8vw, 64px);
          font-weight: 300; line-height: 0.96;
          letter-spacing: -2px; color: var(--text-primary);
          max-width: 720px; margin: 0 auto 20px;
        }
        .cb-h em { font-style: italic; color: var(--indigo-l); }
        .cb-p {
          font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 400;
          color: var(--text-body); line-height: 1.72;
          max-width: 480px; margin: 0 auto 44px;
        }
        .cb-btns {
          display: flex; gap: 12px; justify-content: center;
          align-items: center; margin-bottom: 44px;
        }
        .cb-tags {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
        }
        .cb-tag-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.07em;
          color: var(--text-label);
          background: rgba(238,238,248,0.03);
          border: 0.5px solid var(--border-md);
          padding: 5px 11px; border-radius: 5px;
        }

        /* ── FOOTER ── */
        footer {
          position: relative; z-index: 1;
          border-top: 0.5px solid var(--border);
          padding: 40px 48px;
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .f-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Figtree', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--text-primary);
        }
        .f-nav { display: flex; gap: 28px; list-style: none; }
        .f-nav a {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-secondary); text-decoration: none; transition: color 0.15s;
        }
        .f-nav a:hover { color: var(--text-primary); }
        .f-copy {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--text-faint); letter-spacing: 0.06em;
        }

        /* ── KEYFRAMES ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }
        @keyframes wirePulse {
          0%   { stroke-dashoffset: 100; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0; }
        }
        .wire-pulse-anim {
          stroke-dasharray: 24 76;
          animation: wirePulse 1.8s linear infinite;
        }
        .wire-pulse-anim-r {
          stroke-dasharray: 24 76;
          animation: wirePulse 1.8s linear 0.9s infinite;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .nav { padding: 0 24px; }
          .nav-links { display: none; }

          .hero { padding: 88px 24px 64px; }
          .hero-body { grid-template-columns: 1fr; gap: 40px; }
          .hero-right { align-items: flex-start; }
          .hero-stats { gap: 28px; }

          .vault-wrap { padding: 0 24px 80px; }
          .vault-cols { grid-template-columns: 1fr; }
          .party-col {
            border-right: none;
            border-bottom: 0.5px solid var(--border);
          }
          .party-col.recv {
            border-left: none;
            border-top: 0.5px solid var(--border);
            align-items: flex-start; text-align: left;
          }
          .party-col.recv .p-id  { flex-direction: row; }
          .party-col.recv .p-verified { justify-content: flex-start; }
          .party-col.recv .p-eye { justify-content: flex-start; }
          .vault-mid {
            border-top: 0.5px solid var(--border);
            border-bottom: 0.5px solid var(--border);
            padding: 40px 24px;
          }
          .wire-svg { display: none; }
          .audit { padding: 18px 24px; }

          .section { padding: 64px 24px; }
          .steps-grid { grid-template-columns: 1fr; gap: 28px; }
          .steps-grid::before { display: none; }
          .modes-grid { grid-template-columns: 1fr; }

          .closing { padding: 0 24px 80px; }
          .closing-box { padding: 56px 24px; }
          .cb-btns { flex-direction: column; }

          footer {
            flex-direction: column; gap: 24px;
            padding: 40px 24px; text-align: center;
          }
          .f-nav { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <div className="bg-grid" aria-hidden="true" />
      <div className="glow-1"  aria-hidden="true" />
      <div className="glow-2"  aria-hidden="true" />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7"  cy="15" r="5"   stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5"   stroke="#5448E4" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5448E4"/>
            <circle cx="7"  cy="15" r="2"   fill="#5448E4"/>
            <circle cx="23" cy="15" r="2"   fill="#5448E4"/>
          </svg>
          Gagara
        </a>
        <div className="nav-links">
          <a href="#vault">The vault</a>
          <a href="#how">How it works</a>
          <a href="#modes">Deal modes</a>
          <a href="#payouts">Payouts</a>
        </div>
        <div className="nav-actions">
          <a href="/sign-in"     className="btn-ghost">Sign in</a>
          <a href="/get-started" className="btn-primary">Get started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">
          <span className="hero-tag-line" aria-hidden="true" />
          Programmable escrow on Interledger Open Payments
        </div>
        <h1 className="hero-h1">
          Work runs on trust.<br /><em>Gagara makes it certain.</em>
        </h1>
        <div className="hero-rule" aria-hidden="true" />
        <div className="hero-body">
          <p className="hero-desc">
            Lock the money first. Both of you see it in the vault.
            Work starts when you are both ready.<br /><br />
            <strong>Neither side can touch the funds alone.</strong> Release only happens when the job is done and both parties confirm it.
          </p>
          <div className="hero-right">
            <div className="hero-stats">
              <div>
                <div className="stat-val">3<span>×</span></div>
                <div className="stat-label">Deal modes<br />Personal · Business · Enterprise</div>
              </div>
              <div>
                <div className="stat-val">&lt;<span>1s</span></div>
                <div className="stat-label">Transfer speed<br />for Gagara accounts</div>
              </div>
              <div>
                <div className="stat-val"><span>∞</span></div>
                <div className="stat-label">Active deals<br />per account</div>
              </div>
            </div>
            <div className="hero-actions">
              <a href="/get-started" className="btn-primary">Create your first deal</a>
              <a href="#vault"       className="btn-link">See how it works</a>
            </div>
          </div>
        </div>
      </section>

      {/* VAULT */}
      <div className="page-max">
        <div className="vault-wrap" id="vault">
          <div className="vault-meta">
            <div className="vault-meta-label">The glass vault</div>
            <div className="vault-deal-id">GGR-4829-KXMT</div>
          </div>

          <div className="vault-card">
            <div className="vault-cols">

              {/* PAYER */}
              <div className="party-col">
                <div className="p-role">Payer</div>
                <div className="p-id">
                  <div className="p-avatar">G</div>
                  <div>
                    <div className="p-name">@gaga</div>
                    <div className="p-verified">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/>
                        <path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      KYC verified
                    </div>
                  </div>
                </div>
                <div className="p-amount-block">
                  <div className="p-amount-tag">
                    {released ? 'Released' : funded ? 'In vault' : 'Depositing'}
                  </div>
                  <div className="p-amount">$800.00</div>
                  <div className={`p-state ${funded ? released ? 'success' : 'locked' : ''}`}>
                    {released ? 'Transfer complete' : funded ? 'Locked in escrow' : 'Funding vault'}
                  </div>
                </div>
                <div className="p-eye">
                  <div className="eye-dot" />
                  {released ? 'Funds sent to receiver' : funded ? 'You can see the vault balance' : 'Waiting for deposit'}
                </div>
              </div>

              {/* VAULT CENTER */}
              <div className="vault-mid">
                {/* Left wire */}
                <svg className="wire-svg left" viewBox="0 0 60 1" preserveAspectRatio="none" aria-hidden="true" style={{width:'60px'}}>
                  <line x1="0" y1="0.5" x2="60" y2="0.5" stroke="rgba(84,72,228,0.18)" strokeWidth="1"/>
                  {funded && <line x1="0" y1="0.5" x2="60" y2="0.5" stroke="#5448E4" strokeWidth="1.5" className="wire-pulse-anim"/>}
                </svg>
                {/* Right wire */}
                <svg className="wire-svg right" viewBox="0 0 60 1" preserveAspectRatio="none" aria-hidden="true" style={{width:'60px'}}>
                  <line x1="0" y1="0.5" x2="60" y2="0.5" stroke="rgba(84,72,228,0.18)" strokeWidth="1"/>
                  {released && <line x1="0" y1="0.5" x2="60" y2="0.5" stroke="#2BA86A" strokeWidth="1.5" className="wire-pulse-anim-r"/>}
                </svg>

                <div className="vault-mid-id">GGR-4829-KXMT</div>

                {/* VAULT ILLUSTRATION — fixed size, no scale animation */}
                <div className="vault-fig">
                  <div className={`vault-price-tag ${released ? 'released' : ''}`}>
                    $800.00
                  </div>
                  <svg viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{width:'132px', height:'132px', display:'block'}}
                    aria-label="Vault" role="img">
                    <circle cx="66" cy="66" r="62"
                      fill="none"
                      stroke={released ? 'rgba(43,168,106,0.1)' : 'rgba(84,72,228,0.07)'}
                      strokeWidth="0.5" style={{transition:'stroke 0.6s'}}/>
                    <rect x="20" y="34" width="92" height="68" rx="9"
                      fill="var(--surface3)"
                      stroke={released ? 'rgba(43,168,106,0.45)' : funded ? 'rgba(84,72,228,0.45)' : 'rgba(238,238,248,0.07)'}
                      strokeWidth="0.75" style={{transition:'stroke 0.5s'}}/>
                    <rect x="38" y="48" width="56" height="40" rx="6"
                      fill="var(--surface4)"
                      stroke={released ? 'rgba(43,168,106,0.25)' : funded ? 'rgba(84,72,228,0.25)' : 'rgba(238,238,248,0.05)'}
                      strokeWidth="0.5" style={{transition:'stroke 0.5s'}}/>
                    {[[24,42],[108,42],[24,96],[108,96]].map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r="2.5"
                        fill="var(--surface4)" stroke="rgba(238,238,248,0.05)" strokeWidth="0.5"/>
                    ))}
                    <circle cx="66" cy="68" r="13"
                      fill={released ? 'rgba(43,168,106,0.08)' : 'rgba(84,72,228,0.07)'}
                      stroke={released ? '#2BA86A' : '#5448E4'}
                      strokeWidth="0.75" style={{transition:'all 0.5s'}}/>
                    {!released ? (
                      <>
                        <rect x="61.5" y="65" width="9" height="7" rx="1.5"
                          fill={funded ? '#5448E4' : 'rgba(84,72,228,0.3)'}
                          style={{transition:'fill 0.4s'}}/>
                        <path d="M63.5 65v-3a2.5 2.5 0 015 0v3"
                          stroke={funded ? '#5448E4' : 'rgba(84,72,228,0.3)'}
                          strokeWidth="1.2" strokeLinecap="round"
                          style={{transition:'stroke 0.4s'}}/>
                      </>
                    ) : (
                      <path d="M61.5 68l2.5 2.5L71 63"
                        stroke="#2BA86A" strokeWidth="1.4"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    <rect x="63" y="88" width="6" height="9" rx="3"
                      fill="rgba(238,238,248,0.04)" stroke="rgba(238,238,248,0.05)" strokeWidth="0.5"/>
                    <text x="66" y="116" textAnchor="middle"
                      fill="rgba(84,72,228,0.3)"
                      fontSize="6" fontFamily="IBM Plex Mono, monospace"
                      letterSpacing="2.5">GAGARA</text>
                  </svg>
                </div>

                <div className={`vault-badge ${released ? 'vb-done' : 'vb-locked'}`}>
                  {released ? 'Released' : funded ? 'Locked' : 'Linked'}
                </div>
                <div className="vault-note">
                  Held by Gagara<br />Neither party acts alone
                </div>
              </div>

              {/* RECEIVER */}
              <div className="party-col recv">
                <div className="p-role">Receiver</div>
                <div className="p-id">
                  <div className="p-avatar">C</div>
                  <div>
                    <div className="p-name">@client</div>
                    <div className="p-verified" style={{justifyContent:'flex-end'}}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <circle cx="5" cy="5" r="4.5" fill="rgba(43,168,106,0.1)" stroke="#2BA86A" strokeWidth="0.6"/>
                        <path d="M3 5l1.5 1.5L7 3.5" stroke="#2BA86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      KYC verified
                    </div>
                  </div>
                </div>
                <div className="p-amount-block">
                  <div className="p-amount-tag">
                    {released ? 'Received' : funded ? 'Waiting for release' : 'Not funded yet'}
                  </div>
                  <div className={`p-amount ${released ? 'done' : 'pending'}`}>
                    {released ? '$800.00' : 'pending'}
                  </div>
                  <div className={`p-state ${released ? 'success' : ''}`}>
                    {released ? 'Transfer complete' : funded ? 'Visible in vault. Awaiting confirmation.' : 'Waiting for deposit'}
                  </div>
                </div>
                <div className="p-eye" style={{justifyContent:'flex-end'}}>
                  <div className="eye-dot" />
                  {released ? 'Transfer complete' : funded ? 'You can see the vault balance' : 'Waiting for deposit'}
                </div>
              </div>
            </div>

            {/* AUDIT LOG */}
            <div className="audit" role="log" aria-live="polite" aria-label="Deal activity">
              {auditLog.map((item, i) => (
                <div key={`${i}-${phase}`} className="audit-item" style={{animationDelay:`${i * 0.07}s`}}>
                  <div className="ai-time">{item.t}</div>
                  <div className="ai-event">{item.e}</div>
                  <div className="ai-actor">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* DEAL STEPS */}
      <div className="page-max">
        <section className="section" id="how">
          <div className="sec-tag">How it works</div>
          <h2 className="sec-h2">Every deal follows <em>the same steps.</em></h2>
          <p className="sec-desc">
            Five stages, in order, every time. Nothing is skipped.
            Every action is recorded and visible to both parties.
          </p>
          <div className="steps-grid">
            {[
              {
                n:'01', title:'Both parties connect',
                desc:'One person creates the deal and shares a code. The other enters it. The deal is live.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              },
              {
                n:'02', title:'Money goes into the vault',
                desc:'The payer deposits funds. Both sides can see the balance. Neither can touch it alone.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              },
              {
                n:'03', title:'Work gets done',
                desc:'The job proceeds. Milestones are tracked. Every update is timestamped and recorded.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              },
              {
                n:'04', title:'Both sides confirm',
                desc:'When conditions are met, both parties confirm. One confirmation is never enough.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              },
              {
                n:'05', title:'Payment is released',
                desc:'Funds transfer instantly via Interledger. The deal record stays permanently on file.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
              },
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

      {/* DEAL MODES */}
      <div className="page-max">
        <section className="section" id="modes">
          <div className="sec-tag">Deal modes</div>
          <h2 className="sec-h2">Built for <em>any kind of deal.</em></h2>
          <p className="sec-desc">
            Your account type is set once when you sign up.
            The deal mode is chosen each time you create a new agreement.
          </p>
          <div className="modes-grid">
            {[
              {
                n:'01', gold: false,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.3" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                title:'Personal',
                desc:'Freelancers, small jobs, money between friends. Simple terms and quick to set up.',
                range:'$1 to $2,000',
                features:['Single release condition','Deal code expires in 48 hours','Instant mutual release','Full activity record']
              },
              {
                n:'02', gold: false,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.3" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                title:'Business',
                desc:'Service contracts, supplier payments, project milestones. Structured and fully traceable.',
                range:'$200 to $50,000',
                features:['Multiple milestone releases','Edit timelines with full history','Invoice generation','Priority dispute support']
              },
              {
                n:'03', gold: true,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
                title:'Enterprise',
                desc:'Large contracts, multiple parties, API integration. Built for deals that demand precision.',
                range:'$10,000 and above',
                features:['Multi-party deals','API access','Compliance documentation','Dedicated mediation team']
              },
            ].map((m, i) => (
              <div key={i} className={`mode-card ${m.gold ? 'gold-card' : ''}`}>
                <div className="mc-n">{m.n}</div>
                <div className="mc-icon" aria-hidden="true">{m.icon}</div>
                <div className="mc-title">{m.title}</div>
                <div className="mc-desc">{m.desc}</div>
                <div className="mc-range">{m.range}</div>
                <ul className="mc-list">
                  {m.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* PAYOUTS */}
      <div className="page-max">
        <section className="section" id="payouts">
          <div className="sec-tag">Payouts</div>
          <h2 className="sec-h2">Get paid the <em>fastest way available.</em></h2>
          <p className="sec-desc">
            The receiver picks how they want to be paid.
            Gagara shows the estimated arrival time before anything is confirmed.
            Powered by Interledger Protocol — it works across any currency and any network.
          </p>
          <div className="payout-table">
            <div className="pt-head">
              <span>Payment method</span>
              <span>How fast</span>
            </div>
            {[
              {method:'Gagara to Gagara',           desc:'Both parties on Gagara. Funds stay on the network.',              speed:'Under 1 second',  fast:true },
              {method:'SEPA Instant',               desc:'European bank accounts. Available around the clock.',             speed:'Under 10 seconds',fast:true },
              {method:'Faster Payments (UK)',        desc:'UK bank accounts. Free and available 24/7.',                     speed:'Under 2 minutes', fast:true },
              {method:'Stablecoin (USDC or USDT)',   desc:'Cross-border payments. Works without a traditional bank.',       speed:'2 to 5 minutes',  fast:true },
              {method:'Mobile wallet (M-Pesa, GCash)','desc':'Available in Africa and Southeast Asia.',                    speed:'Under 5 minutes', fast:true },
              {method:'Bank transfer',               desc:'Works with any bank account worldwide.',                         speed:'1 to 3 days',     fast:false},
            ].map((p, i) => (
              <div key={i} className="pt-row">
                <div>
                  <div className="pt-method">{p.method}</div>
                  <div className="pt-desc">{p.desc}</div>
                </div>
                <div className={`pt-speed ${p.fast ? '' : 'slow'}`}>{p.speed}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CLOSING */}
      <div className="page-max">
        <div className="closing">
          <div className="closing-box">
            <div className="cb-inner">
              <div className="cb-tag">Built on Interledger Open Payments</div>
              <h2 className="cb-h">
                Work should be simple.<br /><em>Get paid when the job is done.</em>
              </h2>
              <p className="cb-p">
                Lock funds. Confirm the work. Release with certainty.
                For freelancers in Manila, contractors in Lagos,
                suppliers in London — and everyone in between.
              </p>
              <div className="cb-btns">
                <a href="/get-started" className="btn-primary">Create your first deal</a>
                <a href="/sign-in"     className="btn-ghost">Sign in</a>
              </div>
              <div className="cb-tags">
                {['Interledger Open Payments','ILP Protocol','Web Monetization','AES-256 Encryption','KYC Verified','Full Audit Trail','Mobile-first','Cross-border'].map((tag, i) => (
                  <span key={i} className="cb-tag-item">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="f-logo">
          <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7"  cy="15" r="5"   stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5"   stroke="#5448E4" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5448E4"/>
            <circle cx="7"  cy="15" r="2"   fill="#5448E4"/>
            <circle cx="23" cy="15" r="2"   fill="#5448E4"/>
          </svg>
          Gagara
        </div>
        <ul className="f-nav">
          <li><a href="#vault">The vault</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#modes">Deal modes</a></li>
          <li><a href="#payouts">Payouts</a></li>
        </ul>
        <div className="f-copy">© 2026 Gagara</div>
      </footer>
    </>
  );
}
