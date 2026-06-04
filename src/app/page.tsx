'use client';

import { useState, useEffect } from 'react';

export default function GagaraHome() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const cycle = () => {
      const t = [
        setTimeout(() => setPhase(1), 2000),
        setTimeout(() => setPhase(2), 4000),
        setTimeout(() => setPhase(3), 6000),
        setTimeout(() => setPhase(4), 8000),
        setTimeout(() => { setPhase(0); }, 11000),
      ];
      return t;
    };
    const timers = cycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 0) return;
    const t = [
      setTimeout(() => setPhase(1), 2000),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 8000),
      setTimeout(() => { setPhase(0); }, 11000),
    ];
    return () => t.forEach(clearTimeout);
  }, [phase]);

  const funded   = phase >= 1;
  const working  = phase >= 2;
  const confirmed= phase >= 3;
  const released = phase >= 4;

  const auditLog = [
    { t: '09:12:04', e: 'Deal created',                   a: '@gaga'           },
    { t: '09:15:22', e: 'Deal linked — The Link closed',  a: '@client accepted' },
    ...(funded    ? [{ t: '09:23:41', e: '$800.00 deposited to vault',       a: '@gaga funded'    }] : []),
    ...(working   ? [{ t: '10:44:08', e: 'Milestone 1 marked complete',      a: '@client'         }] : []),
    ...(confirmed ? [{ t: '11:02:15', e: 'Completion confirmed',             a: '@gaga'           }] : []),
    ...(released  ? [{ t: '11:02:16', e: '$800.00 released via Interledger', a: 'instant transfer'}] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Figtree:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:     #050508;
          --void:      #080810;
          --surface:   #0C0C16;
          --surface2:  #10101C;
          --surface3:  #161628;
          --surface4:  #1E1E32;
          --indigo:    #5448E4;
          --indigo-l:  #7268ED;
          --indigo-dim: rgba(84,72,228,0.1);
          --indigo-glow: rgba(84,72,228,0.06);
          --gold:      #BFA060;
          --gold-dim:  rgba(191,160,96,0.06);
          --green:     #2EAD6E;
          --green-dim: rgba(46,173,110,0.08);
          --white:     #EEEEF6;
          --white-60:  rgba(238,238,246,0.6);
          --white-40:  rgba(238,238,246,0.4);
          --white-20:  rgba(238,238,246,0.2);
          --white-08:  rgba(238,238,246,0.08);
          --white-04:  rgba(238,238,246,0.04);
          --border:    rgba(238,238,246,0.06);
          --border-md: rgba(238,238,246,0.1);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 24px;
        }

        html { scroll-behavior: smooth; font-size: 16px; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Figtree', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          line-height: 1;
        }

        ::selection { background: rgba(84,72,228,0.25); color: var(--white); }

        /* ─── TEXTURE ─── */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        /* ─── GRID ─── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(84,72,228,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(84,72,228,0.018) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* ─── RADIAL GLOWS ─── */
        .glow-1 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 1000px; height: 1000px; border-radius: 50%;
          top: -500px; right: -400px;
          background: radial-gradient(circle, rgba(84,72,228,0.045) 0%, transparent 60%);
        }
        .glow-2 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 800px; height: 800px; border-radius: 50%;
          bottom: -400px; left: -300px;
          background: radial-gradient(circle, rgba(191,160,96,0.03) 0%, transparent 60%);
        }

        /* ─── NAV ─── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 400;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          background: rgba(5,5,8,0.85);
          backdrop-filter: blur(48px) saturate(1.6);
          border-bottom: 0.5px solid var(--border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 600;
          letter-spacing: -0.2px; color: var(--white);
          text-decoration: none; flex-shrink: 0;
        }
        .nav-links {
          display: flex; gap: 40px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-links a {
          font-size: 13px; font-weight: 400;
          color: var(--white-40); text-decoration: none;
          letter-spacing: 0.01em; transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-links a:hover { color: var(--white); }
        .nav-actions { display: flex; gap: 8px; align-items: center; }
        .nav-signin {
          font-size: 13px; font-weight: 400;
          color: var(--white-60); background: none; border: none;
          padding: 8px 16px; cursor: pointer; border-radius: var(--radius-sm);
          transition: color 0.15s, background 0.15s;
          text-decoration: none; display: inline-block;
        }
        .nav-signin:hover { color: var(--white); background: var(--white-04); }
        .nav-cta {
          font-size: 13px; font-weight: 500;
          background: var(--indigo);
          color: #fff; border: none;
          padding: 9px 20px; border-radius: var(--radius-sm);
          cursor: pointer; letter-spacing: -0.1px;
          transition: background 0.15s, transform 0.1s;
          text-decoration: none; display: inline-block;
        }
        .nav-cta:hover { background: var(--indigo-l); }
        .nav-cta:active { transform: scale(0.98); }

        /* ─── HERO ─── */
        .hero {
          position: relative; z-index: 1;
          min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 96px 48px 80px;
          max-width: 1280px; margin: 0 auto;
        }
        .hero-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--indigo-l); margin-bottom: 40px;
          display: flex; align-items: center; gap: 12px;
          opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        .hero-label-line {
          width: 24px; height: 1px; background: var(--indigo-l); flex-shrink: 0;
        }
        .hero-h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(52px, 8vw, 120px);
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -3px;
          color: var(--white);
          margin-bottom: 0;
          opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .hero-h1 em {
          font-style: italic;
          font-weight: 300;
          color: var(--indigo-l);
        }
        .hero-divider {
          width: 100%; height: 0.5px; margin: 48px 0;
          background: linear-gradient(90deg, var(--indigo), rgba(84,72,228,0.08), transparent);
          opacity: 0; animation: fadeUp 0.6s ease 0.45s forwards;
        }
        .hero-body {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end;
          opacity: 0; animation: fadeUp 0.7s ease 0.55s forwards;
        }
        .hero-desc {
          font-size: 16px; font-weight: 300;
          color: var(--white-60); line-height: 1.75;
          max-width: 420px;
        }
        .hero-desc strong { color: var(--white); font-weight: 500; }
        .hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 32px; }
        .hero-metrics { display: flex; gap: 40px; }
        .metric-val {
          font-family: 'Fraunces', serif;
          font-size: 38px; font-weight: 300;
          letter-spacing: -1.5px; color: var(--white); line-height: 1;
          margin-bottom: 6px;
        }
        .metric-val span { color: var(--indigo-l); }
        .metric-label {
          font-size: 11px; font-weight: 300;
          color: var(--white-40); line-height: 1.5;
        }
        .hero-btns { display: flex; gap: 12px; align-items: center; }
        .btn-lg {
          font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 500;
          background: var(--indigo);
          color: #fff; border: none;
          padding: 12px 28px; border-radius: var(--radius-sm);
          cursor: pointer; letter-spacing: -0.1px;
          transition: background 0.15s, transform 0.1s;
          text-decoration: none; display: inline-block;
        }
        .btn-lg:hover { background: var(--indigo-l); }
        .btn-lg:active { transform: scale(0.98); }
        .btn-text {
          font-size: 14px; font-weight: 400;
          color: var(--white-40); background: none; border: none;
          cursor: pointer; padding: 12px 0;
          transition: color 0.15s; text-decoration: none;
          display: inline-block;
        }
        .btn-text:hover { color: var(--white); }

        /* ─── PAGE WRAPPER ─── */
        .page-max {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
        }

        /* ─── SECTION HEADER ─── */
        .s-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--indigo-l);
          margin-bottom: 16px;
        }
        .s-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 4.5vw, 64px);
          font-weight: 300; line-height: 0.95;
          letter-spacing: -2px; color: var(--white);
          margin-bottom: 16px;
        }
        .s-h2 em { font-style: italic; color: var(--indigo-l); }
        .s-body {
          font-size: 15px; font-weight: 300;
          color: var(--white-40); line-height: 1.75;
          max-width: 480px; margin-bottom: 56px;
        }

        /* ─── DIVIDER ─── */
        .divider {
          height: 0.5px; background: var(--border);
          position: relative; z-index: 1;
        }

        /* ══════════════════════════════════════
           VAULT SECTION
        ══════════════════════════════════════ */
        .vault-wrap {
          padding: 0 48px 112px;
        }
        .vault-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 40px;
        }
        .vault-header-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--white-40);
          display: flex; align-items: center; gap: 12px;
        }
        .vault-header-label::before {
          content: ''; width: 24px; height: 0.5px;
          background: var(--white-40); flex-shrink: 0;
        }
        .vault-deal-id {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: var(--indigo-l);
          letter-spacing: 0.06em;
        }

        /* Three-column vault */
        .vault-cols {
          display: grid;
          grid-template-columns: 1fr 280px 1fr;
          border: 0.5px solid var(--border-md);
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface);
          min-height: 420px;
        }

        /* Party columns */
        .party-col {
          padding: 48px 40px;
          display: flex; flex-direction: column;
          justify-content: space-between;
          border-right: 0.5px solid var(--border);
        }
        .party-col.recv {
          border-right: none;
          border-left: 0.5px solid var(--border);
          align-items: flex-end; text-align: right;
        }

        .p-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--white-20);
          margin-bottom: 16px;
        }
        .p-identity { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .party-col.recv .p-identity { flex-direction: row-reverse; }

        .p-avatar {
          width: 44px; height: 44px; border-radius: var(--radius-md);
          background: var(--surface4);
          border: 0.5px solid var(--border-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 600; color: var(--white);
          flex-shrink: 0;
        }
        .p-name {
          font-size: 16px; font-weight: 500;
          color: var(--white); letter-spacing: -0.2px;
          margin-bottom: 3px;
        }
        .p-kyc {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: var(--green);
          display: flex; align-items: center; gap: 5px;
        }
        .party-col.recv .p-kyc { justify-content: flex-end; }

        .p-amount-section { margin-bottom: 28px; }
        .p-amount-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--white-20);
          margin-bottom: 8px;
        }
        .p-amount {
          font-family: 'Fraunces', serif;
          font-size: 44px; font-weight: 300;
          letter-spacing: -2px; line-height: 1;
          color: var(--white); transition: color 0.5s;
        }
        .p-amount.amt-pending { color: var(--white-20); font-style: italic; }
        .p-amount.amt-released { color: var(--green); }
        .p-state {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; margin-top: 10px;
          letter-spacing: 0.04em; transition: color 0.4s;
          color: var(--white-20);
        }
        .p-state.st-locked { color: var(--indigo-l); }
        .p-state.st-done   { color: var(--green); }

        /* "Seeing" indicator */
        .p-seeing {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: var(--indigo-dim);
          border: 0.5px solid rgba(84,72,228,0.2);
          border-radius: var(--radius-sm);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.08em;
          color: var(--indigo-l);
        }
        .party-col.recv .p-seeing { justify-content: flex-end; }
        .seeing-pulse {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--indigo-l); flex-shrink: 0;
          animation: pulse 2.4s ease-in-out infinite;
        }

        /* Center vault column */
        .vault-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px; gap: 16px;
          position: relative;
        }

        /* Horizontal wires */
        .wire-left, .wire-right {
          position: absolute; top: 50%; width: 100%;
          pointer-events: none; z-index: 0; overflow: visible;
        }

        .vault-id-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: var(--indigo-l);
          letter-spacing: 0.08em; text-align: center;
        }

        /* THE VAULT SVG */
        .vault-svg-wrap {
          position: relative; width: 148px; height: 148px; flex-shrink: 0;
        }
        .vault-float-amount {
          position: absolute;
          top: -18px; left: 50%; transform: translateX(-50%);
          background: var(--surface3);
          border: 0.5px solid var(--border-md);
          border-radius: var(--radius-sm);
          padding: 5px 12px;
          font-family: 'Fraunces', serif;
          font-size: 18px; font-weight: 300;
          color: var(--white); letter-spacing: -0.5px;
          white-space: nowrap; z-index: 2;
          transition: color 0.5s;
        }
        .vault-float-amount.fa-released { color: var(--green); }

        .vault-state-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px; border-radius: var(--radius-sm);
          transition: all 0.4s;
        }
        .vsb-locked {
          color: var(--indigo-l);
          background: var(--indigo-dim);
          border: 0.5px solid rgba(84,72,228,0.22);
        }
        .vsb-released {
          color: var(--green);
          background: var(--green-dim);
          border: 0.5px solid rgba(46,173,110,0.22);
        }

        .vault-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--white-20); text-align: center; line-height: 1.6;
        }

        /* ─── AUDIT LOG STRIP ─── */
        .audit-log {
          border-top: 0.5px solid var(--border);
          background: var(--void);
          border-radius: 0 0 var(--radius-xl) var(--radius-xl);
          padding: 24px 40px;
          display: flex; gap: 0; overflow-x: auto;
          scrollbar-width: none;
        }
        .audit-log::-webkit-scrollbar { display: none; }
        .audit-entry {
          flex-shrink: 0;
          padding-right: 40px; margin-right: 40px;
          border-right: 0.5px solid var(--border);
          display: flex; flex-direction: column; gap: 3px;
          opacity: 0; animation: fadeUp 0.35s ease forwards;
        }
        .audit-entry:last-child { border-right: none; padding-right: 0; margin-right: 0; }
        .ae-time {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--white-20); letter-spacing: 0.04em;
        }
        .ae-event { font-size: 12px; color: var(--white); font-weight: 400; }
        .ae-actor {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--indigo-l);
        }

        /* ══════════════════════════════════════
           DEAL FLOW STEPS
        ══════════════════════════════════════ */
        .steps-section {
          padding: 96px 48px;
        }
        .steps-row {
          display: grid; grid-template-columns: repeat(5, 1fr);
          position: relative; gap: 0;
        }
        .steps-row::before {
          content: '';
          position: absolute;
          top: 30px; left: 30px; right: 30px; height: 0.5px;
          background: linear-gradient(90deg,
            transparent,
            rgba(84,72,228,0.4) 10%,
            rgba(84,72,228,0.4) 90%,
            transparent
          );
          z-index: 0;
        }
        .step-item {
          display: flex; flex-direction: column;
          align-items: flex-start; padding-right: 20px;
          position: relative; z-index: 1;
        }
        .step-icon-wrap {
          width: 60px; height: 60px; border-radius: var(--radius-md);
          background: var(--surface2);
          border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; color: var(--white-20);
          transition: all 0.3s;
        }
        .step-item.si-active .step-icon-wrap {
          background: var(--indigo-dim);
          border-color: rgba(84,72,228,0.35);
          color: var(--indigo-l);
        }
        .step-item.si-done .step-icon-wrap {
          background: var(--green-dim);
          border-color: rgba(46,173,110,0.28);
          color: var(--green);
        }
        .step-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--white-20);
          letter-spacing: 0.12em; margin-bottom: 7px;
        }
        .step-title {
          font-size: 13px; font-weight: 500;
          color: var(--white); margin-bottom: 6px;
          letter-spacing: -0.1px;
        }
        .step-desc {
          font-size: 12px; color: var(--white-40);
          font-weight: 300; line-height: 1.55;
        }

        /* ══════════════════════════════════════
           DEAL MODES
        ══════════════════════════════════════ */
        .modes-section { padding: 96px 48px; }
        .modes-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: var(--radius-xl); overflow: hidden;
        }
        .mode-card {
          background: var(--surface);
          padding: 48px 40px;
          position: relative; overflow: hidden;
          transition: background 0.2s;
        }
        .mode-card:hover { background: var(--surface2); }
        .mode-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: var(--indigo);
          opacity: 0; transition: opacity 0.2s;
        }
        .mode-card:hover::after { opacity: 1; }
        .mode-card.enterprise-card::after { background: var(--gold); }

        .mc-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--white-08);
          letter-spacing: 0.12em; margin-bottom: 28px;
        }
        .mc-icon {
          width: 48px; height: 48px; border-radius: var(--radius-md);
          background: var(--surface3);
          border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .mc-title {
          font-family: 'Fraunces', serif;
          font-size: 26px; font-weight: 300;
          color: var(--white); letter-spacing: -0.8px;
          margin-bottom: 10px; line-height: 1;
        }
        .mc-desc {
          font-size: 13px; color: var(--white-40);
          font-weight: 300; line-height: 1.7;
          margin-bottom: 24px;
        }
        .mc-range {
          display: inline-flex; align-items: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; color: var(--gold);
          background: var(--gold-dim);
          border: 0.5px solid rgba(191,160,96,0.15);
          padding: 4px 11px; border-radius: 5px;
          margin-bottom: 20px; letter-spacing: 0.04em;
        }
        .mc-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 8px;
        }
        .mc-features li {
          font-size: 12px; color: var(--white-40);
          font-weight: 300; line-height: 1.4;
          display: flex; align-items: flex-start; gap: 9px;
        }
        .mc-features li::before {
          content: '';
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--indigo-l); flex-shrink: 0; margin-top: 6px;
        }

        /* ══════════════════════════════════════
           PAYOUTS
        ══════════════════════════════════════ */
        .payouts-section { padding: 96px 48px; }
        .payout-tbl {
          border: 0.5px solid var(--border);
          border-radius: var(--radius-xl); overflow: hidden;
        }
        .pt-head {
          display: grid; grid-template-columns: 1fr auto;
          padding: 14px 36px;
          background: rgba(84,72,228,0.04);
          border-bottom: 0.5px solid var(--border);
        }
        .pt-head span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--white-20);
        }
        .pt-row {
          display: grid; grid-template-columns: 1fr auto;
          padding: 24px 36px; gap: 24px;
          border-bottom: 0.5px solid var(--border);
          align-items: center; transition: background 0.15s;
        }
        .pt-row:last-child { border-bottom: none; }
        .pt-row:hover { background: var(--surface2); }
        .pt-method {
          font-size: 13px; font-weight: 500;
          color: var(--white); margin-bottom: 3px;
          letter-spacing: -0.1px;
        }
        .pt-desc {
          font-size: 12px; color: var(--white-40); font-weight: 300;
        }
        .pt-speed {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; font-weight: 500;
          color: var(--green); white-space: nowrap; text-align: right;
        }
        .pt-speed.spd-slow { color: var(--white-20); }

        /* ══════════════════════════════════════
           CLOSING
        ══════════════════════════════════════ */
        .closing-wrap { padding: 0 48px 128px; }
        .closing-inner {
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--radius-xl);
          padding: 96px 80px;
          text-align: center; position: relative; overflow: hidden;
        }
        .closing-inner::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 480px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .closing-inner::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% -20%, rgba(84,72,228,0.04) 0%, transparent 55%);
        }
        .ci-content { position: relative; z-index: 1; }
        .ci-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 40px;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .ci-eyebrow::before, .ci-eyebrow::after {
          content: ''; flex: 1; max-width: 48px;
          height: 0.5px; background: var(--gold); opacity: 0.35;
        }
        .ci-h {
          font-family: 'Fraunces', serif;
          font-size: clamp(38px, 4.8vw, 68px);
          font-weight: 300; line-height: 0.95;
          letter-spacing: -2.5px; color: var(--white);
          max-width: 760px; margin: 0 auto 24px;
        }
        .ci-h em { font-style: italic; color: var(--indigo-l); }
        .ci-p {
          font-size: 15px; color: var(--white-40);
          font-weight: 300; line-height: 1.75;
          max-width: 500px; margin: 0 auto 48px;
        }
        .ci-btns {
          display: flex; gap: 12px; justify-content: center; align-items: center;
          margin-bottom: 48px;
        }
        .ci-tags {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
        }
        .ci-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.08em;
          color: var(--white-20);
          background: var(--white-04);
          border: 0.5px solid var(--border-md);
          padding: 5px 12px; border-radius: 5px;
        }

        /* ─── FOOTER ─── */
        footer {
          position: relative; z-index: 1;
          border-top: 0.5px solid var(--border);
          padding: 40px 48px;
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .f-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 600; color: var(--white);
          letter-spacing: -0.2px;
        }
        .f-nav { display: flex; gap: 28px; list-style: none; }
        .f-nav a {
          font-size: 12px; color: var(--white-40); font-weight: 300;
          text-decoration: none; transition: color 0.15s;
        }
        .f-nav a:hover { color: var(--white); }
        .f-copy {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; color: var(--white-08); letter-spacing: 0.06em;
        }

        /* ─── KEYFRAMES ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes wirePulse {
          0%   { stroke-dashoffset: 120; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .wire-animated {
          stroke-dasharray: 30 90;
          animation: wirePulse 2s linear infinite;
        }
        .wire-animated-r {
          stroke-dasharray: 30 90;
          animation: wirePulse 2s linear 1s infinite;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .nav { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 88px 24px 64px; }
          .hero-body { grid-template-columns: 1fr; gap: 40px; }
          .hero-right { align-items: flex-start; }
          .hero-metrics { gap: 28px; }
          .vault-wrap { padding: 0 24px 80px; }
          .vault-cols {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .party-col {
            border-right: none;
            border-bottom: 0.5px solid var(--border);
          }
          .party-col.recv {
            border-left: none;
            border-top: 0.5px solid var(--border);
            align-items: flex-start; text-align: left;
          }
          .party-col.recv .p-identity { flex-direction: row; }
          .party-col.recv .p-kyc { justify-content: flex-start; }
          .party-col.recv .p-seeing { justify-content: flex-start; }
          .vault-center { border-top: 0.5px solid var(--border); padding: 48px 24px; }
          .audit-log { padding: 20px 24px; }
          .steps-section { padding: 64px 24px; }
          .steps-row { grid-template-columns: 1fr; gap: 32px; }
          .steps-row::before { display: none; }
          .modes-section { padding: 64px 24px; }
          .modes-grid { grid-template-columns: 1fr; }
          .payouts-section { padding: 64px 24px; }
          .closing-wrap { padding: 0 24px 80px; }
          .closing-inner { padding: 56px 24px; }
          .ci-btns { flex-direction: column; }
          footer { flex-direction: column; gap: 24px; padding: 40px 24px; text-align: center; }
          .f-nav { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* BG LAYERS */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="glow-1" aria-hidden="true" />
      <div className="glow-2" aria-hidden="true" />

      {/* ══ NAV ══ */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <a href="/" className="nav-logo" aria-label="Gagara home">
          <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7"  cy="15" r="5"   stroke="#5448E4" strokeWidth="1.25"/>
            <circle cx="23" cy="15" r="5"   stroke="#5448E4" strokeWidth="1.25"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.25"/>
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
          <a href="/sign-in"  className="nav-signin">Sign in</a>
          <a href="/get-started" className="nav-cta">Get started</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-label">
          <span className="hero-label-line" aria-hidden="true" />
          Programmable escrow — Interledger Open Payments
        </div>
        <h1 className="hero-h1" id="hero-heading">
          The oldest problem<br />in work — <em>solved.</em>
        </h1>
        <div className="hero-divider" aria-hidden="true" />
        <div className="hero-body">
          <p className="hero-desc">
            How do you trust a stranger with your money — or your time —
            before the relationship is proven?<br /><br />
            <strong>Gagara locks funds in a transparent vault visible to both parties.</strong> Neither
            can touch the money alone. Release happens only when both sides confirm.
          </p>
          <div className="hero-right">
            <div className="hero-metrics">
              <div>
                <div className="metric-val">3<span>×</span></div>
                <div className="metric-label">Deal modes<br />Personal · Business · Enterprise</div>
              </div>
              <div>
                <div className="metric-val">&lt;<span>1s</span></div>
                <div className="metric-label">Internal transfer<br />speed on Gagara</div>
              </div>
              <div>
                <div className="metric-val"><span>∞</span></div>
                <div className="metric-label">Simultaneous<br />deals per account</div>
              </div>
            </div>
            <div className="hero-btns">
              <a href="/get-started" className="btn-lg">Create your first deal</a>
              <a href="#vault" className="btn-text">See how it works →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VAULT ══ */}
      <div className="page-max">
        <div className="vault-wrap" id="vault">
          <div className="vault-header">
            <div className="vault-header-label">The glass vault — live deal</div>
            <div className="vault-deal-id">GGR-4829-KXMT</div>
          </div>

          {/* Three columns */}
          <div className="vault-cols">

            {/* PAYER */}
            <div className="party-col">
              <div>
                <div className="p-role">Payer</div>
                <div className="p-identity">
                  <div className="p-avatar">G</div>
                  <div>
                    <div className="p-name">@gaga</div>
                    <div className="p-kyc">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <circle cx="5" cy="5" r="4.5" fill="rgba(46,173,110,0.12)" stroke="#2EAD6E" strokeWidth="0.6"/>
                        <path d="M3 5l1.5 1.5L7 3.5" stroke="#2EAD6E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      KYC verified
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-amount-section">
                <div className="p-amount-label">
                  {released ? 'Released' : funded ? 'Deposited to vault' : 'Depositing'}
                </div>
                <div className="p-amount">$800.00</div>
                <div className={`p-state ${funded ? (released ? 'st-done' : 'st-locked') : ''}`}>
                  {released ? 'Deal complete' : funded ? 'Locked in escrow' : 'Funding vault...'}
                </div>
              </div>
              <div className="p-seeing">
                <div className="seeing-pulse" />
                {released ? 'Funds released to receiver' : funded ? 'Vault balance visible to you' : 'Awaiting deposit'}
              </div>
            </div>

            {/* CENTER VAULT */}
            <div className="vault-center">
              {/* Wire SVGs */}
              <svg style={{position:'absolute',top:'50%',left:'-1px',transform:'translateY(-50%)',width:'calc(100% + 2px)',height:'2px',overflow:'visible',pointerEvents:'none',zIndex:0}} aria-hidden="true">
                <line x1="0%" y1="1" x2="100%" y2="1" stroke="rgba(84,72,228,0.2)" strokeWidth="1"/>
                {funded && <line x1="0%" y1="1" x2="100%" y2="1" stroke="#5448E4" strokeWidth="1.5" className="wire-animated"/>}
              </svg>
              <svg style={{position:'absolute',top:'50%',right:'-1px',transform:'translateY(-50%)',width:'calc(100% + 2px)',height:'2px',overflow:'visible',pointerEvents:'none',zIndex:0}} aria-hidden="true">
                <line x1="0%" y1="1" x2="100%" y2="1" stroke="rgba(84,72,228,0.2)" strokeWidth="1"/>
                {released && <line x1="0%" y1="1" x2="100%" y2="1" stroke="#2EAD6E" strokeWidth="1.5" className="wire-animated-r"/>}
              </svg>

              <div className="vault-id-tag">GGR-4829-KXMT</div>

              {/* VAULT SVG */}
              <div className="vault-svg-wrap">
                <div className={`vault-float-amount ${released ? 'fa-released' : ''}`}>
                  {released ? '$800.00' : '$800.00'}
                </div>
                <svg viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}} aria-label="Vault holding funds" role="img">
                  {/* Outer ring */}
                  <circle cx="74" cy="74" r="70"
                    fill="none"
                    stroke={released ? 'rgba(46,173,110,0.12)' : 'rgba(84,72,228,0.08)'}
                    strokeWidth="0.5"
                    style={{transition:'stroke 0.6s'}}
                  />
                  <circle cx="74" cy="74" r="60"
                    fill="none"
                    stroke={released ? 'rgba(46,173,110,0.06)' : 'rgba(84,72,228,0.05)'}
                    strokeWidth="0.5"
                    style={{transition:'stroke 0.6s'}}
                  />
                  {/* Body */}
                  <rect x="26" y="40" width="96" height="74" rx="10"
                    fill="var(--surface3)"
                    stroke={released ? 'rgba(46,173,110,0.5)' : funded ? 'rgba(84,72,228,0.5)' : 'rgba(238,238,246,0.08)'}
                    strokeWidth="0.75"
                    style={{transition:'stroke 0.5s'}}
                  />
                  {/* Door */}
                  <rect x="46" y="56" width="56" height="40" rx="6"
                    fill="var(--surface4)"
                    stroke={released ? 'rgba(46,173,110,0.3)' : funded ? 'rgba(84,72,228,0.3)' : 'rgba(238,238,246,0.06)'}
                    strokeWidth="0.5"
                    style={{transition:'stroke 0.5s'}}
                  />
                  {/* Corner bolts */}
                  {[[30,48],[118,48],[30,108],[118,108]].map(([cx,cy],i) => (
                    <circle key={i} cx={cx} cy={cy} r="3"
                      fill="var(--surface4)"
                      stroke="rgba(238,238,246,0.06)" strokeWidth="0.5"
                    />
                  ))}
                  {/* Lock mechanism */}
                  <circle cx="74" cy="76" r="14"
                    fill={released ? 'rgba(46,173,110,0.1)' : 'rgba(84,72,228,0.08)'}
                    stroke={released ? '#2EAD6E' : '#5448E4'}
                    strokeWidth="0.75"
                    style={{transition:'all 0.5s'}}
                  />
                  {!released ? (
                    <>
                      <rect x="69" y="73" width="10" height="8" rx="2"
                        fill={funded ? '#5448E4' : 'rgba(84,72,228,0.3)'}
                        style={{transition:'fill 0.4s'}}
                      />
                      <path d="M71 73v-3.5a3 3 0 016 0V73"
                        stroke={funded ? '#5448E4' : 'rgba(84,72,228,0.3)'}
                        strokeWidth="1.25" strokeLinecap="round"
                        style={{transition:'stroke 0.4s'}}
                      />
                    </>
                  ) : (
                    <path d="M69.5 76l3 3L79.5 72"
                      stroke="#2EAD6E" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  )}
                  {/* Handle */}
                  <rect x="71" y="96" width="6" height="11" rx="3"
                    fill="rgba(238,238,246,0.05)"
                    stroke="rgba(238,238,246,0.06)" strokeWidth="0.5"
                  />
                  {/* GAGARA label */}
                  <text x="74" y="128" textAnchor="middle"
                    fill="rgba(84,72,228,0.35)"
                    fontSize="6.5" fontFamily="IBM Plex Mono, monospace"
                    letterSpacing="2.5">GAGARA</text>
                </svg>
              </div>

              <div className={`vault-state-badge ${released ? 'vsb-released' : 'vsb-locked'}`}>
                {released ? 'Released' : funded ? 'Funded & locked' : 'Linked'}
              </div>

              <div className="vault-caption">
                Held by Gagara<br />Neither party can act alone
              </div>
            </div>

            {/* RECEIVER */}
            <div className="party-col recv">
              <div>
                <div className="p-role">Receiver</div>
                <div className="p-identity">
                  <div className="p-avatar">C</div>
                  <div>
                    <div className="p-name">@client</div>
                    <div className="p-kyc">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <circle cx="5" cy="5" r="4.5" fill="rgba(46,173,110,0.12)" stroke="#2EAD6E" strokeWidth="0.6"/>
                        <path d="M3 5l1.5 1.5L7 3.5" stroke="#2EAD6E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      KYC verified
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-amount-section">
                <div className="p-amount-label">
                  {released ? 'Received' : funded ? 'Awaiting release' : 'Pending'}
                </div>
                <div className={`p-amount ${released ? 'amt-released' : 'amt-pending'}`}>
                  {released ? '$800.00' : 'awaiting'}
                </div>
                <div className={`p-state ${released ? 'st-done' : ''}`}>
                  {released ? 'Funds received' : funded ? 'Visible in vault — confirmation pending' : 'Not yet funded'}
                </div>
              </div>
              <div className="p-seeing">
                <div className="seeing-pulse" />
                {released ? 'Transaction complete' : funded ? 'Vault balance visible to you' : 'Waiting for deposit'}
              </div>
            </div>
          </div>

          {/* AUDIT LOG */}
          <div style={{background:'var(--surface)', border:'0.5px solid var(--border-md)', borderTop:'none', borderRadius:'0 0 var(--radius-xl) var(--radius-xl)', overflow:'hidden'}}>
            <div className="audit-log" role="log" aria-label="Deal audit log" aria-live="polite">
              {auditLog.map((entry, i) => (
                <div key={`${i}-${phase}`} className="audit-entry" style={{animationDelay:`${i * 0.07}s`}}>
                  <div className="ae-time">{entry.t}</div>
                  <div className="ae-event">{entry.e}</div>
                  <div className="ae-actor">{entry.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ══ DEAL FLOW ══ */}
      <div className="page-max">
        <section className="steps-section" id="how" aria-labelledby="how-heading">
          <div className="s-label">Deal flow</div>
          <h2 className="s-h2" id="how-heading">Five states. <em>No exceptions.</em></h2>
          <p className="s-body">
            Every deal on Gagara follows the same deterministic sequence.
            No state can be skipped. Every transition is logged permanently
            and visible to both parties in real time.
          </p>
          <div className="steps-row">
            {[
              {
                n:'01', title:'Linked',
                desc:'Deal code shared. Both parties connected. The Link closes. Awaiting deposit.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              },
              {
                n:'02', title:'Funded & Locked',
                desc:'Payer deposits. Funds enter the vault. Both see the balance. Neither acts alone.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              },
              {
                n:'03', title:'In Progress',
                desc:'Work proceeds. Milestones tracked. Every update timestamped. Nothing unrecorded.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              },
              {
                n:'04', title:'Confirming',
                desc:'Conditions met. Dual confirmation required. No unilateral action. Ever.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              },
              {
                n:'05', title:'Released',
                desc:'Payout routed via Interledger. Deal archived permanently. Relationship saved.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
              },
            ].map((s, i) => {
              const currentStep = phase;
              const isActive = i === currentStep;
              const isDone   = i < currentStep || released;
              return (
                <div key={i} className={`step-item ${isActive ? 'si-active' : ''} ${isDone ? 'si-done' : ''}`}>
                  <div className="step-icon-wrap" aria-hidden="true">{s.icon}</div>
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

      {/* ══ DEAL MODES ══ */}
      <div className="page-max">
        <section className="modes-section" id="modes" aria-labelledby="modes-heading">
          <div className="s-label">Deal modes</div>
          <h2 className="s-h2" id="modes-heading">One platform. <em>Every context.</em></h2>
          <p className="s-body">
            Your account type is set once at signup — who you are legally on Gagara.
            Your deal mode is chosen each time — what kind of agreement this is.
          </p>
          <div className="modes-grid">
            {[
              {
                n:'01', enterprise: false,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                title:'Personal',
                desc:'Freelancers, informal agreements, P2P transactions. Simple terms, fast setup, full protection from day one.',
                range:'$1 – $2,000',
                features:['Single-release condition','48-hour deal code expiry','Instant mutual release','Full audit trail']
              },
              {
                n:'02', enterprise: false,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                title:'Business',
                desc:'Service contracts, supplier agreements, milestone-based deals between companies and individuals.',
                range:'$200 – $50,000',
                features:['Multi-milestone releases','Flexible timeline editing','Invoice generation','Priority dispute resolution']
              },
              {
                n:'03', enterprise: true,
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.25" strokeLinecap="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
                title:'Enterprise',
                desc:'Large multi-milestone contracts, multi-party agreements, API-driven integrations at scale.',
                range:'$10,000+',
                features:['Multi-party deals','API access','Compliance documentation','Dedicated mediation']
              },
            ].map((m, i) => (
              <div key={i} className={`mode-card ${m.enterprise ? 'enterprise-card' : ''}`}>
                <div className="mc-num">{m.n}</div>
                <div className="mc-icon" aria-hidden="true">{m.icon}</div>
                <div className="mc-title">{m.title}</div>
                <div className="mc-desc">{m.desc}</div>
                <div className="mc-range">{m.range}</div>
                <ul className="mc-features" aria-label={`${m.title} features`}>
                  {m.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="divider" aria-hidden="true" />

      {/* ══ PAYOUTS ══ */}
      <div className="page-max">
        <section className="payouts-section" id="payouts" aria-labelledby="payouts-heading">
          <div className="s-label">Payout infrastructure</div>
          <h2 className="s-h2" id="payouts-heading">Fastest route to <em>your money.</em></h2>
          <p className="s-body">
            The receiver chooses their payout method. Gagara shows the estimated arrival time
            before any confirmation — always. Powered by Interledger Protocol: currency-agnostic,
            network-agnostic, built for everyone.
          </p>
          <div className="payout-tbl" role="table" aria-label="Payout methods and speeds">
            <div className="pt-head" role="row">
              <span role="columnheader">Method</span>
              <span role="columnheader">Estimated speed</span>
            </div>
            {[
              {method:'Gagara internal transfer', desc:'Both parties on Gagara — funds stay on-network',          speed:'< 1 second',   fast:true },
              {method:'SEPA Instant',             desc:'European bank accounts — always-on instant rail',        speed:'< 10 seconds', fast:true },
              {method:'Faster Payments (UK)',     desc:'UK bank accounts — free, 24/7',                          speed:'< 2 minutes',  fast:true },
              {method:'Stablecoin (USDC · USDT)', desc:'Cross-border, unbanked — minimal operational cost',     speed:'2 – 5 minutes',fast:true },
              {method:'Mobile wallet (M-Pesa · GCash)', desc:'Africa · Southeast Asia — reaches the unbanked',  speed:'< 5 minutes',  fast:true },
              {method:'Standard bank transfer',   desc:'Universal fallback — all global accounts',               speed:'1 – 3 days',   fast:false},
            ].map((p, i) => (
              <div key={i} className="pt-row" role="row">
                <div role="cell">
                  <div className="pt-method">{p.method}</div>
                  <div className="pt-desc">{p.desc}</div>
                </div>
                <div className={`pt-speed ${p.fast ? '' : 'spd-slow'}`} role="cell">{p.speed}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══ CLOSING ══ */}
      <div className="page-max">
        <div className="closing-wrap">
          <div className="closing-inner">
            <div className="ci-content">
              <div className="ci-eyebrow">Built on Interledger Open Payments</div>
              <h2 className="ci-h">
                Gagara solves the oldest<br />problem in work — <em>trust.</em>
              </h2>
              <p className="ci-p">
                Lock funds. Confirm conditions. Release with certainty.
                For the freelancer in Manila, the contractor in Lagos,
                the supplier in London — and everyone in between.
              </p>
              <div className="ci-btns">
                <a href="/get-started" className="btn-lg">Create your first deal</a>
                <a href="/sign-in" className="btn-text">Sign in →</a>
              </div>
              <div className="ci-tags">
                {['Interledger Open Payments','ILP Protocol','Web Monetization','AES-256 Encryption','KYC Verified','Audit Trail','Mobile-first','Cross-border'].map((tag, i) => (
                  <span key={i} className="ci-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="f-logo">
          <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="7"  cy="15" r="5"   stroke="#5448E4" strokeWidth="1.25"/>
            <circle cx="23" cy="15" r="5"   stroke="#5448E4" strokeWidth="1.25"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5448E4" strokeWidth="1.25"/>
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
        <div className="f-copy">© 2026 Gagara · All rights reserved</div>
      </footer>
    </>
  );
}
