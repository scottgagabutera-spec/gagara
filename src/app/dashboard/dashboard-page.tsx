'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────
// DEMO MODE — flip to false before going live
// When false: all sample data disappears, empty states show instead
// ─────────────────────────────────────────────
const DEMO_MODE = true;

// ─────────────────────────────────────────────
// SAMPLE DATA — only used when DEMO_MODE = true
// ─────────────────────────────────────────────
const SAMPLE = {
  user: { handle: '@gaga', name: 'Alexander', verified: true, type: 'Individual' },
  lockedForMe: 2400.00,
  lockedByMe: 800.00,
  actions: 2,
  deals: [
    {
      id: 'GGR-4829-KXMT', mode: 'Business', status: 'Action needed',
      statusCode: 'action', amount: 800.00, currency: 'USD',
      counterparty: '@client', role: 'Payer', description: 'Brand identity package',
      milestone: 'Milestone 1 complete — confirm release?', updated: '2 hours ago',
    },
    {
      id: 'GGR-3301-LFPQ', mode: 'Personal', status: 'Locked',
      statusCode: 'locked', amount: 350.00, currency: 'USD',
      counterparty: '@marcos', role: 'Receiver', description: 'Logo redesign — final files',
      milestone: 'Work in progress', updated: '1 day ago',
    },
    {
      id: 'GGR-7712-BSWN', mode: 'Business', status: 'Pending link',
      statusCode: 'pending', amount: 1250.00, currency: 'USD',
      counterparty: '—', role: 'Payer', description: 'Web development retainer Q3',
      milestone: 'Waiting for receiver to connect', updated: '3 days ago',
    },
    {
      id: 'GGR-5500-RXQT', mode: 'Personal', status: 'Completed',
      statusCode: 'completed', amount: 200.00, currency: 'USD',
      counterparty: '@jenna', role: 'Receiver', description: 'Content writing — 4 articles',
      milestone: 'Released via Gagara transfer', updated: '5 days ago',
    },
  ],
  notifications: [
    { id: 1, text: '@client marked Milestone 1 complete on GGR-4829-KXMT', time: '2h ago', urgent: true  },
    { id: 2, text: 'Deal GGR-3301-LFPQ has been inactive for 48 hours', time: '6h ago', urgent: false },
    { id: 3, text: '$800 locked by @gaga on GGR-4829-KXMT', time: '1d ago', urgent: false },
  ],
};

type Filter = 'all' | 'incoming' | 'outgoing' | 'action' | 'completed';

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>('all');
  const [notifOpen, setNotifOpen] = useState(false);

  const deals = DEMO_MODE ? SAMPLE.deals : [];
  const filtered = filter === 'all' ? deals
    : filter === 'incoming'  ? deals.filter(d => d.role === 'Receiver')
    : filter === 'outgoing'  ? deals.filter(d => d.role === 'Payer')
    : filter === 'action'    ? deals.filter(d => d.statusCode === 'action')
    : deals.filter(d => d.statusCode === 'completed');

  const statusColor = (code: string) => {
    if (code === 'action')    return 'var(--gold)';
    if (code === 'locked')    return 'var(--indigo-l)';
    if (code === 'completed') return 'var(--green)';
    return 'var(--text-faint)';
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
          --surface5:   #1F1F30;
          --indigo:     #5B4FE8;
          --indigo-l:   #7B70F0;
          --indigo-dim: rgba(91,79,232,0.1);
          --gold:       #C9A84C;
          --gold-dim:   rgba(201,168,76,0.08);
          --green:      #5DCC8A;
          --green-dim:  rgba(93,204,138,0.08);
          --red:        #E05252;

          --text-primary:   #F5F5F7;
          --text-body:      rgba(245,245,247,0.72);
          --text-secondary: rgba(245,245,247,0.50);
          --text-label:     rgba(245,245,247,0.38);
          --text-faint:     rgba(245,245,247,0.20);

          --border:     rgba(245,245,247,0.06);
          --border-md:  rgba(245,245,247,0.10);
          --border-str: rgba(245,245,247,0.15);

          --sidebar-w: 240px;
          --topbar-h:  64px;

          --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 20px; --r-2xl: 24px;
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

        /* ── LAYOUT ── */
        .shell {
          display: flex; min-height: 100vh;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: var(--sidebar-w);
          flex-shrink: 0;
          background: var(--surface);
          border-right: 0.5px solid var(--border);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 200;
        }
        .sidebar-logo {
          height: var(--topbar-h);
          display: flex; align-items: center; gap: 10px;
          padding: 0 24px;
          border-bottom: 0.5px solid var(--border);
          text-decoration: none;
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }
        .sidebar-nav {
          flex: 1; padding: 16px 12px;
          display: flex; flex-direction: column; gap: 2px;
          overflow-y: auto;
        }
        .nav-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-faint); padding: 8px 12px 6px;
          margin-top: 8px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: var(--r-md);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-secondary);
          text-decoration: none; cursor: pointer;
          transition: all 0.15s; border: none; background: none;
          width: 100%; text-align: left;
        }
        .nav-item:hover { color: var(--text-primary); background: var(--surface3); }
        .nav-item.active {
          color: var(--text-primary);
          background: var(--indigo-dim);
          border: 0.5px solid rgba(91,79,232,0.18);
        }
        .nav-item.active svg { color: var(--indigo-l); }
        .nav-badge {
          margin-left: auto;
          background: var(--gold);
          color: var(--black);
          font-family: 'DM Mono', monospace;
          font-size: 9px; font-weight: 500;
          padding: 2px 6px; border-radius: 10px;
          min-width: 18px; text-align: center;
        }
        .sidebar-bottom {
          padding: 16px 12px;
          border-top: 0.5px solid var(--border);
        }
        .user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: var(--r-md);
          cursor: pointer; transition: background 0.15s;
        }
        .user-card:hover { background: var(--surface3); }
        .user-avatar {
          width: 32px; height: 32px; border-radius: var(--r-sm);
          background: var(--indigo-dim);
          border: 0.5px solid rgba(91,79,232,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 800;
          color: var(--indigo-l); flex-shrink: 0;
        }
        .user-info { min-width: 0; }
        .user-handle {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-primary);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-type {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: var(--text-faint); margin-top: 2px;
          display: flex; align-items: center; gap: 4px;
        }
        .verified-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--green); flex-shrink: 0;
        }

        /* ── MAIN ── */
        .main {
          margin-left: var(--sidebar-w);
          flex: 1; display: flex; flex-direction: column;
          min-height: 100vh; min-width: 0;
        }

        /* ── TOPBAR ── */
        .topbar {
          height: var(--topbar-h);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          background: rgba(7,7,10,0.85);
          backdrop-filter: blur(24px);
          border-bottom: 0.5px solid var(--border);
          position: sticky; top: 0; z-index: 100;
        }
        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.3px;
        }
        .topbar-right { display: flex; align-items: center; gap: 8px; }
        .icon-btn {
          width: 36px; height: 36px; border-radius: var(--r-md);
          background: none; border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); cursor: pointer;
          transition: all 0.15s; position: relative;
        }
        .icon-btn:hover { color: var(--text-primary); background: var(--surface3); border-color: var(--border-md); }
        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold);
          border: 1.5px solid var(--black);
        }
        .btn-new-deal {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: var(--r-md);
          background: var(--indigo); color: #fff; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
          text-decoration: none;
        }
        .btn-new-deal:hover { background: var(--indigo-l); }
        .btn-new-deal:active { transform: scale(0.97); }

        /* ── CONTENT ── */
        .content { padding: 32px; flex: 1; }

        /* ── THREE QUESTIONS ── */
        .three-q {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          overflow: hidden;
          margin-bottom: 32px;
        }
        .q-card {
          background: var(--surface);
          padding: 28px 28px 24px;
          position: relative; overflow: hidden;
          transition: background 0.15s;
        }
        .q-card:hover { background: var(--surface2); }
        .q-card-glow {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
        }
        .q-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-faint); margin-bottom: 16px;
        }
        .q-amount {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          letter-spacing: -1.5px; line-height: 1;
          margin-bottom: 8px;
        }
        .q-amount.incoming { color: var(--green); }
        .q-amount.outgoing { color: var(--indigo-l); }
        .q-amount.actions  { color: var(--gold); }
        .q-amount.empty    { color: var(--text-faint); font-size: 28px; }
        .q-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-secondary); line-height: 1.5;
        }
        .q-live {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-faint); letter-spacing: 0.08em;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        .live-dot.green  { background: var(--green); }
        .live-dot.indigo { background: var(--indigo-l); }
        .live-dot.gold   { background: var(--gold); }

        /* ── DEAL LIST ── */
        .deals-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .deals-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.2px;
        }
        .filter-tabs {
          display: flex; gap: 4px;
        }
        .filter-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--text-secondary);
          padding: 6px 12px; border-radius: var(--r-sm);
          background: none; border: 0.5px solid transparent;
          cursor: pointer; transition: all 0.15s;
        }
        .filter-tab:hover { color: var(--text-primary); background: var(--surface3); }
        .filter-tab.active {
          color: var(--text-primary);
          background: var(--surface3);
          border-color: var(--border-md);
        }

        .deals-list {
          display: flex; flex-direction: column; gap: 1px;
          background: var(--border);
          border: 0.5px solid var(--border-md);
          border-radius: var(--r-2xl);
          overflow: hidden;
        }
        .deal-row {
          background: var(--surface);
          padding: 20px 24px;
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: 16px; align-items: center;
          transition: background 0.15s; cursor: pointer;
        }
        .deal-row:hover { background: var(--surface2); }

        .deal-status-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }

        .deal-main { min-width: 0; }
        .deal-id {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--text-faint);
          letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .deal-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .deal-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 8px;
        }
        .deal-meta-sep { color: var(--text-faint); }

        .deal-milestone {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: var(--text-secondary);
          max-width: 240px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .deal-milestone.urgent { color: var(--gold); }

        .deal-amount {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800;
          letter-spacing: -0.5px; text-align: right;
          white-space: nowrap;
        }
        .deal-amount.incoming { color: var(--green); }
        .deal-amount.outgoing { color: var(--text-primary); }
        .deal-amount-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-faint);
          letter-spacing: 0.06em; text-align: right; margin-top: 3px;
        }

        /* Action button on deal row */
        .deal-action {
          flex-shrink: 0;
          padding: 7px 14px; border-radius: var(--r-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; border: none;
          white-space: nowrap;
        }
        .da-confirm {
          background: rgba(201,168,76,0.12);
          color: var(--gold);
          border: 0.5px solid rgba(201,168,76,0.25);
        }
        .da-confirm:hover { background: rgba(201,168,76,0.2); }
        .da-view {
          background: var(--surface3);
          color: var(--text-secondary);
          border: 0.5px solid var(--border);
        }
        .da-view:hover { color: var(--text-primary); background: var(--surface4); }

        /* Empty state */
        .empty-state {
          padding: 64px 32px;
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; text-align: center;
          background: var(--surface);
        }
        .empty-icon {
          width: 48px; height: 48px; border-radius: var(--r-lg);
          background: var(--surface3); border: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-faint); margin-bottom: 4px;
        }
        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.2px;
        }
        .empty-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary); line-height: 1.6;
          max-width: 280px;
        }
        .empty-cta {
          margin-top: 8px;
          padding: 9px 20px; border-radius: var(--r-md);
          background: var(--indigo); color: #fff; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
        }
        .empty-cta:hover { background: var(--indigo-l); }

        /* ── NOTIFICATION PANEL ── */
        .notif-panel {
          position: fixed; top: var(--topbar-h); right: 0;
          width: 320px; background: var(--surface);
          border-left: 0.5px solid var(--border-md);
          border-bottom: 0.5px solid var(--border-md);
          border-bottom-left-radius: var(--r-2xl);
          z-index: 300; overflow: hidden;
        }
        .notif-header {
          padding: 16px 20px;
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .notif-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.2px;
        }
        .notif-close {
          background: none; border: none; color: var(--text-faint);
          cursor: pointer; padding: 2px; transition: color 0.15s;
        }
        .notif-close:hover { color: var(--text-primary); }
        .notif-item {
          padding: 14px 20px;
          border-bottom: 0.5px solid var(--border);
          display: flex; gap: 12px; align-items: flex-start;
          transition: background 0.15s; cursor: pointer;
        }
        .notif-item:hover { background: var(--surface2); }
        .notif-item:last-child { border-bottom: none; }
        .notif-urgency {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0; margin-top: 4px;
        }
        .notif-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-body); line-height: 1.5;
          flex: 1;
        }
        .notif-time {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-faint);
          white-space: nowrap; flex-shrink: 0; margin-top: 2px;
        }
        .notif-empty {
          padding: 40px 20px; text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-faint);
        }

        /* ── DEMO BANNER ── */
        .demo-banner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px;
          background: rgba(201,168,76,0.06);
          border-bottom: 0.5px solid rgba(201,168,76,0.15);
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold);
        }

        /* ── KEYFRAMES ── */
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; }
          .topbar { padding: 0 20px; }
          .content { padding: 20px 16px; }
          .three-q { grid-template-columns: 1fr; }
          .deal-row { grid-template-columns: auto 1fr auto; gap: 12px; }
          .deal-milestone { display: none; }
          .filter-tabs { overflow-x: auto; scrollbar-width: none; }
          .filter-tabs::-webkit-scrollbar { display: none; }
          .notif-panel { width: 100%; border-left: none; border-radius: 0; }
        }
      `}</style>

      {/* DEMO BANNER */}
      {DEMO_MODE && (
        <div className="demo-banner">
          <span>Demo mode — sample data visible</span>
          <span>Set DEMO_MODE = false to show real data</span>
        </div>
      )}

      <div className="shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/" className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <circle cx="7"  cy="15" r="5"   stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="23" cy="15" r="5"   stroke="#7B70F0" strokeWidth="1.2"/>
              <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
              <circle cx="7"  cy="15" r="2"   fill="#7B70F0"/>
              <circle cx="23" cy="15" r="2"   fill="#7B70F0"/>
            </svg>
            Gagara
          </a>

          <nav className="sidebar-nav">
            {/* Main */}
            <div className="nav-section-label">Main</div>
            <button className="nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
              {DEMO_MODE && SAMPLE.actions > 0 && <span className="nav-badge">{SAMPLE.actions}</span>}
            </button>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              My Deals
            </button>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              Connect
            </button>

            {/* Account */}
            <div className="nav-section-label">Account</div>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Profile
            </button>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Payouts
            </button>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              Network
            </button>
          </nav>

          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">
                {DEMO_MODE ? SAMPLE.user.name[0] : '?'}
              </div>
              <div className="user-info">
                <div className="user-handle">
                  {DEMO_MODE ? SAMPLE.user.handle : '@handle'}
                </div>
                <div className="user-type">
                  {DEMO_MODE && SAMPLE.user.verified && <span className="verified-dot" />}
                  {DEMO_MODE ? SAMPLE.user.type : 'Individual'}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="topbar-title">
              {DEMO_MODE ? `Good morning, ${SAMPLE.user.name}` : 'Dashboard'}
            </div>
            <div className="topbar-right">
              <button
                className="icon-btn"
                onClick={() => setNotifOpen(v => !v)}
                aria-label="Notifications"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {DEMO_MODE && SAMPLE.notifications.some(n => n.urgent) && (
                  <span className="notif-dot" aria-hidden="true" />
                )}
              </button>
              <a href="/new-deal" className="btn-new-deal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New deal
              </a>
            </div>
          </header>

          {/* CONTENT */}
          <main className="content">

            {/* THREE QUESTIONS */}
            <div className="three-q" role="region" aria-label="Financial summary">

              {/* Q1 — Locked for me */}
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg, transparent, rgba(93,204,138,0.4), transparent)'}} aria-hidden="true" />
                <div className="q-label">Locked for me</div>
                {DEMO_MODE && SAMPLE.lockedForMe > 0 ? (
                  <>
                    <div className="q-amount incoming">${SAMPLE.lockedForMe.toLocaleString('en-US', {minimumFractionDigits:2})}</div>
                    <div className="q-sub">Across {SAMPLE.deals.filter(d => d.role === 'Receiver' && d.statusCode !== 'completed').length} active deals</div>
                    <div className="q-live"><span className="live-dot green" aria-hidden="true" />Live balance</div>
                  </>
                ) : (
                  <>
                    <div className="q-amount empty">$0.00</div>
                    <div className="q-sub">No incoming deals yet</div>
                  </>
                )}
              </div>

              {/* Q2 — Locked by me */}
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg, transparent, rgba(123,112,240,0.4), transparent)'}} aria-hidden="true" />
                <div className="q-label">Locked by me</div>
                {DEMO_MODE && SAMPLE.lockedByMe > 0 ? (
                  <>
                    <div className="q-amount outgoing">${SAMPLE.lockedByMe.toLocaleString('en-US', {minimumFractionDigits:2})}</div>
                    <div className="q-sub">Across {SAMPLE.deals.filter(d => d.role === 'Payer' && d.statusCode === 'locked').length} active deals</div>
                    <div className="q-live"><span className="live-dot indigo" aria-hidden="true" />Live balance</div>
                  </>
                ) : (
                  <>
                    <div className="q-amount empty">$0.00</div>
                    <div className="q-sub">No outgoing deals yet</div>
                  </>
                )}
              </div>

              {/* Q3 — Actions needed */}
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)'}} aria-hidden="true" />
                <div className="q-label">Needs your attention</div>
                {DEMO_MODE && SAMPLE.actions > 0 ? (
                  <>
                    <div className="q-amount actions">{SAMPLE.actions}</div>
                    <div className="q-sub">{SAMPLE.actions === 1 ? 'Action' : 'Actions'} waiting for your response</div>
                    <div className="q-live"><span className="live-dot gold" aria-hidden="true" />Respond now</div>
                  </>
                ) : (
                  <>
                    <div className="q-amount empty">0</div>
                    <div className="q-sub">Nothing needs your attention</div>
                  </>
                )}
              </div>
            </div>

            {/* DEAL LIST */}
            <div className="deals-header">
              <div className="deals-title">Active deals</div>
              <div className="filter-tabs" role="tablist">
                {(['all','incoming','outgoing','action','completed'] as Filter[]).map(f => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                    role="tab"
                    aria-selected={filter === f}
                  >
                    {f === 'all' ? 'All' : f === 'incoming' ? 'Incoming' : f === 'outgoing' ? 'Outgoing' : f === 'action' ? 'Action needed' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="deals-list" role="list">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <div className="empty-title">No deals here</div>
                  <div className="empty-desc">
                    {filter === 'all'
                      ? 'Create your first deal or enter a Deal Code to get started.'
                      : `No ${filter} deals right now.`}
                  </div>
                  {filter === 'all' && (
                    <button className="empty-cta">Create your first deal</button>
                  )}
                </div>
              ) : (
                filtered.map(deal => (
                  <div key={deal.id} className="deal-row" role="listitem">
                    <div
                      className="deal-status-dot"
                      style={{background: statusColor(deal.statusCode)}}
                      aria-hidden="true"
                    />
                    <div className="deal-main">
                      <div className="deal-id">{deal.id} · {deal.mode}</div>
                      <div className="deal-desc">{deal.description}</div>
                      <div className="deal-meta">
                        <span>{deal.counterparty}</span>
                        <span className="deal-meta-sep">·</span>
                        <span>{deal.role}</span>
                        <span className="deal-meta-sep">·</span>
                        <span>{deal.updated}</span>
                      </div>
                    </div>
                    <div className={`deal-milestone ${deal.statusCode === 'action' ? 'urgent' : ''}`}>
                      {deal.milestone}
                    </div>
                    <div>
                      <div className={`deal-amount ${deal.role === 'Receiver' ? 'incoming' : 'outgoing'}`}>
                        ${deal.amount.toLocaleString('en-US', {minimumFractionDigits:2})}
                      </div>
                      <div className="deal-amount-label">{deal.currency} · {deal.status}</div>
                      <div style={{marginTop:'8px', display:'flex', justifyContent:'flex-end'}}>
                        {deal.statusCode === 'action' ? (
                          <button className="deal-action da-confirm">Confirm</button>
                        ) : (
                          <button className="deal-action da-view">View</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </main>
        </div>
      </div>

      {/* NOTIFICATION PANEL */}
      {notifOpen && (
        <div className="notif-panel" role="dialog" aria-label="Notifications">
          <div className="notif-header">
            <div className="notif-title">Notifications</div>
            <button className="notif-close" onClick={() => setNotifOpen(false)} aria-label="Close notifications">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {(DEMO_MODE ? SAMPLE.notifications : []).length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            SAMPLE.notifications.map(n => (
              <div key={n.id} className="notif-item">
                <div className="notif-urgency" style={{background: n.urgent ? 'var(--gold)' : 'var(--text-faint)'}} aria-hidden="true" />
                <div className="notif-text">{n.text}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
