'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────
// DEMO MODE — flip to false before going live
// ─────────────────────────────────────────────
const DEMO_MODE = true;

// ─── TYPES ───────────────────────────────────
type VaultState = 'linked' | 'funded' | 'active' | 'confirming' | 'releasing' | 'complete' | 'disputed';
type MyRole     = 'payer' | 'receiver';

interface Milestone {
  id: string;
  label: string;
  percent: number;
  amount: number;
  payerConfirmed: boolean;
  receiverConfirmed: boolean;
  released: boolean;
}

interface Condition {
  id: string;
  text: string;
  payerConfirmed: boolean;
  receiverConfirmed: boolean;
}

interface AuditEntry {
  time: string;
  event: string;
  actor: string;
  highlight?: boolean;
}

// ─── DEMO DATA ────────────────────────────────
const DEMO: {
  code: string; mode: string; currency: string; amount: number;
  payer: string; payerVerified: boolean;
  receiver: string; receiverVerified: boolean;
  description: string; deadline: string;
  vaultState: VaultState; myRole: MyRole;
  milestones: Milestone[]; conditions: Condition[];
  audit: AuditEntry[];
} = {
  code: 'GGR-4829-KXMT', mode: 'Business',
  currency: 'USD', amount: 800.00,
  payer: '@gaga', payerVerified: true,
  receiver: '@client', receiverVerified: true,
  description: 'Brand identity package — logo, color system, typography, brand guidelines document',
  deadline: '2026-07-15',
  vaultState: 'active',
  myRole: 'payer',
  milestones: [
    { id: 'm1', label: 'Concepts and initial designs delivered', percent: 40, amount: 320, payerConfirmed: false, receiverConfirmed: true, released: false },
    { id: 'm2', label: 'Final files delivered in all agreed formats', percent: 60, amount: 480, payerConfirmed: false, receiverConfirmed: false, released: false },
  ],
  conditions: [
    { id: 'c1', text: 'Final files delivered in agreed formats (AI, PDF, PNG)', payerConfirmed: false, receiverConfirmed: true },
    { id: 'c2', text: 'Brand guidelines document complete and approved', payerConfirmed: false, receiverConfirmed: false },
    { id: 'c3', text: 'All source files handed over', payerConfirmed: false, receiverConfirmed: false },
  ],
  audit: [
    { time: '09:12', event: 'Deal created', actor: '@gaga' },
    { time: '09:15', event: 'Both parties connected', actor: '@client joined' },
    { time: '09:23', event: '$800.00 deposited to vault', actor: '@gaga', highlight: true },
    { time: '10:44', event: 'Milestone 1 marked complete', actor: '@client', highlight: true },
  ],
};

export default function DealPage() {
  const [deal,    setDeal]    = useState(DEMO);
  const [dispute, setDispute] = useState(false);
  const [disputeText, setDisputeText] = useState('');
  const [disputeSent, setDisputeSent] = useState(false);

  const isMe = (role: 'payer' | 'receiver') => role === deal.myRole;

  // Confirm a milestone
  const confirmMilestone = (id: string) => {
    setDeal(d => ({
      ...d,
      milestones: d.milestones.map(m => {
        if (m.id !== id) return m;
        const updated = isMe('payer')
          ? { ...m, payerConfirmed: true }
          : { ...m, receiverConfirmed: true };
        const bothConfirmed = updated.payerConfirmed && updated.receiverConfirmed;
        return { ...updated, released: bothConfirmed };
      }),
      audit: [
        ...d.audit,
        { time: now(), event: `Milestone confirmed`, actor: d.myRole === 'payer' ? d.payer : d.receiver, highlight: true },
      ],
    }));
  };

  // Confirm a condition
  const confirmCondition = (id: string) => {
    setDeal(d => ({
      ...d,
      conditions: d.conditions.map(c => {
        if (c.id !== id) return c;
        return isMe('payer')
          ? { ...c, payerConfirmed: true }
          : { ...c, receiverConfirmed: true };
      }),
      audit: [
        ...d.audit,
        { time: now(), event: 'Condition confirmed', actor: d.myRole === 'payer' ? d.payer : d.receiver },
      ],
    }));
  };

  const allConditionsMet = deal.conditions.every(c => c.payerConfirmed && c.receiverConfirmed);
  const allMilestonesReleased = deal.milestones.every(m => m.released);
  const dealComplete = allConditionsMet && allMilestonesReleased;

  const myConfirmed = (m: Milestone) => isMe('payer') ? m.payerConfirmed : m.receiverConfirmed;
  const theirConfirmed = (m: Milestone) => isMe('payer') ? m.receiverConfirmed : m.payerConfirmed;
  const myCondConfirmed = (c: Condition) => isMe('payer') ? c.payerConfirmed : c.receiverConfirmed;

  const submitDispute = () => {
    if (!disputeText.trim()) return;
    setDeal(d => ({
      ...d,
      vaultState: 'disputed',
      audit: [...d.audit, { time: now(), event: 'Dispute raised', actor: d.myRole === 'payer' ? d.payer : d.receiver, highlight: true }],
    }));
    setDisputeSent(true);
  };

  const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const vaultColor = () => {
    if (deal.vaultState === 'complete')  return 'var(--green)';
    if (deal.vaultState === 'disputed')  return 'var(--red)';
    if (deal.vaultState === 'releasing') return 'var(--gold)';
    return 'var(--indigo-l)';
  };

  const vaultLabel = () => {
    if (deal.vaultState === 'linked')     return 'Linked';
    if (deal.vaultState === 'funded')     return 'Funded';
    if (deal.vaultState === 'active')     return 'Active';
    if (deal.vaultState === 'confirming') return 'Confirming';
    if (deal.vaultState === 'releasing')  return 'Releasing';
    if (deal.vaultState === 'complete')   return 'Complete';
    if (deal.vaultState === 'disputed')   return 'Disputed';
    return '';
  };

  const releasedAmount = deal.milestones.filter(m => m.released).reduce((s, m) => s + m.amount, 0);
  const pendingAmount  = deal.amount - releasedAmount;

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
          --sidebar-w: 240px;
          --topbar-h:  64px;
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
        ::selection { background: rgba(91,79,232,0.25); color:#fff; }

        /* ── LAYOUT ── */
        .shell { min-height: 100vh; display: flex; flex-direction: column; }

        /* ── TOPBAR ── */
        .topbar {
          height: var(--topbar-h);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          background: rgba(7,7,10,0.92);
          backdrop-filter: blur(24px);
          border-bottom: 0.5px solid var(--border);
          position: sticky; top: 0; z-index: 200;
          flex-shrink: 0;
        }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .topbar-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: var(--text-primary); text-decoration: none;
          letter-spacing: -0.3px;
        }
        .topbar-sep { width: 1px; height: 20px; background: var(--border-md); }
        .topbar-code {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: var(--text-secondary); letter-spacing: 0.06em;
        }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .vault-state-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 20px;
          border: 0.5px solid;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .state-dot {
          width: 6px; height: 6px; border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .btn-back {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: var(--r-md);
          background: none; border: 0.5px solid var(--border-md);
          color: var(--text-secondary);
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          cursor: pointer; transition: all 0.15s; text-decoration: none;
        }
        .btn-back:hover { color: var(--text-primary); border-color: var(--border-hi); }

        /* ── DEMO BANNER ── */
        .demo-banner {
          background: rgba(201,168,76,0.06);
          border-bottom: 0.5px solid rgba(201,168,76,0.15);
          padding: 8px 32px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); display: flex; justify-content: space-between;
          flex-shrink: 0;
        }

        /* ── BODY GRID ── */
        .body-grid {
          flex: 1; display: grid;
          grid-template-columns: 1fr 320px;
          gap: 0; max-width: 1200px;
          margin: 0 auto; width: 100%;
          padding: 32px 32px 80px;
          align-items: start;
          gap: 24px;
        }

        /* ── LEFT COLUMN ── */
        .left-col { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        /* ── RIGHT COLUMN ── */
        .right-col { display: flex; flex-direction: column; gap: 16px; position: sticky; top: calc(var(--topbar-h) + 24px); }

        /* ── CARD ── */
        .card {
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          overflow: hidden;
        }
        .card-head {
          padding: 16px 20px;
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-faint);
        }
        .card-body { padding: 20px; }

        /* ── DEAL HEADER CARD ── */
        .deal-header-card {
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          overflow: hidden; position: relative;
        }
        .deal-header-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--indigo-l), transparent);
        }
        .dh-top {
          padding: 20px 24px 16px;
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px;
        }
        .dh-amount {
          font-family: 'Syne', sans-serif;
          font-size: 40px; font-weight: 800;
          letter-spacing: -2px; color: var(--text-primary); line-height: 1;
          margin-bottom: 6px;
        }
        .dh-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-body); line-height: 1.5;
          max-width: 400px;
        }
        .dh-meta {
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
          flex-shrink: 0;
        }
        .mode-pill {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--indigo-l);
          background: var(--indigo-dim);
          border: 0.5px solid rgba(91,79,232,0.2);
          padding: 4px 10px; border-radius: 5px; letter-spacing: 0.06em;
        }
        .deadline-pill {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-faint);
          letter-spacing: 0.06em;
        }

        /* Parties row */
        .dh-parties {
          display: grid; grid-template-columns: 1fr auto 1fr;
          border-top: 0.5px solid var(--border);
        }
        .party-block {
          padding: 16px 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .party-block.recv { flex-direction: row-reverse; }
        .party-avatar {
          width: 36px; height: 36px; border-radius: var(--r-md);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
          flex-shrink: 0;
        }
        .party-avatar.payer    { background: var(--indigo-dim); color: var(--indigo-l); border: 0.5px solid rgba(91,79,232,0.3); }
        .party-avatar.receiver { background: var(--green-dim);  color: var(--green);    border: 0.5px solid rgba(93,204,138,0.3); }
        .party-info { min-width: 0; }
        .party-info.right { text-align: right; }
        .party-role {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--text-faint); margin-bottom: 3px;
        }
        .party-handle {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: var(--text-primary); font-weight: 500;
        }
        .party-verified {
          display: flex; align-items: center; gap: 4px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--green); margin-top: 2px;
        }
        .party-info.right .party-verified { justify-content: flex-end; }
        .you-tag {
          font-family: 'DM Mono', monospace;
          font-size: 8px; color: var(--gold);
          background: var(--gold-dim);
          border: 0.5px solid rgba(201,168,76,0.2);
          padding: 2px 6px; border-radius: 4px;
          letter-spacing: 0.06em;
        }

        /* Vault center */
        .vault-center {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; padding: 16px 12px;
          border-left: 0.5px solid var(--border);
          border-right: 0.5px solid var(--border);
        }
        .vault-icon {
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.5s;
        }
        .vault-pct-bar {
          width: 64px; height: 3px; border-radius: 2px;
          background: var(--border-md); overflow: hidden;
        }
        .vault-pct-fill {
          height: 100%; border-radius: 2px;
          background: var(--green);
          transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
        }

        /* ── BALANCE STRIP ── */
        .balance-strip {
          display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr;
          border-top: 0.5px solid var(--border);
        }
        .balance-cell {
          padding: 14px 20px; text-align: center;
        }
        .balance-cell-div { background: var(--border); }
        .balance-val {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800;
          letter-spacing: -0.5px; margin-bottom: 4px;
        }
        .balance-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-faint);
        }

        /* ── ACTION BANNER ── */
        .action-banner {
          padding: 14px 20px;
          border-radius: var(--r-lg);
          display: flex; gap: 12px; align-items: center;
        }
        .action-banner.yours {
          background: rgba(201,168,76,0.07);
          border: 0.5px solid rgba(201,168,76,0.2);
        }
        .action-banner.theirs {
          background: var(--surface2);
          border: 0.5px solid var(--border-md);
        }
        .action-banner.complete {
          background: var(--green-dim);
          border: 0.5px solid rgba(93,204,138,0.2);
        }
        .ab-icon { flex-shrink: 0; }
        .ab-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-body); line-height: 1.5; flex: 1;
        }
        .ab-text strong { color: var(--text-primary); font-weight: 500; }

        /* ── MILESTONE ROW ── */
        .milestone-row {
          padding: 16px 20px;
          border-bottom: 0.5px solid var(--border);
          display: flex; flex-direction: column; gap: 10px;
        }
        .milestone-row:last-child { border-bottom: none; }
        .mr-top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
        }
        .mr-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-primary); line-height: 1.4; flex: 1;
        }
        .mr-amount {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800;
          letter-spacing: -0.5px; flex-shrink: 0;
        }
        .mr-confirms {
          display: flex; gap: 8px;
        }
        .confirm-chip {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 20px;
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.06em;
        }
        .confirm-chip.done   { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(93,204,138,0.2); }
        .confirm-chip.pending { color: var(--text-faint); background: var(--surface2); border: 0.5px solid var(--border); }
        .chip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        .btn-confirm {
          padding: 9px 18px; border-radius: var(--r-md);
          background: var(--indigo); color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; align-self: flex-start;
        }
        .btn-confirm:hover { background: var(--indigo-l); }
        .btn-confirm:active { transform: scale(0.97); }
        .btn-confirm.green-btn { background: var(--green); color: var(--black); }
        .btn-confirm.green-btn:hover { background: #4db87a; }

        .released-badge {
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: var(--green); letter-spacing: 0.06em;
        }

        /* ── CONDITION ROW ── */
        .condition-row {
          padding: 12px 20px;
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: flex-start; gap: 12px;
        }
        .condition-row:last-child { border-bottom: none; }
        .cond-num {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--indigo-l);
          flex-shrink: 0; margin-top: 2px; min-width: 20px;
        }
        .cond-body { flex: 1; min-width: 0; }
        .cond-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-body); line-height: 1.5;
          margin-bottom: 8px;
        }
        .cond-confirms { display: flex; gap: 6px; flex-wrap: wrap; }
        .cond-action { flex-shrink: 0; }

        /* ── AUDIT LOG ── */
        .audit-list { display: flex; flex-direction: column; }
        .audit-row {
          display: grid; grid-template-columns: 44px 1fr auto;
          gap: 12px; align-items: flex-start;
          padding: 12px 20px;
          border-bottom: 0.5px solid var(--border);
        }
        .audit-row:last-child { border-bottom: none; }
        .audit-row.highlight { background: rgba(91,79,232,0.04); }
        .audit-time {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--text-faint);
          margin-top: 1px;
        }
        .audit-event {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-body); line-height: 1.4;
        }
        .audit-actor {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--indigo-l);
          white-space: nowrap;
        }

        /* ── RIGHT COLUMN CARDS ── */
        .mini-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-faint); margin-bottom: 12px;
        }

        /* PDF / Dispute */
        .action-link {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: var(--r-md);
          background: var(--surface2); border: 0.5px solid var(--border);
          cursor: pointer; transition: all 0.15s; width: 100%;
          text-align: left;
        }
        .action-link:hover { background: var(--surface3); border-color: var(--border-md); }
        .action-link.danger:hover { border-color: rgba(224,82,82,0.3); background: var(--red-dim); }
        .action-link svg { flex-shrink: 0; }
        .action-link-body { flex: 1; min-width: 0; }
        .action-link-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; color: var(--text-primary);
          margin-bottom: 2px;
        }
        .action-link.danger .action-link-title { color: var(--red); }
        .action-link-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: var(--text-faint); line-height: 1.4;
        }

        /* Dispute form */
        .dispute-form {
          display: flex; flex-direction: column; gap: 10px;
          padding: 16px;
          background: var(--surface2);
          border: 0.5px solid rgba(224,82,82,0.2);
          border-radius: var(--r-lg);
        }
        .dispute-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--red);
        }
        .dispute-input {
          background: var(--surface);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-md);
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-primary);
          outline: none; resize: none; line-height: 1.5;
          min-height: 80px;
        }
        .dispute-input:focus { border-color: rgba(224,82,82,0.4); }
        .dispute-input::placeholder { color: var(--text-faint); }
        .btn-dispute {
          padding: 10px 16px; border-radius: var(--r-md);
          background: var(--red); color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-dispute:hover { background: #c94545; }
        .dispute-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: var(--text-faint); line-height: 1.5;
        }
        .dispute-sent {
          padding: 12px 16px;
          background: var(--red-dim);
          border: 0.5px solid rgba(224,82,82,0.2);
          border-radius: var(--r-md);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-body); line-height: 1.5;
        }

        /* ── COMPLETE BANNER ── */
        .complete-banner {
          padding: 20px 24px;
          background: var(--green-dim);
          border: 0.5px solid rgba(93,204,138,0.2);
          border-radius: var(--r-2xl);
          display: flex; gap: 14px; align-items: center;
        }
        .cb-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(93,204,138,0.12);
          border: 0.5px solid rgba(93,204,138,0.25);
          display: flex; align-items: center; justify-content: center;
          color: var(--green); flex-shrink: 0;
        }
        .cb-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-body); line-height: 1.6; }
        .cb-text strong { color: var(--text-primary); font-weight: 500; }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .body-grid { grid-template-columns: 1fr; padding: 20px 16px 80px; }
          .right-col { position: static; }
          .topbar { padding: 0 20px; }
          .topbar-code { display: none; }
          .dh-parties { grid-template-columns: 1fr; }
          .vault-center { border-left: none; border-right: none; border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); flex-direction: row; padding: 12px 20px; gap: 12px; }
          .balance-strip { grid-template-columns: 1fr 1fr 1fr; }
          .balance-cell-div { display: none; }
          .demo-banner { flex-direction: column; gap: 2px; }
        }
      `}</style>

      {DEMO_MODE && (
        <div className="demo-banner">
          <span>Demo mode — interactions are simulated</span>
          <span>Set DEMO_MODE = false before launch</span>
        </div>
      )}

      <div className="shell">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
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
            <div className="topbar-sep" aria-hidden="true" />
            <div className="topbar-code">{deal.code}</div>
          </div>
          <div className="topbar-right">
            <div className="vault-state-pill" style={{
              color: vaultColor(),
              borderColor: vaultColor().replace(')', ',0.25)').replace('var(','rgba(').replace('#5DCC8A','rgba(93,204,138'),
              background: vaultColor().replace(')', ',0.08)').replace('var(','rgba(').replace('#5DCC8A','rgba(93,204,138'),
            }}>
              <div className="state-dot" style={{background: vaultColor()}} aria-hidden="true" />
              {vaultLabel()}
            </div>
            <a href="/dashboard" className="btn-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Dashboard
            </a>
          </div>
        </header>

        <div className="body-grid">
          {/* ── LEFT COLUMN ── */}
          <div className="left-col">

            {/* Deal header */}
            <div className="deal-header-card">
              <div className="dh-top">
                <div>
                  <div className="dh-amount">{deal.currency} {deal.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                  <div className="dh-desc">{deal.description}</div>
                </div>
                <div className="dh-meta">
                  <span className="mode-pill">{deal.mode}</span>
                  <span className="deadline-pill">Due {new Date(deal.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
              </div>

              {/* Parties */}
              <div className="dh-parties">
                {/* Payer */}
                <div className="party-block">
                  <div className="party-avatar payer">
                    {deal.payer.replace('@','')[0].toUpperCase()}
                  </div>
                  <div className="party-info">
                    <div className="party-role">Payer {deal.myRole === 'payer' && <span className="you-tag">you</span>}</div>
                    <div className="party-handle">{deal.payer}</div>
                    {deal.payerVerified && (
                      <div className="party-verified">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(93,204,138,0.1)" stroke="#5DCC8A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#5DCC8A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        KYC verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Vault center */}
                <div className="vault-center">
                  <div className="vault-icon" style={{
                    background: `${vaultColor()}18`,
                    border: `0.5px solid ${vaultColor()}44`,
                  }}>
                    {dealComplete ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vaultColor()} strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vaultColor()} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    )}
                  </div>
                  <div className="vault-pct-bar">
                    <div className="vault-pct-fill" style={{width:`${(releasedAmount/deal.amount)*100}%`}} />
                  </div>
                </div>

                {/* Receiver */}
                <div className="party-block recv">
                  <div className="party-avatar receiver">
                    {deal.receiver.replace('@','')[0].toUpperCase()}
                  </div>
                  <div className="party-info right">
                    <div className="party-role">Receiver {deal.myRole === 'receiver' && <span className="you-tag">you</span>}</div>
                    <div className="party-handle">{deal.receiver}</div>
                    {deal.receiverVerified && (
                      <div className="party-verified">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(93,204,138,0.1)" stroke="#5DCC8A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#5DCC8A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        KYC verified
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Balance strip */}
              <div className="balance-strip">
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--indigo-l)'}}>
                    {deal.currency} {deal.amount.toLocaleString('en-US',{minimumFractionDigits:2})}
                  </div>
                  <div className="balance-label">In vault</div>
                </div>
                <div className="balance-cell-div" />
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--green)'}}>
                    {deal.currency} {releasedAmount.toLocaleString('en-US',{minimumFractionDigits:2})}
                  </div>
                  <div className="balance-label">Released</div>
                </div>
                <div className="balance-cell-div" />
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--text-secondary)'}}>
                    {deal.currency} {pendingAmount.toLocaleString('en-US',{minimumFractionDigits:2})}
                  </div>
                  <div className="balance-label">Pending</div>
                </div>
              </div>
            </div>

            {/* Complete banner */}
            {dealComplete && (
              <div className="complete-banner">
                <div className="cb-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="cb-text">
                  <strong>Deal complete.</strong> All conditions confirmed by both parties. All funds have been released via Interledger. Download the full audit PDF from the panel.
                </div>
              </div>
            )}

            {/* Action banner */}
            {!dealComplete && (() => {
              const needsMyAction = deal.milestones.some(m => !myConfirmed(m) && theirConfirmed(m) && !m.released)
                || deal.conditions.some(c => !myCondConfirmed(c));
              const waitingForThem = !needsMyAction;
              const them = deal.myRole === 'payer' ? deal.receiver : deal.payer;
              return (
                <div className={`action-banner ${needsMyAction ? 'yours' : 'theirs'}`}>
                  {needsMyAction ? (
                    <>
                      <div className="ab-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <div className="ab-text"><strong>Your turn.</strong> Review the milestones and conditions below. Confirm what has been completed.</div>
                    </>
                  ) : (
                    <>
                      <div className="ab-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div className="ab-text" style={{color:'var(--text-secondary)'}}>Waiting for <strong style={{color:'var(--text-primary)'}}>{them}</strong> to confirm. You will be notified when action is needed.</div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Milestones */}
            <div className="card">
              <div className="card-head">
                <div className="card-label">Milestones</div>
                <div style={{fontFamily:'DM Mono',fontSize:'9px',color:'var(--text-faint)',letterSpacing:'0.06em'}}>
                  {deal.milestones.filter(m=>m.released).length} of {deal.milestones.length} released
                </div>
              </div>
              {deal.milestones.map(m => (
                <div key={m.id} className="milestone-row">
                  <div className="mr-top">
                    <div className="mr-label">{m.label}</div>
                    <div className="mr-amount" style={{color: m.released ? 'var(--green)' : 'var(--text-primary)'}}>
                      {deal.currency} {m.amount.toLocaleString('en-US',{minimumFractionDigits:2})}
                      <div style={{fontFamily:'DM Mono',fontSize:'8px',color:'var(--text-faint)',textAlign:'right',marginTop:'2px',letterSpacing:'0.06em'}}>{m.percent}%</div>
                    </div>
                  </div>
                  <div className="mr-confirms">
                    <div className={`confirm-chip ${m.payerConfirmed ? 'done' : 'pending'}`}>
                      <div className="chip-dot" style={{background: m.payerConfirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                      {deal.payer}
                    </div>
                    <div className={`confirm-chip ${m.receiverConfirmed ? 'done' : 'pending'}`}>
                      <div className="chip-dot" style={{background: m.receiverConfirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                      {deal.receiver}
                    </div>
                  </div>
                  {m.released ? (
                    <div className="released-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Released via Interledger
                    </div>
                  ) : myConfirmed(m) ? (
                    <div style={{fontFamily:'DM Sans',fontSize:'11px',color:'var(--text-faint)'}}>
                      You confirmed. Waiting for {deal.myRole === 'payer' ? deal.receiver : deal.payer}.
                    </div>
                  ) : (
                    <button
                      className={`btn-confirm ${theirConfirmed(m) ? 'green-btn' : ''}`}
                      onClick={() => confirmMilestone(m.id)}
                    >
                      {theirConfirmed(m) ? 'Confirm to release funds' : 'Confirm milestone complete'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Conditions */}
            <div className="card">
              <div className="card-head">
                <div className="card-label">Release conditions</div>
                <div style={{fontFamily:'DM Mono',fontSize:'9px',color:'var(--text-faint)',letterSpacing:'0.06em'}}>
                  Both must confirm all
                </div>
              </div>
              {deal.conditions.map((c, i) => (
                <div key={c.id} className="condition-row">
                  <div className="cond-num">0{i+1}</div>
                  <div className="cond-body">
                    <div className="cond-text">{c.text}</div>
                    <div className="cond-confirms">
                      <div className={`confirm-chip ${c.payerConfirmed ? 'done' : 'pending'}`}>
                        <div className="chip-dot" style={{background: c.payerConfirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                        {deal.payer}
                      </div>
                      <div className={`confirm-chip ${c.receiverConfirmed ? 'done' : 'pending'}`}>
                        <div className="chip-dot" style={{background: c.receiverConfirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                        {deal.receiver}
                      </div>
                    </div>
                  </div>
                  <div className="cond-action">
                    {myCondConfirmed(c) ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <button className="btn-confirm" onClick={() => confirmCondition(c.id)}>Confirm</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Audit log */}
            <div className="card">
              <div className="card-head">
                <div className="card-label">Audit log</div>
                <div style={{fontFamily:'DM Mono',fontSize:'9px',color:'var(--text-faint)',letterSpacing:'0.06em'}}>Permanent record</div>
              </div>
              <div className="audit-list" role="log" aria-live="polite">
                {deal.audit.map((a, i) => (
                  <div key={i} className={`audit-row ${a.highlight ? 'highlight' : ''}`}>
                    <div className="audit-time">{a.time}</div>
                    <div className="audit-event">{a.event}</div>
                    <div className="audit-actor">{a.actor}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="right-col">

            {/* Deal info */}
            <div className="card">
              <div className="card-body">
                <div className="mini-label">Deal info</div>
                {[
                  ['Code',   deal.code],
                  ['Mode',   deal.mode],
                  ['Deadline', new Date(deal.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})],
                  ['Created', '2 hours ago'],
                ].map(([k,v]) => (
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'0.5px solid var(--border)'}}>
                    <span style={{fontFamily:'DM Sans',fontSize:'12px',color:'var(--text-secondary)'}}>{k}</span>
                    <span style={{fontFamily: k==='Code' ? 'DM Mono' : 'DM Sans',fontSize:'12px',color:'var(--text-primary)',fontWeight:500,letterSpacing: k==='Code'?'0.04em':'normal'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body">
                <div className="mini-label">Actions</div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  <button className="action-link">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div className="action-link-body">
                      <div className="action-link-title">Download audit PDF</div>
                      <div className="action-link-desc">Full record — court-ready</div>
                    </div>
                  </button>
                  <button className="action-link">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    <div className="action-link-body">
                      <div className="action-link-title">Message {deal.myRole === 'payer' ? deal.receiver : deal.payer}</div>
                      <div className="action-link-desc">In-deal messaging</div>
                    </div>
                  </button>
                  {!dispute && !disputeSent && deal.vaultState !== 'disputed' && (
                    <button className="action-link danger" onClick={() => setDispute(true)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <div className="action-link-body">
                        <div className="action-link-title">Raise a dispute</div>
                        <div className="action-link-desc">Freeze funds, request mediation</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dispute form */}
            {dispute && !disputeSent && (
              <div className="dispute-form">
                <div className="dispute-label">Raise a dispute</div>
                <textarea
                  className="dispute-input"
                  placeholder="Describe what conditions were not met or what the disagreement is about. Be specific."
                  value={disputeText}
                  onChange={e => setDisputeText(e.target.value)}
                  rows={4}
                />
                <button className="btn-dispute" onClick={submitDispute} disabled={!disputeText.trim()}>
                  Submit dispute
                </button>
                <div className="dispute-note">
                  Funds will be frozen. Gagara mediation will be notified. A court-ready PDF of the full deal record will be generated automatically.
                </div>
                <button style={{background:'none',border:'none',color:'var(--text-faint)',fontSize:'11px',cursor:'pointer',padding:'0'}} onClick={() => setDispute(false)}>
                  Cancel
                </button>
              </div>
            )}

            {(disputeSent || deal.vaultState === 'disputed') && (
              <div className="dispute-sent">
                Dispute submitted. Funds are frozen. Gagara mediation has been notified. Both parties will receive the audit PDF by email.
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
