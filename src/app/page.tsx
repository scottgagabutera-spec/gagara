'use client';

import { useState, useEffect } from 'react';

export default function GagaraHome() {
  const [phase, setPhase] = useState(0);
  // 0=linked, 1=funded, 2=working, 3=confirmed, 4=released
  // auto-cycle the vault demo
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1800),
      setTimeout(() => setPhase(2), 3600),
      setTimeout(() => setPhase(3), 5400),
      setTimeout(() => setPhase(4), 7000),
      setTimeout(() => setPhase(0), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // restart cycle when it resets
  useEffect(() => {
    if (phase !== 0) return;
    const timers = [
      setTimeout(() => setPhase(1), 1800),
      setTimeout(() => setPhase(2), 3600),
      setTimeout(() => setPhase(3), 5400),
      setTimeout(() => setPhase(4), 7000),
      setTimeout(() => setPhase(0), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const released = phase === 4;
  const confirmed = phase >= 3;
  const working = phase >= 2;
  const funded = phase >= 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:    #06060A;
          --obsidian: #09090F;
          --surface:  #0E0E18;
          --surface2: #131320;
          --surface3: #1A1A2E;
          --indigo:   #5B4FE8;
          --indigo-l: #7B70F0;
          --indigo-d: rgba(91,79,232,0.12);
          --gold:     #C9A84C;
          --gold-d:   rgba(201,168,76,0.07);
          --green:    #3DBA78;
          --green-d:  rgba(61,186,120,0.1);
          --white:    #EFEFF5;
          --muted:    rgba(239,239,245,0.4);
          --faint:    rgba(239,239,245,0.08);
          --border:   rgba(255,255,255,0.055);
          --border2:  rgba(255,255,255,0.09);
        }

        html { scroll-behavior: smooth; }
        body {
          background: var(--black);
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        ::selection { background: rgba(91,79,232,0.28); color: var(--white); }

        /* NOISE */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* GRID */
        .g-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(91,79,232,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,79,232,0.022) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        /* GLOWS */
        .glow-a {
          position: fixed; z-index: 0; pointer-events: none;
          width: 900px; height: 900px; border-radius: 50%;
          top: -400px; right: -350px;
          background: radial-gradient(circle, rgba(91,79,232,0.055) 0%, transparent 65%);
        }
        .glow-b {
          position: fixed; z-index: 0; pointer-events: none;
          width: 700px; height: 700px; border-radius: 50%;
          bottom: -300px; left: -250px;
          background: radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 65%);
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 300;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 60px; height: 68px;
          background: rgba(6,6,10,0.8);
          backdrop-filter: blur(40px) saturate(1.5);
          border-bottom: 0.5px solid var(--border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 500;
          letter-spacing: -0.3px; color: var(--white);
          text-decoration: none;
        }
        .nav-center {
          display: flex; gap: 44px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-center a {
          font-size: 13px; font-weight: 300; color: var(--muted);
          text-decoration: none; letter-spacing: 0.01em;
          transition: color 0.15s;
        }
        .nav-center a:hover { color: var(--white); }
        .nav-right {
          display: flex; gap: 12px; align-items: center;
        }
        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          background: var(--indigo);
          color: #fff; border: none;
          padding: 9px 22px; border-radius: 8px;
          cursor: pointer; letter-spacing: -0.1px;
          transition: opacity 0.15s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: var(--muted); background: none; border: none;
          cursor: pointer; padding: 9px 0;
          transition: color 0.15s; text-decoration: none;
        }
        .btn-ghost:hover { color: var(--white); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 130px 60px 80px;
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
        }
        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--indigo-l);
          margin-bottom: 40px;
          display: flex; align-items: center; gap: 14px;
          opacity: 0; animation: rise 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        .hero-eyebrow::before {
          content: ''; width: 28px; height: 0.5px; background: var(--indigo-l); flex-shrink: 0;
        }
        .hero-h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(56px, 7.5vw, 112px);
          font-weight: 400; line-height: 0.92;
          letter-spacing: -2.5px; color: var(--white);
          opacity: 0; animation: rise 1s cubic-bezier(0.16,1,0.3,1) 0.25s forwards;
        }
        .hero-h1 em { font-style: italic; color: var(--indigo-l); }
        .hero-rule {
          width: 100%; height: 0.5px;
          background: linear-gradient(90deg, var(--indigo), rgba(91,79,232,0.1), transparent);
          margin: 52px 0;
          opacity: 0; animation: rise 0.8s ease 0.5s forwards;
        }
        .hero-lower {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
          opacity: 0; animation: rise 0.8s ease 0.65s forwards;
        }
        .hero-desc {
          font-size: 17px; font-weight: 300;
          color: var(--muted); line-height: 1.75;
          max-width: 440px;
        }
        .hero-desc strong { color: var(--white); font-weight: 500; }
        .hero-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 32px;
        }
        .hero-stats {
          display: flex; gap: 48px;
        }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 40px; color: var(--white);
          letter-spacing: -1.5px; line-height: 1;
          margin-bottom: 6px;
        }
        .stat-num span { color: var(--indigo-l); }
        .stat-label {
          font-size: 12px; color: var(--muted);
          font-weight: 300; line-height: 1.5;
        }
        .hero-cta {
          display: flex; gap: 16px; align-items: center;
        }

        /* SECTION WRAPPER */
        .section {
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
          padding: 100px 60px;
        }
        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--indigo-l);
          margin-bottom: 20px;
        }
        .s-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(38px, 4.2vw, 62px);
          font-weight: 400; line-height: 1;
          letter-spacing: -1.8px; color: var(--white);
          margin-bottom: 18px;
        }
        .s-h2 em { font-style: italic; color: var(--indigo-l); }
        .s-sub {
          font-size: 15px; color: var(--muted);
          font-weight: 300; line-height: 1.75;
          max-width: 500px; margin-bottom: 60px;
        }
        .fw-line {
          height: 0.5px; background: var(--border);
          position: relative; z-index: 1;
        }

        /* ═══════════════════════════════════════
           VAULT ILLUSTRATION SECTION
        ════════════════════════════════════════ */
        .vault-section {
          position: relative; z-index: 1;
          padding: 0 60px 120px;
          max-width: 1300px; margin: 0 auto;
        }
        .vault-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 40px;
          display: flex; align-items: center; gap: 14px;
        }
        .vault-eyebrow::before {
          content: ''; width: 28px; height: 0.5px; background: var(--muted); flex-shrink: 0;
        }

        /* The three-column illustration */
        .vault-illustration {
          display: grid;
          grid-template-columns: 1fr 320px 1fr;
          gap: 0;
          align-items: center;
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 24px;
          overflow: hidden;
          min-height: 460px;
        }

        /* PARTY PANELS */
        .party-panel {
          padding: 56px 48px;
          display: flex; flex-direction: column;
          justify-content: space-between;
          height: 100%;
          border-right: 0.5px solid var(--border);
          position: relative;
        }
        .party-panel.receiver {
          border-right: none;
          border-left: 0.5px solid var(--border);
          align-items: flex-end; text-align: right;
        }

        .party-role {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 20px;
        }
        .party-identity {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 32px;
        }
        .party-panel.receiver .party-identity {
          flex-direction: row-reverse;
        }
        .avatar {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--surface3);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 500; color: var(--white);
          flex-shrink: 0;
        }
        .party-name {
          font-size: 18px; font-weight: 500;
          color: var(--white); letter-spacing: -0.3px;
          margin-bottom: 4px;
        }
        .party-verified {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--green);
          display: flex; align-items: center; gap: 5px;
        }
        .party-panel.receiver .party-verified {
          justify-content: flex-end;
        }

        /* The amount display */
        .party-amount-wrap {
          margin-bottom: 24px;
        }
        .party-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          color: var(--muted); margin-bottom: 8px;
          text-transform: uppercase;
        }
        .party-amount {
          font-family: 'Instrument Serif', serif;
          font-size: 48px; letter-spacing: -2px;
          line-height: 1; color: var(--white);
          transition: color 0.6s;
        }
        .party-amount.pending { color: var(--muted); font-style: italic; }
        .party-amount.received { color: var(--green); }

        .party-status {
          font-family: 'DM Mono', monospace;
          font-size: 11px; margin-top: 8px;
          transition: color 0.4s;
        }
        .party-status.locked { color: var(--indigo-l); }
        .party-status.released { color: var(--green); }
        .party-status.pending-s { color: var(--muted); }

        /* Party "sees" indicator */
        .party-sees {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px;
          background: var(--indigo-d);
          border: 0.5px solid rgba(91,79,232,0.2);
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--indigo-l);
          letter-spacing: 0.04em;
        }
        .party-panel.receiver .party-sees { flex-direction: row-reverse; }
        .eye-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--indigo-l);
          animation: blink 2.5s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* VAULT CENTER */
        .vault-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px; gap: 20px;
          position: relative; height: 100%;
        }

        /* The vault SVG container */
        .vault-graphic {
          position: relative;
          width: 160px; height: 160px;
          flex-shrink: 0;
        }

        /* Floating amount above vault */
        .vault-amount-float {
          position: absolute;
          top: -14px; left: 50%; transform: translateX(-50%);
          background: var(--surface3);
          border: 0.5px solid var(--border2);
          border-radius: 8px;
          padding: 6px 14px;
          font-family: 'Instrument Serif', serif;
          font-size: 22px; color: var(--white);
          letter-spacing: -0.5px;
          white-space: nowrap;
          z-index: 2;
          transition: color 0.5s;
        }
        .vault-amount-float.released-amt { color: var(--green); }

        /* Connection lines from party to vault */
        .vault-connectors {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        /* Vault status badge */
        .vault-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px; border-radius: 6px;
          transition: all 0.4s;
        }
        .vault-badge.active {
          color: var(--green);
          background: var(--green-d);
          border: 0.5px solid rgba(61,186,120,0.25);
        }
        .vault-badge.locked-b {
          color: var(--indigo-l);
          background: var(--indigo-d);
          border: 0.5px solid rgba(91,79,232,0.25);
        }

        /* Deal ID */
        .deal-id {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--indigo-l);
          letter-spacing: 0.06em;
        }

        /* Gagara label on vault */
        .gagara-holds {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          text-align: center;
          line-height: 1.5;
        }

        /* AUDIT STRIP */
        .audit-strip {
          border-top: 0.5px solid var(--border);
          background: var(--obsidian);
          padding: 24px 48px;
          display: flex; gap: 0; overflow-x: auto;
        }
        .audit-item {
          display: flex; flex-direction: column; gap: 3px;
          padding-right: 48px;
          border-right: 0.5px solid var(--border);
          margin-right: 48px;
          flex-shrink: 0;
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
        }
        .audit-item:last-child { border-right: none; margin-right: 0; }
        .audit-t {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--muted);
        }
        .audit-e {
          font-size: 12px; color: var(--white); font-weight: 400;
        }
        .audit-a {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--indigo-l);
        }

        /* CONNECTOR LINES SVG */
        .connector-svg {
          position: absolute;
          top: 50%; left: 0; width: 100%;
          transform: translateY(-50%);
          pointer-events: none; z-index: 0;
          overflow: visible;
        }

        /* ═══════════════════════════════════════
           HOW A DEAL WORKS — 5 STEPS
        ════════════════════════════════════════ */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute;
          top: 31px; left: 31px; right: 31px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--indigo) 15%, var(--indigo) 85%, transparent);
          z-index: 0;
        }
        .step {
          display: flex; flex-direction: column;
          align-items: flex-start;
          padding-right: 24px;
          position: relative; z-index: 1;
        }
        .step-node {
          width: 62px; height: 62px; border-radius: 14px;
          background: var(--surface2);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 22px;
          color: var(--muted);
          transition: all 0.3s;
        }
        .step.s-active .step-node {
          background: var(--indigo-d);
          border-color: rgba(91,79,232,0.4);
          color: var(--indigo-l);
        }
        .step.s-done .step-node {
          background: var(--green-d);
          border-color: rgba(61,186,120,0.3);
          color: var(--green);
        }
        .step-n {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--muted);
          letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .step-title {
          font-size: 14px; font-weight: 500;
          color: var(--white); margin-bottom: 6px;
        }
        .step-desc {
          font-size: 12px; color: var(--muted);
          font-weight: 300; line-height: 1.55;
        }

        /* ═══════════════════════════════════════
           DEAL MODES
        ════════════════════════════════════════ */
        .modes {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }
        .mode {
          background: var(--surface);
          padding: 52px 44px;
          position: relative;
          transition: background 0.2s;
        }
        .mode:hover { background: var(--surface2); }
        .mode::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: var(--indigo); opacity: 0; transition: opacity 0.2s;
        }
        .mode:hover::before { opacity: 1; }
        .mode-n {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--faint);
          letter-spacing: 0.1em; margin-bottom: 32px;
        }
        .mode-icon {
          width: 52px; height: 52px; border-radius: 13px;
          background: var(--surface3);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .mode-title {
          font-family: 'Instrument Serif', serif;
          font-size: 28px; font-weight: 400;
          color: var(--white); letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
        .mode-desc {
          font-size: 14px; color: var(--muted);
          font-weight: 300; line-height: 1.7;
          margin-bottom: 28px;
        }
        .mode-range {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--gold);
          background: var(--gold-d);
          border: 0.5px solid rgba(201,168,76,0.18);
          padding: 5px 13px; border-radius: 6px;
          margin-bottom: 24px;
        }
        .mode-list {
          list-style: none;
          display: flex; flex-direction: column; gap: 9px;
        }
        .mode-list li {
          font-size: 13px; color: var(--muted);
          font-weight: 300; line-height: 1.4;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .mode-list li::before {
          content: '';
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--indigo); flex-shrink: 0; margin-top: 6px;
        }

        /* ═══════════════════════════════════════
           PAYOUTS
        ════════════════════════════════════════ */
        .payout-table {
          border: 0.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }
        .pt-header {
          display: grid; grid-template-columns: 1fr auto;
          padding: 16px 40px;
          background: rgba(91,79,232,0.05);
          border-bottom: 0.5px solid var(--border);
        }
        .pt-header span {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--faint);
        }
        .pt-row {
          display: grid; grid-template-columns: 1fr auto;
          padding: 26px 40px;
          border-bottom: 0.5px solid var(--border);
          align-items: center; gap: 24px;
          transition: background 0.2s;
        }
        .pt-row:last-child { border-bottom: none; }
        .pt-row:hover { background: var(--surface2); }
        .pt-method {
          font-size: 14px; font-weight: 400;
          color: var(--white); margin-bottom: 3px;
        }
        .pt-desc {
          font-size: 12px; color: var(--muted); font-weight: 300;
        }
        .pt-speed {
          font-family: 'DM Mono', monospace;
          font-size: 13px; font-weight: 500;
          color: var(--green); white-space: nowrap; text-align: right;
        }
        .pt-speed.slow { color: var(--muted); }

        /* ═══════════════════════════════════════
           CLOSING STATEMENT
        ════════════════════════════════════════ */
        .closing {
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
          padding: 0 60px 140px;
        }
        .closing-box {
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 24px;
          padding: 100px 80px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .closing-box::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 500px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .closing-box::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(91,79,232,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .closing-inner { position: relative; z-index: 1; }
        .closing-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--gold);
          margin-bottom: 44px;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .closing-eyebrow::before,
        .closing-eyebrow::after {
          content: ''; flex: 1; max-width: 60px;
          height: 0.5px; background: var(--gold); opacity: 0.4;
        }
        .closing-h {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(40px, 4.5vw, 68px);
          font-weight: 400; line-height: 1.02;
          letter-spacing: -2px; color: var(--white);
          margin-bottom: 28px;
          max-width: 780px; margin-left: auto; margin-right: auto;
        }
        .closing-h em { font-style: italic; color: var(--indigo-l); }
        .closing-p {
          font-size: 16px; color: var(--muted);
          font-weight: 300; line-height: 1.75;
          max-width: 520px; margin: 0 auto 56px;
        }
        .closing-cta {
          display: flex; gap: 16px; justify-content: center; align-items: center;
        }
        .closing-badges {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 8px; margin-top: 52px;
        }
        .c-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.07em;
          color: var(--muted);
          background: rgba(255,255,255,0.025);
          border: 0.5px solid var(--border2);
          padding: 6px 14px; border-radius: 6px;
        }

        /* FOOTER */
        footer {
          position: relative; z-index: 1;
          border-top: 0.5px solid var(--border);
          padding: 48px 60px;
          max-width: 1300px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .f-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 500; color: var(--white);
        }
        .f-links { display: flex; gap: 28px; list-style: none; }
        .f-links a {
          font-size: 13px; color: var(--muted); font-weight: 300;
          text-decoration: none; transition: color 0.15s;
        }
        .f-links a:hover { color: var(--white); }
        .f-copy {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--faint); letter-spacing: 0.06em;
        }

        /* ANIMATIONS */
        @keyframes rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* PULSE on wire */
        @keyframes travel {
          0% { stroke-dashoffset: 200; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .wire-traveler {
          stroke-dasharray: 40 160;
          animation: travel 2.2s ease-in-out infinite;
        }
        .wire-traveler-r {
          stroke-dasharray: 40 160;
          animation: travel 2.2s ease-in-out 1.1s infinite;
        }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .nav { padding: 0 24px; }
          .nav-center { display: none; }
          .hero { padding: 120px 24px 60px; }
          .hero-lower { grid-template-columns: 1fr; gap: 40px; }
          .hero-right { align-items: flex-start; }
          .hero-stats { gap: 28px; }
          .vault-section { padding: 0 24px 80px; }
          .vault-illustration { grid-template-columns: 1fr; min-height: auto; }
          .party-panel { border-right: none; border-bottom: 0.5px solid var(--border); }
          .party-panel.receiver { border-left: none; border-top: 0.5px solid var(--border); align-items: flex-start; text-align: left; }
          .party-panel.receiver .party-identity { flex-direction: row; }
          .party-panel.receiver .party-verified { justify-content: flex-start; }
          .party-panel.receiver .party-sees { flex-direction: row; }
          .vault-center { padding: 40px 24px; }
          .audit-strip { padding: 20px 24px; }
          .section { padding: 60px 24px; }
          .steps-grid { grid-template-columns: 1fr; gap: 32px; }
          .steps-grid::before { display: none; }
          .modes { grid-template-columns: 1fr; }
          .closing { padding: 0 24px 80px; }
          .closing-box { padding: 56px 28px; }
          .closing-cta { flex-direction: column; }
          footer { flex-direction: column; gap: 24px; padding: 40px 24px; text-align: center; }
          .f-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <div className="g-grid" />
      <div className="glow-a" />
      <div className="glow-b" />

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
            <circle cx="7" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5B4FE8" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5B4FE8"/>
            <circle cx="7" cy="15" r="2" fill="#5B4FE8"/>
            <circle cx="23" cy="15" r="2" fill="#5B4FE8"/>
          </svg>
          Gagara
        </a>
        <div className="nav-center">
          <a href="#vault">The vault</a>
          <a href="#how">How it works</a>
          <a href="#modes">Deal modes</a>
          <a href="#payouts">Payouts</a>
        </div>
        <div className="nav-right">
          <a href="#" className="btn-ghost">Sign in</a>
          <a href="#" className="btn-primary">Get started</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          Programmable escrow — Interledger Open Payments
        </div>
        <h1 className="hero-h1">
          The oldest problem<br/>in work — <em>solved.</em>
        </h1>
        <div className="hero-rule" />
        <div className="hero-lower">
          <p className="hero-desc">
            How do you trust a stranger with your money — or your time —
            before the relationship is proven?<br/><br/>
            <strong>Gagara locks funds in a transparent vault visible to both parties.</strong> Neither can touch the money alone. Release only happens when both sides confirm.
          </p>
          <div className="hero-right">
            <div className="hero-stats">
              <div>
                <div className="stat-num">3<span>×</span></div>
                <div className="stat-label">Deal modes<br/>Personal · Business · Enterprise</div>
              </div>
              <div>
                <div className="stat-num">&lt;<span>1s</span></div>
                <div className="stat-label">Internal transfer<br/>speed on Gagara</div>
              </div>
              <div>
                <div className="stat-num"><span>∞</span></div>
                <div className="stat-label">Simultaneous<br/>deals per account</div>
              </div>
            </div>
            <div className="hero-cta">
              <a href="#" className="btn-primary">Create your first deal</a>
              <a href="#vault" className="btn-ghost">See how it works →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLASS VAULT ILLUSTRATION ── */}
      <div className="vault-section" id="vault">
        <div className="vault-eyebrow">The glass vault — both parties see everything</div>

        <div className="vault-illustration">
          {/* PAYER PANEL */}
          <div className="party-panel">
            <div>
              <div className="party-role">Payer</div>
              <div className="party-identity">
                <div className="avatar">G</div>
                <div>
                  <div className="party-name">@gaga</div>
                  <div className="party-verified">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.5" fill="rgba(61,186,120,0.15)" stroke="#3DBA78" strokeWidth="0.5"/>
                      <path d="M3 5l1.5 1.5L7 3.5" stroke="#3DBA78" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    KYC verified
                  </div>
                </div>
              </div>
            </div>

            <div className="party-amount-wrap">
              <div className="party-label">
                {funded ? (released ? 'Released' : 'Deposited to vault') : 'Depositing'}
              </div>
              <div className="party-amount">$800.00</div>
              <div className={`party-status ${funded ? (released ? 'released' : 'locked') : 'pending-s'}`} style={{marginTop:8}}>
                {released ? '✓ deal complete' : funded ? '⟳ locked in escrow' : 'funding vault...'}
              </div>
            </div>

            <div className="party-sees">
              <div className="eye-dot" />
              {released ? 'Funds received by receiver' : funded ? 'Vault balance visible to you' : 'Awaiting confirmation'}
            </div>
          </div>

          {/* CENTER VAULT */}
          <div className="vault-center">
            {/* Connection lines */}
            <svg className="connector-svg" viewBox="0 0 320 460" fill="none" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}>
              {/* Left wire */}
              <line x1="0" y1="230" x2="80" y2="230" stroke="rgba(91,79,232,0.3)" strokeWidth="1"/>
              {funded && <line x1="0" y1="230" x2="80" y2="230" stroke="#5B4FE8" strokeWidth="1.5" className="wire-traveler"/>}
              {/* Right wire */}
              <line x1="240" y1="230" x2="320" y2="230" stroke="rgba(91,79,232,0.3)" strokeWidth="1"/>
              {released && <line x1="240" y1="230" x2="320" y2="230" stroke="#3DBA78" strokeWidth="1.5" className="wire-traveler-r"/>}
            </svg>

            {/* Deal ID */}
            <div className="deal-id">GGR-4829-KXMT</div>

            {/* THE VAULT SVG */}
            <div className="vault-graphic">
              <div className={`vault-amount-float ${released ? 'released-amt' : ''}`}>
                {released ? '✓ $800' : '$800.00'}
              </div>
              <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
                {/* Outer glow */}
                <circle cx="80" cy="80" r="75" fill={released ? 'rgba(61,186,120,0.04)' : 'rgba(91,79,232,0.06)'} style={{transition:'fill 0.6s'}}/>
                {/* Vault body */}
                <rect x="28" y="44" width="104" height="80" rx="10"
                  fill="var(--surface3)"
                  stroke={released ? '#3DBA78' : funded ? '#5B4FE8' : 'rgba(255,255,255,0.1)'}
                  strokeWidth="1"
                  style={{transition:'stroke 0.5s'}}
                />
                {/* Vault door */}
                <rect x="54" y="62" width="52" height="44" rx="6"
                  fill="var(--surface2)"
                  stroke={released ? '#3DBA78' : funded ? 'rgba(91,79,232,0.6)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth="0.75"
                  style={{transition:'stroke 0.5s'}}
                />
                {/* Lock circle */}
                <circle cx="80" cy="84" r="12"
                  fill={released ? 'rgba(61,186,120,0.15)' : 'rgba(91,79,232,0.12)'}
                  stroke={released ? '#3DBA78' : '#5B4FE8'}
                  strokeWidth="1"
                  style={{transition:'all 0.5s'}}
                />
                {/* Lock icon */}
                {!released ? (
                  <>
                    <rect x="75" y="80" width="10" height="8" rx="1.5" fill={funded ? '#5B4FE8' : 'rgba(91,79,232,0.4)'} style={{transition:'fill 0.4s'}}/>
                    <path d="M77 80v-3a3 3 0 016 0v3" stroke={funded ? '#5B4FE8' : 'rgba(91,79,232,0.4)'} strokeWidth="1.25" strokeLinecap="round" style={{transition:'stroke 0.4s'}}/>
                  </>
                ) : (
                  <path d="M76 84l2.5 2.5L84 80" stroke="#3DBA78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
                {/* Handle */}
                <rect x="77" y="106" width="6" height="10" rx="3" fill="rgba(255,255,255,0.06)"/>
                {/* Top bolts */}
                <circle cx="40" cy="52" r="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                <circle cx="120" cy="52" r="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                <circle cx="40" cy="116" r="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                <circle cx="120" cy="116" r="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                {/* Gagara label inside */}
                <text x="80" y="138" textAnchor="middle" fill="rgba(91,79,232,0.5)" fontSize="7" fontFamily="DM Mono, monospace" letterSpacing="2">GAGARA</text>
              </svg>
            </div>

            <div className={`vault-badge ${released ? 'active' : 'locked-b'}`}>
              {released ? '✓ released' : funded ? '⚡ funded & locked' : 'linked'}
            </div>

            <div className="gagara-holds">
              Held by Gagara<br/>Neither party can act alone
            </div>
          </div>

          {/* RECEIVER PANEL */}
          <div className="party-panel receiver">
            <div>
              <div className="party-role">Receiver</div>
              <div className="party-identity">
                <div className="avatar">C</div>
                <div>
                  <div className="party-name">@client</div>
                  <div className="party-verified">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.5" fill="rgba(61,186,120,0.15)" stroke="#3DBA78" strokeWidth="0.5"/>
                      <path d="M3 5l1.5 1.5L7 3.5" stroke="#3DBA78" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    KYC verified
                  </div>
                </div>
              </div>
            </div>

            <div className="party-amount-wrap">
              <div className="party-label">
                {released ? 'Received' : funded ? 'Awaiting release' : 'Pending'}
              </div>
              <div className={`party-amount ${released ? 'received' : 'pending'}`}>
                {released ? '$800.00' : 'awaiting'}
              </div>
              <div className={`party-status ${released ? 'released' : 'pending-s'}`} style={{marginTop:8}}>
                {released ? '✓ funds received' : funded ? 'visible in vault — confirmation pending' : 'not yet funded'}
              </div>
            </div>

            <div className="party-sees" style={{justifyContent:'flex-end'}}>
              <div className="eye-dot" />
              {released ? 'Transaction complete' : funded ? 'Vault balance visible to you' : 'Waiting for funds'}
            </div>
          </div>
        </div>

        {/* AUDIT STRIP */}
        <div style={{background:'var(--surface)', border:'0.5px solid var(--border2)', borderTop:'none', borderRadius:'0 0 24px 24px', overflow:'hidden'}}>
          <div className="audit-strip">
            {[
              {t:'09:12:04', e:'Deal created', a:'@gaga'},
              {t:'09:15:22', e:'Deal linked — The Link closed', a:'@client accepted'},
              ...(funded ? [{t:'09:23:41', e:'$800.00 deposited to vault', a:'@gaga funded'}] : []),
              ...(working ? [{t:'10:44:08', e:'Milestone 1 marked complete', a:'@client'}] : []),
              ...(confirmed ? [{t:'11:02:15', e:'Completion confirmed', a:'@gaga'}] : []),
              ...(released ? [{t:'11:02:16', e:'$800.00 released via Interledger', a:'→ instant'}] : []),
            ].map((item, i) => (
              <div key={i} className="audit-item" style={{animationDelay:`${i * 0.08}s`}}>
                <div className="audit-t">{item.t}</div>
                <div className="audit-e">{item.e}</div>
                <div className="audit-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fw-line" />

      {/* ── HOW A DEAL WORKS ── */}
      <section className="section" id="how">
        <div className="eyebrow">Deal flow</div>
        <h2 className="s-h2">Five states. <em>No exceptions.</em></h2>
        <p className="s-sub">
          Every deal follows the same deterministic sequence. No state can be skipped.
          Every action is logged permanently and visible to both parties.
        </p>
        <div className="steps-grid">
          {[
            {
              n:'01', title:'Linked',
              desc:'Deal code shared. Both parties connected. The Link closes. Awaiting fund deposit.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            },
            {
              n:'02', title:'Funded & Locked',
              desc:'Payer deposits. Funds enter the vault. Both parties see the balance. Neither can act alone.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            },
            {
              n:'03', title:'In Progress',
              desc:'Work happens. Milestones tracked. Every update is timestamped. Gagara watches everything.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            },
            {
              n:'04', title:'Confirming',
              desc:'Conditions met. Both parties confirm. Dual confirmation required. No unilateral action.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            },
            {
              n:'05', title:'Released',
              desc:'Payout routed instantly via Interledger. Deal archived permanently. Relationship saved.',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
            },
          ].map((s, i) => (
            <div key={i} className={`step ${i === (phase === 0 ? 0 : phase - 1) ? 's-active' : ''} ${i < (phase === 0 ? 0 : phase - 1) || released ? 's-done' : ''}`}>
              <div className="step-node">{s.icon}</div>
              <div className="step-n">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="fw-line" />

      {/* ── DEAL MODES ── */}
      <section className="section" id="modes">
        <div className="eyebrow">Deal modes</div>
        <h2 className="s-h2">One platform. <em>Every context.</em></h2>
        <p className="s-sub">
          Your account type — Individual or Business — is set once at signup.
          The deal mode is chosen each time you create a new agreement.
        </p>
        <div className="modes">
          {[
            {
              n:'01',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B70F0" strokeWidth="1.25" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
              title:'Personal',
              desc:'Freelancers, informal agreements, P2P transactions. Simple terms, fast setup, full protection.',
              range:'$1 – $2,000',
              items:['Single-release condition','48-hour deal code expiry','Instant mutual release','Full audit trail']
            },
            {
              n:'02',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B70F0" strokeWidth="1.25" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              title:'Business',
              desc:'Service contracts, supplier agreements, milestone-based deals. Structured, transparent, enforceable.',
              range:'$200 – $50,000',
              items:['Multi-milestone releases','Flexible timeline editing','Invoice generation','Priority dispute resolution']
            },
            {
              n:'03',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.25" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
              title:'Enterprise',
              desc:'Large multi-milestone contracts, multi-party agreements, API-driven integrations at scale.',
              range:'$10,000+',
              items:['Multi-party deals','API access','Compliance documentation','Dedicated mediation']
            },
          ].map((m, i) => (
            <div key={i} className="mode">
              <div className="mode-n">{m.n}</div>
              <div className="mode-icon">{m.icon}</div>
              <div className="mode-title">{m.title}</div>
              <div className="mode-desc">{m.desc}</div>
              <div className="mode-range">{m.range}</div>
              <ul className="mode-list">
                {m.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="fw-line" />

      {/* ── PAYOUTS ── */}
      <section className="section" id="payouts">
        <div className="eyebrow">Payout infrastructure</div>
        <h2 className="s-h2">Fastest route to <em>your money.</em></h2>
        <p className="s-sub">
          The receiver chooses their payout method. Gagara shows the estimated speed before
          any confirmation — always. Powered by Interledger: currency-agnostic, network-agnostic.
        </p>
        <div className="payout-table">
          <div className="pt-header">
            <span>Method</span>
            <span>Estimated speed</span>
          </div>
          {[
            {method:'Gagara internal transfer', desc:'Both parties on Gagara — funds stay on-network', speed:'< 1 second', fast:true},
            {method:'SEPA Instant', desc:'European bank accounts — always-on instant rail', speed:'< 10 seconds', fast:true},
            {method:'Faster Payments (UK)', desc:'UK bank accounts — free, 24/7', speed:'< 2 minutes', fast:true},
            {method:'Stablecoin (USDC · USDT)', desc:'Cross-border, unbanked — minimal operational cost', speed:'2 – 5 minutes', fast:true},
            {method:'Mobile wallet (M-Pesa · GCash)', desc:'Africa · Southeast Asia — reaches the unbanked', speed:'< 5 minutes', fast:true},
            {method:'Standard bank transfer', desc:'Universal fallback — all global accounts', speed:'1 – 3 days', fast:false},
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

      {/* ── CLOSING STATEMENT ── */}
      <div className="closing">
        <div className="closing-box">
          <div className="closing-inner">
            <div className="closing-eyebrow">Built on Interledger Open Payments</div>
            <h2 className="closing-h">
              Gagara solves the oldest<br/>problem in work — <em>trust.</em>
            </h2>
            <p className="closing-p">
              Lock funds. Confirm conditions. Release with certainty.
              For the freelancer in Manila, the contractor in Lagos,
              the supplier in London — and everyone in between.
            </p>
            <div className="closing-cta">
              <a href="#" className="btn-primary">Create your first deal</a>
              <a href="#" className="btn-ghost">Sign in →</a>
            </div>
            <div className="closing-badges">
              {['Interledger Open Payments','ILP Protocol','Web Monetization','AES-256 Encryption','KYC Verified','Audit Trail','Mobile-first','Cross-border'].map((b, i) => (
                <span key={i} className="c-badge">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="f-logo">
          <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
            <circle cx="7" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.2"/>
            <circle cx="23" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.2"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5B4FE8" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="2.5" fill="#5B4FE8"/>
            <circle cx="7" cy="15" r="2" fill="#5B4FE8"/>
            <circle cx="23" cy="15" r="2" fill="#5B4FE8"/>
          </svg>
          Gagara
        </div>
        <ul className="f-links">
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
