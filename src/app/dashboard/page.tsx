'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────
// DEMO MODE — flip to false to show real data
// ─────────────────────────────────────────────
const DEMO_MODE = false;

const SAMPLE = {
  lockedForMe: 2400.00,
  lockedByMe: 800.00,
  actions: 2,
  deals: [
    { id: 'GGR-4829-KXMT', mode: 'Business', status: 'Action needed', statusCode: 'action', amount: 800.00, currency: 'USD', counterparty: '@client', role: 'Payer', description: 'Brand identity package', milestone: 'Milestone 1 complete — confirm release?', updated: '2 hours ago' },
    { id: 'GGR-3301-LFPQ', mode: 'Personal', status: 'Locked', statusCode: 'locked', amount: 350.00, currency: 'USD', counterparty: '@marcos', role: 'Receiver', description: 'Logo redesign, final files', milestone: 'Work in progress', updated: '1 day ago' },
    { id: 'GGR-7712-BSWN', mode: 'Business', status: 'Pending link', statusCode: 'pending', amount: 1250.00, currency: 'USD', counterparty: '—', role: 'Payer', description: 'Web development retainer Q3', milestone: 'Waiting for receiver to connect', updated: '3 days ago' },
    { id: 'GGR-5500-RXQT', mode: 'Personal', status: 'Completed', statusCode: 'completed', amount: 200.00, currency: 'USD', counterparty: '@jenna', role: 'Receiver', description: 'Content writing — 4 articles', milestone: 'Released via Gagara transfer', updated: '5 days ago' },
  ],
  notifications: [
    { id: 1, text: '@client marked Milestone 1 complete on GGR-4829-KXMT', time: '2h ago', urgent: true },
    { id: 2, text: 'Deal GGR-3301-LFPQ has been inactive for 48 hours', time: '6h ago', urgent: false },
  ],
};

type Filter = 'all' | 'incoming' | 'outgoing' | 'action' | 'completed';

interface Profile {
  id: string;
  name: string;
  handle: string | null;
  account_type: string;
  kyc_verified: boolean;
  avatar_color: string;
}

interface Deal {
  id: string;
  code: string;
  mode: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  payer_id: string;
  receiver_id: string;
  updated_at: string;
  payer?: { handle: string; name: string };
  receiver?: { handle: string; name: string };
}

export default function Dashboard() {
  const router = useRouter();
  const [filter, setFilter]       = useState<Filter>('all');
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]           = useState<{id:string;text:string;time:string;urgent:boolean;read:boolean;deal_id:string|null;deal_code:string|null}[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile]     = useState<Profile | null>(null);
  const [deals, setDeals]         = useState<Deal[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const init = async () => {
      // Auth guard
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/sign-in'); return; }

      if (DEMO_MODE) { setLoading(false); return; }

      // Load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (prof) setProfile(prof);

      // Load deals where user is payer or receiver
      const { data: dealData } = await supabase
        .from('deals')
        .select(`
          *,
          payer:payer_id(handle, name),
          receiver:receiver_id(handle, name)
        `)
        .or(`payer_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('updated_at', { ascending: false });

      if (dealData) setDeals(dealData);

      // Load notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notifData) {
        setNotifs(notifData.map(n => ({
          id: n.id,
          text: n.text,
          time: fmtAgo(n.created_at),
          urgent: n.urgent,
          read: n.read,
          deal_id: n.deal_id,
          deal_code: n.deal_code,
        })));
        setUnreadCount(notifData.filter(n => !n.read).length);
      }
      setLoading(false);
    };

    init();
  }, [router]);

  // Sign out
  const fmtAgo = (iso: string) => {
    const ms = Date.now() - new Date(iso).getTime();
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return 'just now';
  };

  const markAllRead = async () => {
    if (!profile?.id) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', profile.id).eq('read', false);
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Derived display values
  const displayName = DEMO_MODE ? 'Alexander' : (profile?.name?.split(' ')[0] || 'there');
  const displayHandle = DEMO_MODE ? '@gaga' : (profile?.handle || profile?.name?.toLowerCase().replace(/\s/g, '') || '...');
  const displayType = DEMO_MODE ? 'Individual' : (profile?.account_type === 'business' ? 'Business' : 'Individual');
  const displayVerified = DEMO_MODE ? true : profile?.kyc_verified;
  const avatarLetter = DEMO_MODE ? 'A' : (profile?.name?.[0]?.toUpperCase() || '?');

  // Real deal computed values
  const userId = profile?.id;
  const realDeals = deals.map(d => {
    const isReceiver = d.receiver_id === userId;
    const counterparty = isReceiver
      ? (d.payer as any)?.handle || (d.payer as any)?.name || '—'
      : (d.receiver as any)?.handle || (d.receiver as any)?.name || 'Awaiting';
    const statusCode = d.status === 'active' ? 'locked'
      : d.status === 'pending' ? 'pending'
      : d.status === 'complete' ? 'completed'
      : d.status;
    const updated = new Date(d.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return {
      id: d.code, mode: d.mode.charAt(0).toUpperCase() + d.mode.slice(1),
      status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      statusCode,
      amount: d.amount, currency: d.currency,
      counterparty: counterparty.startsWith('@') ? counterparty : `@${counterparty}`,
      role: isReceiver ? 'Receiver' : 'Payer',
      description: d.description,
      milestone: d.status === 'pending' ? 'Waiting for receiver to connect' : 'Active',
      updated,
    };
  });

  const displayDeals = DEMO_MODE ? SAMPLE.deals : realDeals;
  const filteredDeals = filter === 'all' ? displayDeals
    : filter === 'incoming'  ? displayDeals.filter(d => d.role === 'Receiver')
    : filter === 'outgoing'  ? displayDeals.filter(d => d.role === 'Payer')
    : filter === 'action'    ? displayDeals.filter(d => d.statusCode === 'action')
    : displayDeals.filter(d => d.statusCode === 'completed');

  const lockedForMe  = DEMO_MODE ? SAMPLE.lockedForMe  : displayDeals.filter(d => d.role === 'Receiver' && d.statusCode !== 'completed').reduce((s, d) => s + d.amount, 0);
  const lockedByMe   = DEMO_MODE ? SAMPLE.lockedByMe   : displayDeals.filter(d => d.role === 'Payer' && d.statusCode === 'locked').reduce((s, d) => s + d.amount, 0);
  const actionsCount = DEMO_MODE ? SAMPLE.actions       : displayDeals.filter(d => d.statusCode === 'action').length;

  const statusColor = (code: string) => {
    if (code === 'action')    return 'var(--gold)';
    if (code === 'locked')    return 'var(--indigo-l)';
    if (code === 'completed') return 'var(--green)';
    return 'var(--text-faint)';
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'36px', height:'36px', border:'2px solid rgba(245,245,247,0.08)', borderTopColor:'#7B70F0', borderRadius:'50%', margin:'0 auto 16px', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'rgba(245,245,247,0.38)', fontSize:'13px' }}>Loading your dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:#07070A; --surface:#0D0D12; --surface2:#111118; --surface3:#16161F; --surface4:#1A1A28; --surface5:#1F1F30;
          --indigo:#5B4FE8; --indigo-l:#7B70F0; --indigo-dim:rgba(91,79,232,0.1);
          --gold:#C9A84C; --gold-dim:rgba(201,168,76,0.08);
          --green:#5DCC8A; --green-dim:rgba(93,204,138,0.08);
          --red:#E05252;
          --text-primary:#F5F5F7; --text-body:rgba(245,245,247,0.72); --text-secondary:rgba(245,245,247,0.50);
          --text-label:rgba(245,245,247,0.38); --text-faint:rgba(245,245,247,0.20);
          --border:rgba(245,245,247,0.06); --border-md:rgba(245,245,247,0.10); --border-str:rgba(245,245,247,0.15);
          --sidebar-w:240px; --topbar-h:64px;
          --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-2xl:24px;
        }
        html, body { height:100%; }
        body { background:var(--black); color:var(--text-primary); font-family:'DM Sans',sans-serif; font-size:14px; line-height:1; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::selection { background:rgba(91,79,232,0.25); color:#fff; }

        .shell { display:flex; min-height:100vh; }

        .sidebar { width:var(--sidebar-w); flex-shrink:0; background:var(--surface); border-right:0.5px solid var(--border); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:200; }
        .sidebar-logo { height:var(--topbar-h); display:flex; align-items:center; gap:10px; padding:0 24px; border-bottom:0.5px solid var(--border); text-decoration:none; font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:var(--text-primary); letter-spacing:-0.3px; }
        .sidebar-nav { flex:1; padding:16px 12px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
        .nav-section-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-faint); padding:8px 12px 6px; margin-top:8px; }
        .nav-item { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:var(--r-md); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400; color:var(--text-secondary); text-decoration:none; cursor:pointer; transition:all 0.15s; border:none; background:none; width:100%; text-align:left; }
        .nav-item:hover { color:var(--text-primary); background:var(--surface3); }
        .nav-item.active { color:var(--text-primary); background:var(--indigo-dim); border:0.5px solid rgba(91,79,232,0.18); }
        .nav-item.active svg { color:var(--indigo-l); }
        .nav-badge { margin-left:auto; background:var(--gold); color:var(--black); font-family:'DM Mono',monospace; font-size:9px; font-weight:500; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
        .sidebar-bottom { padding:16px 12px; border-top:0.5px solid var(--border); }
        .user-card { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--r-md); cursor:pointer; transition:background 0.15s; }
        .user-card:hover { background:var(--surface3); }
        .user-avatar { width:32px; height:32px; border-radius:var(--r-sm); background:var(--indigo-dim); border:0.5px solid rgba(91,79,232,0.3); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:var(--indigo-l); flex-shrink:0; }
        .user-info { min-width:0; }
        .user-handle { font-family:'DM Mono',monospace; font-size:12px; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .user-type { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--text-faint); margin-top:2px; display:flex; align-items:center; gap:4px; }
        .verified-dot { width:5px; height:5px; border-radius:50%; background:var(--green); flex-shrink:0; }

        .main { margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; min-height:100vh; min-width:0; }
        .topbar { height:var(--topbar-h); display:flex; align-items:center; justify-content:space-between; padding:0 32px; background:rgba(7,7,10,0.85); backdrop-filter:blur(24px); border-bottom:0.5px solid var(--border); position:sticky; top:0; z-index:100; }
        .topbar-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:var(--text-primary); letter-spacing:-0.3px; }
        .topbar-right { display:flex; align-items:center; gap:8px; }
        .icon-btn { width:36px; height:36px; border-radius:var(--r-md); background:none; border:0.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); cursor:pointer; transition:all 0.15s; position:relative; }
        .icon-btn:hover { color:var(--text-primary); background:var(--surface3); border-color:var(--border-md); }
        .notif-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:var(--gold); border:1.5px solid var(--black); }
        .btn-new-deal { display:flex; align-items:center; gap:8px; padding:9px 18px; border-radius:var(--r-md); background:var(--indigo); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.15s,transform 0.1s; text-decoration:none; }
        .btn-new-deal:hover { background:var(--indigo-l); }
        .btn-new-deal:active { transform:scale(0.97); }

        .content { padding:32px; flex:1; }

        .three-q { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1px; background:var(--border); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); overflow:hidden; margin-bottom:32px; }
        .q-card { background:var(--surface); padding:28px 28px 24px; position:relative; overflow:hidden; transition:background 0.15s; }
        .q-card:hover { background:var(--surface2); }
        .q-card-glow { position:absolute; top:0; left:0; right:0; height:1px; }
        .q-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-faint); margin-bottom:16px; }
        .q-amount { font-family:'Syne',sans-serif; font-size:36px; font-weight:800; letter-spacing:-1.5px; line-height:1; margin-bottom:8px; }
        .q-amount.incoming { color:var(--green); }
        .q-amount.outgoing { color:var(--indigo-l); }
        .q-amount.actions  { color:var(--gold); }
        .q-amount.empty    { color:var(--text-faint); font-size:28px; }
        .q-sub { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-secondary); line-height:1.5; }
        .q-live { display:inline-flex; align-items:center; gap:5px; margin-top:12px; font-family:'DM Mono',monospace; font-size:9px; color:var(--text-faint); letter-spacing:0.08em; }
        .live-dot { width:5px; height:5px; border-radius:50%; animation:pulse 2s ease-in-out infinite; }
        .live-dot.green  { background:var(--green); }
        .live-dot.indigo { background:var(--indigo-l); }
        .live-dot.gold   { background:var(--gold); }

        .deals-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .deals-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:var(--text-primary); letter-spacing:-0.2px; }
        .filter-tabs { display:flex; gap:4px; }
        .filter-tab { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400; color:var(--text-secondary); padding:6px 12px; border-radius:var(--r-sm); background:none; border:0.5px solid transparent; cursor:pointer; transition:all 0.15s; }
        .filter-tab:hover { color:var(--text-primary); background:var(--surface3); }
        .filter-tab.active { color:var(--text-primary); background:var(--surface3); border-color:var(--border-md); }

        .deals-list { display:flex; flex-direction:column; gap:1px; background:var(--border); border:0.5px solid var(--border-md); border-radius:var(--r-2xl); overflow:hidden; }
        .deal-row { background:var(--surface); padding:20px 24px; display:grid; grid-template-columns:auto 1fr auto auto; gap:16px; align-items:center; transition:background 0.15s; cursor:pointer; }
        .deal-row:hover { background:var(--surface2); }
        .deal-status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .deal-main { min-width:0; }
        .deal-id { font-family:'DM Mono',monospace; font-size:10px; color:var(--text-faint); letter-spacing:0.06em; margin-bottom:4px; }
        .deal-desc { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text-primary); margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .deal-meta { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--text-secondary); display:flex; align-items:center; gap:8px; }
        .deal-meta-sep { color:var(--text-faint); }
        .deal-milestone { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--text-secondary); max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .deal-milestone.urgent { color:var(--gold); }
        .deal-amount { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; letter-spacing:-0.5px; text-align:right; white-space:nowrap; }
        .deal-amount.incoming { color:var(--green); }
        .deal-amount.outgoing { color:var(--text-primary); }
        .deal-amount-label { font-family:'DM Mono',monospace; font-size:9px; color:var(--text-faint); letter-spacing:0.06em; text-align:right; margin-top:3px; }
        .deal-action { flex-shrink:0; padding:7px 14px; border-radius:var(--r-sm); font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; cursor:pointer; transition:all 0.15s; border:none; white-space:nowrap; }
        .da-confirm { background:rgba(201,168,76,0.12); color:var(--gold); border:0.5px solid rgba(201,168,76,0.25); }
        .da-confirm:hover { background:rgba(201,168,76,0.2); }
        .da-view { background:var(--surface3); color:var(--text-secondary); border:0.5px solid var(--border); }
        .da-view:hover { color:var(--text-primary); background:var(--surface4); }

        .empty-state { padding:64px 32px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; background:var(--surface); }
        .empty-icon { width:48px; height:48px; border-radius:var(--r-lg); background:var(--surface3); border:0.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text-faint); margin-bottom:4px; }
        .empty-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:var(--text-primary); letter-spacing:-0.2px; }
        .empty-desc { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-secondary); line-height:1.6; max-width:280px; }
        .empty-cta { margin-top:8px; padding:9px 20px; border-radius:var(--r-md); background:var(--indigo); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.15s; text-decoration:none; display:inline-block; }
        .empty-cta:hover { background:var(--indigo-l); }

        .notif-panel { position:fixed; top:var(--topbar-h); right:0; width:320px; background:var(--surface); border-left:0.5px solid var(--border-md); border-bottom:0.5px solid var(--border-md); border-bottom-left-radius:var(--r-2xl); z-index:300; overflow:hidden; }
        .notif-header { padding:16px 20px; border-bottom:0.5px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
        .notif-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:var(--text-primary); letter-spacing:-0.2px; }
        .notif-close { background:none; border:none; color:var(--text-faint); cursor:pointer; padding:2px; transition:color 0.15s; }
        .notif-close:hover { color:var(--text-primary); }
        .notif-empty { padding:40px 20px; text-align:center; font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-faint); }

        .sign-out-btn { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:var(--r-md); background:none; border:none; color:var(--text-faint); font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all 0.15s; width:100%; margin-top:4px; }
        .sign-out-btn:hover { color:var(--red); background:rgba(224,82,82,0.06); }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        @media (max-width:768px) {
          .sidebar { display:none; }
          .main { margin-left:0; }
          .topbar { padding:0 20px; }
          .content { padding:20px 16px; }
          .three-q { grid-template-columns:1fr; }
          .deal-row { grid-template-columns:auto 1fr auto; gap:12px; }
          .deal-milestone { display:none; }
          .filter-tabs { overflow-x:auto; scrollbar-width:none; }
          .filter-tabs::-webkit-scrollbar { display:none; }
          .notif-panel { width:100%; border-left:none; border-radius:0; }
        }
      `}</style>

      <div className="shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/" className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <circle cx="7" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="23" cy="15" r="5" stroke="#7B70F0" strokeWidth="1.2"/>
              <line x1="12" y1="15" x2="18" y2="15" stroke="#7B70F0" strokeWidth="1.2"/>
              <circle cx="15" cy="15" r="2.5" fill="#7B70F0"/>
              <circle cx="7" cy="15" r="2" fill="#7B70F0"/>
              <circle cx="23" cy="15" r="2" fill="#7B70F0"/>
            </svg>
            Gagara
          </a>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            <button className="nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
              {actionsCount > 0 && <span className="nav-badge">{actionsCount}</span>}
            </button>
            <a href="/new-deal" className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              My Agreements
            </a>
            <a href="/connect" className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              Connect
            </a>
            <div className="nav-section-label">Account</div>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Profile
            </button>
            <button className="nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Payouts
            </button>
          </nav>
          <div className="sidebar-bottom">
            <a href="/profile" className="user-card" style={{textDecoration:'none'}}>
              <div className="user-avatar">{avatarLetter}</div>
              <div className="user-info">
                <div className="user-handle">{displayHandle}</div>
                <div className="user-type">
                  {displayVerified && <span className="verified-dot" />}
                  {displayType}
                </div>
              </div>
            </a>
            <button className="sign-out-btn" onClick={signOut}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-title">Good morning, {displayName}</div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => setNotifOpen(v => !v)} aria-label="Notifications">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && <span className="notif-dot" aria-hidden="true" />}
              </button>
              <a href="/new-deal" className="btn-new-deal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New agreement
              </a>
            </div>
          </header>

          <main className="content">
            {/* THREE QUESTIONS */}
            <div className="three-q" role="region" aria-label="Financial summary">
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg,transparent,rgba(93,204,138,0.4),transparent)'}} aria-hidden="true" />
                <div className="q-label">Locked for me</div>
                {lockedForMe > 0 ? (
                  <>
                    <div className="q-amount incoming">${lockedForMe.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                    <div className="q-sub">Across {displayDeals.filter(d => d.role === 'Receiver' && d.statusCode !== 'completed').length} active agreements</div>
                    <div className="q-live"><span className="live-dot green" aria-hidden="true" />Live balance</div>
                  </>
                ) : (
                  <>
                    <div className="q-amount empty">$0.00</div>
                    <div className="q-sub">No incoming deals yet</div>
                  </>
                )}
              </div>
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg,transparent,rgba(123,112,240,0.4),transparent)'}} aria-hidden="true" />
                <div className="q-label">Locked by me</div>
                {lockedByMe > 0 ? (
                  <>
                    <div className="q-amount outgoing">${lockedByMe.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                    <div className="q-sub">Across {displayDeals.filter(d => d.role === 'Payer' && d.statusCode === 'locked').length} active agreements</div>
                    <div className="q-live"><span className="live-dot indigo" aria-hidden="true" />Live balance</div>
                  </>
                ) : (
                  <>
                    <div className="q-amount empty">$0.00</div>
                    <div className="q-sub">No outgoing deals yet</div>
                  </>
                )}
              </div>
              <div className="q-card">
                <div className="q-card-glow" style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)'}} aria-hidden="true" />
                <div className="q-label">Needs your attention</div>
                {actionsCount > 0 ? (
                  <>
                    <div className="q-amount actions">{actionsCount}</div>
                    <div className="q-sub">{actionsCount === 1 ? 'Action' : 'Actions'} waiting for your response</div>
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
              <div className="deals-title">Active agreements</div>
              <div className="filter-tabs" role="tablist">
                {(['all','incoming','outgoing','action','completed'] as Filter[]).map(f => (
                  <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} role="tab" aria-selected={filter === f}>
                    {f === 'all' ? 'All' : f === 'incoming' ? 'Incoming' : f === 'outgoing' ? 'Outgoing' : f === 'action' ? 'Action needed' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="deals-list" role="list">
              {filteredDeals.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <div className="empty-title">No agreements here</div>
                  <div className="empty-desc">{filter === 'all' ? 'Create your first agreement or enter a code to get started.' : `No ${filter} agreements right now.`}</div>
                  {filter === 'all' && <a href="/new-deal" className="empty-cta">Create your first agreement</a>}
                </div>
              ) : (
                filteredDeals.map(deal => (
                  <div key={deal.id} className="deal-row" role="listitem" onClick={() => router.push(`/deal/${deal.id}`)}>
                    <div className="deal-status-dot" style={{background: statusColor(deal.statusCode)}} aria-hidden="true" />
                    <div className="deal-main">
                      <div className="deal-id">{deal.id} · {deal.mode}</div>
                      <div className="deal-desc">{deal.description}</div>
                      <div className="deal-meta">
                        <span>{deal.counterparty}</span>
                        <span className="deal-meta-sep">·</span>
                        <span>{deal.role === 'Receiver' ? 'Incoming' : 'Outgoing'}</span>
                        <span className="deal-meta-sep">·</span>
                        <span>{deal.updated}</span>
                      </div>
                    </div>
                    <div className={`deal-milestone ${deal.statusCode === 'action' ? 'urgent' : ''}`}>{deal.milestone}</div>
                    <div>
                      <div className={`deal-amount ${deal.role === 'Receiver' ? 'incoming' : 'outgoing'}`}>
                        ${deal.amount.toLocaleString('en-US',{minimumFractionDigits:2})}
                      </div>
                      <div className="deal-amount-label">{deal.currency} · {deal.status}</div>
                      <div style={{marginTop:'8px',display:'flex',justifyContent:'flex-end'}}>
                        {deal.statusCode === 'action' ? (
                          <button className="deal-action da-confirm" onClick={e => e.stopPropagation()}>Confirm</button>
                        ) : (
                          <button className="deal-action da-view" onClick={e => e.stopPropagation()}>View</button>
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
            <button className="notif-close" onClick={() => setNotifOpen(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {notifs.length > 0 ? (
            <>
              <div style={{padding:'8px 20px',borderBottom:'0.5px solid var(--border)',display:'flex',justifyContent:'flex-end'}}>
                <button onClick={markAllRead} style={{background:'none',border:'none',fontFamily:'DM Sans,sans-serif',fontSize:'11px',color:'var(--text-faint)',cursor:'pointer',padding:'4px 0'}}>
                  Mark all read
                </button>
              </div>
              {notifs.map(n => (
                <div key={n.id}
                  onClick={() => { if (n.deal_id) { setNotifOpen(false); router.push(`/deal/${n.deal_id}`); } }}
                  style={{padding:'14px 20px',borderBottom:'0.5px solid var(--border)',display:'flex',gap:'12px',alignItems:'flex-start',cursor:n.deal_id?'pointer':'default',background:n.read?'transparent':'rgba(91,79,232,0.04)'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:n.urgent?'var(--gold)':n.read?'var(--text-faint)':'var(--indigo-l)',flexShrink:0,marginTop:'4px'}} />
                  <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'12px',color:'var(--text-body)',lineHeight:1.5,flex:1}}>{n.text}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'var(--text-faint)',whiteSpace:'nowrap',flexShrink:0,marginTop:'2px'}}>{n.time}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="notif-empty">No notifications yet</div>
          )}
        </div>
      )}
    </>
  );
}
