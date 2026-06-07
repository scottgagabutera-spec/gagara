'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────
type VaultState = 'linked' | 'funded' | 'active' | 'confirming' | 'releasing' | 'complete' | 'disputed';
type MyRole     = 'payer' | 'receiver';

interface MilestoneRow {
  id:                string;
  label:             string;
  percent:           number;
  amount:            number;
  payer_confirmed:   boolean;
  receiver_confirmed:boolean;
  released:          boolean;
}

interface ConditionRow {
  id:                string;
  text:              string;
  payer_confirmed:   boolean;
  receiver_confirmed:boolean;
}

interface AuditEntry {
  time:      string;
  event:     string;
  actor:     string;
  highlight?:boolean;
}

interface DealData {
  id:               string;
  code:             string;
  mode:             string;
  currency:         string;
  amount:           number;
  description:      string;
  deadline:         string | null;
  status:           string;
  payer_id:         string | null;
  receiver_id:      string | null;
  release_type:     string;
  milestones:       MilestoneRow[];
  conditions:       ConditionRow[];
  audit:            AuditEntry[];
  payer_handle:     string;
  payer_verified:   boolean;
  receiver_handle:  string;
  receiver_verified:boolean;
  created_at:       string;
}

export default function DealPage() {
  const params   = useParams();
  const router   = useRouter();
  const dealId   = params?.id as string;

  const [deal,        setDeal]        = useState<DealData | null>(null);
  const [myRole,      setMyRole]      = useState<MyRole | null>(null);
  const [userId,      setUserId]      = useState<string | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [dispute,     setDispute]     = useState(false);
  const [disputeText, setDisputeText] = useState('');
  const [disputeSent, setDisputeSent] = useState(false);
  const [saving,      setSaving]      = useState(false);

  // ── Load deal ──────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/sign-in'); return; }
      setUserId(session.user.id);

      const { data, error: fetchErr } = await supabase
        .from('deals')
        .select(`
          *,
          payer_profile:profiles!deals_payer_id_fkey(handle, name, kyc_verified),
          receiver_profile:profiles!deals_receiver_id_fkey(handle, name, kyc_verified)
        `)
        .eq('id', dealId)
        .single();

      if (fetchErr || !data) {
        setError('Deal not found or you do not have access.');
        setLoading(false);
        return;
      }

      // Make sure user is a party to this deal
      if (data.payer_id !== session.user.id && data.receiver_id !== session.user.id) {
        setError('You are not a party to this deal.');
        setLoading(false);
        return;
      }

      const role: MyRole = data.payer_id === session.user.id ? 'payer' : 'receiver';
      setMyRole(role);

      // Build milestone rows with per-party confirmation state
      const storedMilestones: { label: string; percent: number }[] = data.milestones || [];
      const milestoneConfirms: Record<string, { payer: boolean; receiver: boolean; released: boolean }> =
        data.milestone_confirms || {};

      const milestoneRows: MilestoneRow[] = storedMilestones.map((m, i) => {
        const key = `m${i}`;
        const conf = milestoneConfirms[key] || { payer: false, receiver: false, released: false };
        return {
          id:                 key,
          label:              m.label,
          percent:            m.percent,
          amount:             (data.amount * m.percent) / 100,
          payer_confirmed:    conf.payer,
          receiver_confirmed: conf.receiver,
          released:           conf.released,
        };
      });

      // Build condition rows
      const storedConditions: string[] = data.conditions || [];
      const conditionConfirms: Record<string, { payer: boolean; receiver: boolean }> =
        data.condition_confirms || {};

      const conditionRows: ConditionRow[] = storedConditions.map((text, i) => {
        const key = `c${i}`;
        const conf = conditionConfirms[key] || { payer: false, receiver: false };
        return {
          id:                 key,
          text,
          payer_confirmed:    conf.payer,
          receiver_confirmed: conf.receiver,
        };
      });

      // Build audit log
      const auditRows: AuditEntry[] = data.audit_log || [
        { time: fmtTime(data.created_at), event: 'Deal created', actor: handleOf(data.payer_profile) },
        ...(data.payer_id && data.receiver_id
          ? [{ time: fmtTime(data.created_at), event: 'Both parties connected', actor: `${handleOf(data.receiver_profile)} joined`, highlight: true }]
          : []),
      ];

      setDeal({
        id:               data.id,
        code:             data.code,
        mode:             data.mode || 'Personal',
        currency:         data.currency || 'USD',
        amount:           data.amount,
        description:      data.description,
        deadline:         data.deadline,
        status:           data.status,
        payer_id:         data.payer_id,
        receiver_id:      data.receiver_id,
        release_type:     data.release_type,
        milestones:       milestoneRows,
        conditions:       conditionRows,
        audit:            auditRows,
        payer_handle:     handleOf(data.payer_profile),
        payer_verified:   data.payer_profile?.kyc_verified || false,
        receiver_handle:  handleOf(data.receiver_profile),
        receiver_verified:data.receiver_profile?.kyc_verified || false,
        created_at:       data.created_at,
      });

      setLoading(false);
    };

    init();
  }, [dealId, router]);

  // ── Helpers ────────────────────────────────
  const handleOf = (profile: any) =>
    profile?.handle ? `@${profile.handle}` : profile?.name || 'Unknown';

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const nowTime = () =>
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const isMe = (role: 'payer' | 'receiver') => role === myRole;
  const myConfirmedMilestone  = (m: MilestoneRow)  => isMe('payer') ? m.payer_confirmed  : m.receiver_confirmed;
  const theirConfirmedMilestone = (m: MilestoneRow) => isMe('payer') ? m.receiver_confirmed : m.payer_confirmed;
  const myConfirmedCondition  = (c: ConditionRow)  => isMe('payer') ? c.payer_confirmed  : c.receiver_confirmed;

  // ── Confirm milestone ──────────────────────
  const confirmMilestone = async (id: string) => {
    if (!deal || !myRole || saving) return;
    setSaving(true);

    const current: Record<string, any> = (await supabase
      .from('deals').select('milestone_confirms').eq('id', deal.id).single())
      .data?.milestone_confirms || {};

    const entry = current[id] || { payer: false, receiver: false, released: false };
    if (myRole === 'payer') entry.payer = true;
    else entry.receiver = true;
    const bothDone = entry.payer && entry.receiver;
    if (bothDone) entry.released = true;
    current[id] = entry;

    // Build new audit entry
    const newAudit = [
      ...deal.audit,
      { time: nowTime(), event: `Milestone confirmed`, actor: myRole === 'payer' ? deal.payer_handle : deal.receiver_handle, highlight: true },
      ...(bothDone ? [{ time: nowTime(), event: `Milestone funds released`, actor: 'Gagara', highlight: true }] : []),
    ];

    const allReleased = deal.milestones.every(m => m.id === id ? bothDone : m.released);
    const newStatus = allReleased && deal.conditions.every(c => c.payer_confirmed && c.receiver_confirmed)
      ? 'complete' : deal.status;

    await supabase.from('deals').update({
      milestone_confirms: current,
      audit_log: newAudit,
      status: newStatus,
    }).eq('id', deal.id);

    // Notify the other party
    const otherPartyId = myRole === 'payer' ? deal.receiver_id : deal.payer_id;
    if (otherPartyId) {
      const myHandle = myRole === 'payer' ? deal.payer_handle : deal.receiver_handle;
      const notifText = bothDone
        ? `${myHandle} confirmed a milestone on ${deal.code} — funds released`
        : `${myHandle} confirmed a milestone on ${deal.code} — your confirmation needed`;
      await supabase.from('notifications').insert({
        user_id:   otherPartyId,
        deal_id:   deal.id,
        deal_code: deal.code,
        text:      notifText,
        urgent:    !bothDone,
      });
    }

    setDeal(d => {
      if (!d) return d;
      return {
        ...d,
        status: newStatus,
        milestones: d.milestones.map(m => {
          if (m.id !== id) return m;
          return {
            ...m,
            payer_confirmed:    myRole === 'payer' ? true : m.payer_confirmed,
            receiver_confirmed: myRole === 'receiver' ? true : m.receiver_confirmed,
            released: bothDone,
          };
        }),
        audit: newAudit,
      };
    });

    setSaving(false);
  };

  // ── Confirm condition ──────────────────────
  const confirmCondition = async (id: string) => {
    if (!deal || !myRole || saving) return;
    setSaving(true);

    const current: Record<string, any> = (await supabase
      .from('deals').select('condition_confirms').eq('id', deal.id).single())
      .data?.condition_confirms || {};

    const entry = current[id] || { payer: false, receiver: false };
    if (myRole === 'payer') entry.payer = true;
    else entry.receiver = true;
    current[id] = entry;

    const newAudit = [
      ...deal.audit,
      { time: nowTime(), event: 'Condition confirmed', actor: myRole === 'payer' ? deal.payer_handle : deal.receiver_handle },
    ];

    await supabase.from('deals').update({
      condition_confirms: current,
      audit_log: newAudit,
    }).eq('id', deal.id);

    // Notify the other party
    const otherPartyId2 = myRole === 'payer' ? deal.receiver_id : deal.payer_id;
    if (otherPartyId2) {
      const myHandle2 = myRole === 'payer' ? deal.payer_handle : deal.receiver_handle;
      await supabase.from('notifications').insert({
        user_id:   otherPartyId2,
        deal_id:   deal.id,
        deal_code: deal.code,
        text:      `${myHandle2} confirmed a condition on ${deal.code}`,
        urgent:    false,
      });
    }

    setDeal(d => {
      if (!d) return d;
      return {
        ...d,
        conditions: d.conditions.map(c => {
          if (c.id !== id) return c;
          return {
            ...c,
            payer_confirmed:    myRole === 'payer' ? true : c.payer_confirmed,
            receiver_confirmed: myRole === 'receiver' ? true : c.receiver_confirmed,
          };
        }),
        audit: newAudit,
      };
    });

    setSaving(false);
  };

  // ── Dispute ────────────────────────────────
  const submitDispute = async () => {
    if (!deal || !disputeText.trim() || !myRole) return;
    setSaving(true);

    const newAudit = [
      ...deal.audit,
      { time: nowTime(), event: 'Dispute raised', actor: myRole === 'payer' ? deal.payer_handle : deal.receiver_handle, highlight: true },
    ];

    await supabase.from('deals').update({
      status: 'disputed',
      dispute_reason: disputeText,
      audit_log: newAudit,
    }).eq('id', deal.id);

    // Notify the other party
    const otherPartyId3 = myRole === 'payer' ? deal.receiver_id : deal.payer_id;
    if (otherPartyId3) {
      const myHandle3 = myRole === 'payer' ? deal.payer_handle : deal.receiver_handle;
      await supabase.from('notifications').insert({
        user_id:   otherPartyId3,
        deal_id:   deal.id,
        deal_code: deal.code,
        text:      `${myHandle3} raised a dispute on ${deal.code} — funds are frozen`,
        urgent:    true,
      });
    }

    setDeal(d => d ? { ...d, status: 'disputed', audit: newAudit } : d);
    setDisputeSent(true);
    setSaving(false);
  };

  // ── Derived state ──────────────────────────
  const allConditionsMet    = deal?.conditions.every(c => c.payer_confirmed && c.receiver_confirmed) ?? false;
  const allMilestonesReleased = deal?.milestones.every(m => m.released) ?? false;
  const dealComplete        = allConditionsMet && (deal?.release_type !== 'milestones' || allMilestonesReleased);

  const releasedAmount = deal?.milestones.filter(m => m.released).reduce((s, m) => s + m.amount, 0) ?? 0;
  const pendingAmount  = (deal?.amount ?? 0) - releasedAmount;

  const vaultState: VaultState = deal
    ? deal.status === 'complete'  ? 'complete'
    : deal.status === 'disputed'  ? 'disputed'
    : deal.status === 'active'    ? 'active'
    : deal.status === 'funded'    ? 'funded'
    : 'linked'
    : 'linked';

  const vaultColor = () => {
    if (vaultState === 'complete') return 'var(--green)';
    if (vaultState === 'disputed') return 'var(--red)';
    return 'var(--indigo-l)';
  };

  const vaultLabel = () => {
    if (vaultState === 'linked')   return 'Linked';
    if (vaultState === 'funded')   return 'Funded';
    if (vaultState === 'active')   return 'Active';
    if (vaultState === 'complete') return 'Complete';
    if (vaultState === 'disputed') return 'Disputed';
    return '';
  };

  // ── Render ─────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        body { background: #07070A; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .spin { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(245,245,247,0.1); border-top-color: #7B70F0; animation: s 0.8s linear infinite; }
        @keyframes s { to { transform: rotate(360deg); } }
      `}</style>
      <div className="spin" />
    </>
  );

  if (error || !deal) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
        body { background: #07070A; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: 'DM Sans', sans-serif; color: rgba(245,245,247,0.5); }
        a { color: #7B70F0; }
      `}</style>
      <div style={{ textAlign: 'center' }}>
        <p>{error || 'Deal not found.'}</p>
        <a href="/dashboard">Back to dashboard</a>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:#07070A; --surface:#0D0D12; --surface2:#111118; --surface3:#16161F; --surface4:#1A1A28;
          --indigo:#5B4FE8; --indigo-l:#7B70F0; --indigo-dim:rgba(91,79,232,0.1);
          --gold:#C9A84C; --gold-dim:rgba(201,168,76,0.08);
          --green:#5DCC8A; --green-dim:rgba(93,204,138,0.08);
          --red:#E05252; --red-dim:rgba(224,82,82,0.08);
          --text-primary:#F5F5F7; --text-body:rgba(245,245,247,0.72); --text-secondary:rgba(245,245,247,0.50);
          --text-label:rgba(245,245,247,0.38); --text-faint:rgba(245,245,247,0.20);
          --border:rgba(245,245,247,0.06); --border-md:rgba(245,245,247,0.10); --border-hi:rgba(245,245,247,0.16);
          --r-sm:8px; --r-md:12px; --r-lg:16px; --r-2xl:24px;
          --topbar-h:64px;
        }
        html, body { height: 100%; }
        body { background: var(--black); color: var(--text-primary); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: rgba(91,79,232,0.25); color: #fff; }

        .shell { min-height: 100vh; display: flex; flex-direction: column; }

        .topbar { height: var(--topbar-h); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: rgba(7,7,10,0.92); backdrop-filter: blur(24px); border-bottom: 0.5px solid var(--border); position: sticky; top: 0; z-index: 200; flex-shrink: 0; }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .topbar-logo { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: var(--text-primary); text-decoration: none; letter-spacing: -0.3px; }
        .topbar-sep { width: 1px; height: 20px; background: var(--border-md); }
        .topbar-code { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--text-secondary); letter-spacing: 0.06em; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .vault-state-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; border: 0.5px solid; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
        .state-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        .btn-back { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: var(--r-md); background: none; border: 0.5px solid var(--border-md); color: var(--text-secondary); font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.15s; text-decoration: none; }
        .btn-back:hover { color: var(--text-primary); border-color: var(--border-hi); }

        .body-grid { flex: 1; display: grid; grid-template-columns: 1fr 320px; gap: 24px; max-width: 1200px; margin: 0 auto; width: 100%; padding: 32px 32px 80px; align-items: start; }
        .left-col  { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
        .right-col { display: flex; flex-direction: column; gap: 16px; position: sticky; top: calc(var(--topbar-h) + 24px); }

        .card { background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-2xl); overflow: hidden; }
        .card-head { padding: 16px 20px; border-bottom: 0.5px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .card-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); }
        .card-body { padding: 20px; }

        .deal-header-card { background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-2xl); overflow: hidden; position: relative; }
        .deal-header-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 0.5px; background: linear-gradient(90deg, transparent, var(--indigo-l), transparent); }
        .dh-top { padding: 20px 24px 16px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .dh-amount { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; letter-spacing: -2px; color: var(--text-primary); line-height: 1; margin-bottom: 6px; }
        .dh-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-body); line-height: 1.5; max-width: 400px; }
        .dh-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
        .mode-pill { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--indigo-l); background: var(--indigo-dim); border: 0.5px solid rgba(91,79,232,0.2); padding: 4px 10px; border-radius: 5px; letter-spacing: 0.06em; }
        .deadline-pill { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--text-faint); letter-spacing: 0.06em; }

        .dh-parties { display: grid; grid-template-columns: 1fr auto 1fr; border-top: 0.5px solid var(--border); }
        .party-block { padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
        .party-block.recv { flex-direction: row-reverse; }
        .party-avatar { width: 36px; height: 36px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; flex-shrink: 0; }
        .party-avatar.payer    { background: var(--indigo-dim); color: var(--indigo-l); border: 0.5px solid rgba(91,79,232,0.3); }
        .party-avatar.receiver { background: var(--green-dim);  color: var(--green);    border: 0.5px solid rgba(93,204,138,0.3); }
        .party-info { min-width: 0; }
        .party-info.right { text-align: right; }
        .party-role { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 3px; }
        .party-handle { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--text-primary); font-weight: 500; }
        .party-verified { display: flex; align-items: center; gap: 4px; font-family: 'DM Mono', monospace; font-size: 9px; color: var(--green); margin-top: 2px; }
        .party-info.right .party-verified { justify-content: flex-end; }
        .you-tag { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--gold); background: var(--gold-dim); border: 0.5px solid rgba(201,168,76,0.2); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.06em; }

        .vault-center { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px 12px; border-left: 0.5px solid var(--border); border-right: 0.5px solid var(--border); }
        .vault-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.5s; }
        .vault-pct-bar { width: 64px; height: 3px; border-radius: 2px; background: var(--border-md); overflow: hidden; }
        .vault-pct-fill { height: 100%; border-radius: 2px; background: var(--green); transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }

        .balance-strip { display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr; border-top: 0.5px solid var(--border); }
        .balance-cell { padding: 14px 20px; text-align: center; }
        .balance-cell-div { background: var(--border); }
        .balance-val { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
        .balance-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); }

        .action-banner { padding: 14px 20px; border-radius: var(--r-lg); display: flex; gap: 12px; align-items: center; }
        .action-banner.yours   { background: rgba(201,168,76,0.07); border: 0.5px solid rgba(201,168,76,0.2); }
        .action-banner.theirs  { background: var(--surface2); border: 0.5px solid var(--border-md); }
        .action-banner.complete { background: var(--green-dim); border: 0.5px solid rgba(93,204,138,0.2); }
        .ab-icon { flex-shrink: 0; }
        .ab-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-body); line-height: 1.5; flex: 1; }
        .ab-text strong { color: var(--text-primary); font-weight: 500; }

        .milestone-row { padding: 16px 20px; border-bottom: 0.5px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
        .milestone-row:last-child { border-bottom: none; }
        .mr-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .mr-label { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-primary); line-height: 1.4; flex: 1; }
        .mr-amount { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; flex-shrink: 0; }
        .mr-confirms { display: flex; gap: 8px; }
        .confirm-chip { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 20px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.06em; }
        .confirm-chip.done    { color: var(--green); background: var(--green-dim); border: 0.5px solid rgba(93,204,138,0.2); }
        .confirm-chip.pending { color: var(--text-faint); background: var(--surface2); border: 0.5px solid var(--border); }
        .chip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .btn-confirm { padding: 9px 18px; border-radius: var(--r-md); background: var(--indigo); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; align-self: flex-start; }
        .btn-confirm:hover { background: var(--indigo-l); }
        .btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-confirm.green-btn { background: var(--green); color: var(--black); }
        .btn-confirm.green-btn:hover { background: #4db87a; }
        .released-badge { display: flex; align-items: center; gap: 6px; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--green); letter-spacing: 0.06em; }

        .condition-row { padding: 12px 20px; border-bottom: 0.5px solid var(--border); display: flex; align-items: flex-start; gap: 12px; }
        .condition-row:last-child { border-bottom: none; }
        .cond-num { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--indigo-l); flex-shrink: 0; margin-top: 2px; min-width: 20px; }
        .cond-body { flex: 1; min-width: 0; }
        .cond-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.5; margin-bottom: 8px; }
        .cond-confirms { display: flex; gap: 6px; flex-wrap: wrap; }
        .cond-action { flex-shrink: 0; }

        .audit-list { display: flex; flex-direction: column; }
        .audit-row { display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: flex-start; padding: 12px 20px; border-bottom: 0.5px solid var(--border); }
        .audit-row:last-child { border-bottom: none; }
        .audit-row.highlight { background: rgba(91,79,232,0.04); }
        .audit-time  { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-faint); margin-top: 1px; }
        .audit-event { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.4; }
        .audit-actor { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--indigo-l); white-space: nowrap; }

        .mini-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 12px; }
        .action-link { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--r-md); background: var(--surface2); border: 0.5px solid var(--border); cursor: pointer; transition: all 0.15s; width: 100%; text-align: left; }
        .action-link:hover { background: var(--surface3); border-color: var(--border-md); }
        .action-link.danger:hover { border-color: rgba(224,82,82,0.3); background: var(--red-dim); }
        .action-link svg { flex-shrink: 0; }
        .action-link-body { flex: 1; min-width: 0; }
        .action-link-title { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; }
        .action-link.danger .action-link-title { color: var(--red); }
        .action-link-desc { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--text-faint); line-height: 1.4; }

        .dispute-form { display: flex; flex-direction: column; gap: 10px; padding: 16px; background: var(--surface2); border: 0.5px solid rgba(224,82,82,0.2); border-radius: var(--r-lg); }
        .dispute-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); }
        .dispute-input { background: var(--surface); border: 0.5px solid var(--border-md); border-radius: var(--r-md); padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-primary); outline: none; resize: none; line-height: 1.5; min-height: 80px; }
        .dispute-input:focus { border-color: rgba(224,82,82,0.4); }
        .dispute-input::placeholder { color: var(--text-faint); }
        .btn-dispute { padding: 10px 16px; border-radius: var(--r-md); background: var(--red); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
        .btn-dispute:hover { background: #c94545; }
        .btn-dispute:disabled { opacity: 0.4; cursor: not-allowed; }
        .dispute-note { font-family: 'DM Sans', sans-serif; font-size: 10px; color: var(--text-faint); line-height: 1.5; }
        .dispute-sent { padding: 12px 16px; background: var(--red-dim); border: 0.5px solid rgba(224,82,82,0.2); border-radius: var(--r-md); font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-body); line-height: 1.5; }

        .complete-banner { padding: 20px 24px; background: var(--green-dim); border: 0.5px solid rgba(93,204,138,0.2); border-radius: var(--r-2xl); display: flex; gap: 14px; align-items: center; }
        .cb-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(93,204,138,0.12); border: 0.5px solid rgba(93,204,138,0.25); display: flex; align-items: center; justify-content: center; color: var(--green); flex-shrink: 0; }
        .cb-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-body); line-height: 1.6; }
        .cb-text strong { color: var(--text-primary); font-weight: 500; }

        @media (max-width: 900px) {
          .body-grid { grid-template-columns: 1fr; padding: 20px 16px 80px; }
          .right-col { position: static; }
          .topbar { padding: 0 20px; }
          .topbar-code { display: none; }
          .dh-parties { grid-template-columns: 1fr; }
          .vault-center { border-left: none; border-right: none; border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); flex-direction: row; padding: 12px 20px; gap: 12px; }
          .balance-strip { grid-template-columns: 1fr 1fr 1fr; }
          .balance-cell-div { display: none; }
        }
      `}</style>

      <div className="shell">
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
            <div className="topbar-code">{deal.code}</div>
          </div>
          <div className="topbar-right">
            <div className="vault-state-pill" style={{
              color: vaultColor(),
              borderColor: `${vaultColor()}44`,
              background: `${vaultColor()}14`,
            }}>
              <div className="state-dot" style={{background: vaultColor()}} />
              {vaultLabel()}
            </div>
            <a href="/dashboard" className="btn-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Dashboard
            </a>
          </div>
        </header>

        <div className="body-grid">
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
                  {deal.deadline && (
                    <span className="deadline-pill">Due {new Date(deal.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                  )}
                </div>
              </div>

              <div className="dh-parties">
                <div className="party-block">
                  <div className="party-avatar payer">{deal.payer_handle.replace('@','')[0].toUpperCase()}</div>
                  <div className="party-info">
                    <div className="party-role">Payer {myRole === 'payer' && <span className="you-tag">you</span>}</div>
                    <div className="party-handle">{deal.payer_handle}</div>
                    {deal.payer_verified && (
                      <div className="party-verified">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(93,204,138,0.1)" stroke="#5DCC8A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#5DCC8A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                <div className="vault-center">
                  <div className="vault-icon" style={{background:`${vaultColor()}18`, border:`0.5px solid ${vaultColor()}44`}}>
                    {dealComplete
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vaultColor()} strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vaultColor()} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    }
                  </div>
                  <div className="vault-pct-bar">
                    <div className="vault-pct-fill" style={{width:`${deal.amount > 0 ? (releasedAmount/deal.amount)*100 : 0}%`}} />
                  </div>
                </div>

                <div className="party-block recv">
                  <div className="party-avatar receiver">{deal.receiver_handle.replace('@','')[0].toUpperCase()}</div>
                  <div className="party-info right">
                    <div className="party-role">Receiver {myRole === 'receiver' && <span className="you-tag">you</span>}</div>
                    <div className="party-handle">{deal.receiver_handle}</div>
                    {deal.receiver_verified && (
                      <div className="party-verified">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="rgba(93,204,138,0.1)" stroke="#5DCC8A" strokeWidth="0.6"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#5DCC8A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="balance-strip">
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--indigo-l)'}}>{deal.currency} {deal.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                  <div className="balance-label">In vault</div>
                </div>
                <div className="balance-cell-div" />
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--green)'}}>{deal.currency} {releasedAmount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                  <div className="balance-label">Released</div>
                </div>
                <div className="balance-cell-div" />
                <div className="balance-cell">
                  <div className="balance-val" style={{color:'var(--text-secondary)'}}>{deal.currency} {pendingAmount.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                  <div className="balance-label">Pending</div>
                </div>
              </div>
            </div>

            {/* Complete banner */}
            {dealComplete && (
              <div className="complete-banner">
                <div className="cb-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div className="cb-text"><strong>Deal complete.</strong> All conditions confirmed by both parties. All funds have been released. Download the full audit PDF from the panel.</div>
              </div>
            )}

            {/* Action banner */}
            {!dealComplete && (() => {
              const needsMyAction = deal.milestones.some(m => !myConfirmedMilestone(m) && !m.released)
                || deal.conditions.some(c => !myConfirmedCondition(c));
              const them = myRole === 'payer' ? deal.receiver_handle : deal.payer_handle;
              return (
                <div className={`action-banner ${needsMyAction ? 'yours' : 'theirs'}`}>
                  {needsMyAction ? (
                    <>
                      <div className="ab-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                      <div className="ab-text"><strong>Your turn.</strong> Review the milestones and conditions below and confirm what has been completed.</div>
                    </>
                  ) : (
                    <>
                      <div className="ab-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                      <div className="ab-text" style={{color:'var(--text-secondary)'}}>Waiting for <strong style={{color:'var(--text-primary)'}}>{them}</strong> to confirm. You will be notified when action is needed.</div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Milestones */}
            {deal.milestones.length > 0 && (
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
                      <div className={`confirm-chip ${m.payer_confirmed ? 'done' : 'pending'}`}>
                        <div className="chip-dot" style={{background: m.payer_confirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                        {deal.payer_handle}
                      </div>
                      <div className={`confirm-chip ${m.receiver_confirmed ? 'done' : 'pending'}`}>
                        <div className="chip-dot" style={{background: m.receiver_confirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                        {deal.receiver_handle}
                      </div>
                    </div>
                    {m.released ? (
                      <div className="released-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Released
                      </div>
                    ) : myConfirmedMilestone(m) ? (
                      <div style={{fontFamily:'DM Sans',fontSize:'11px',color:'var(--text-faint)'}}>
                        You confirmed. Waiting for {myRole === 'payer' ? deal.receiver_handle : deal.payer_handle}.
                      </div>
                    ) : (
                      <button
                        className={`btn-confirm ${theirConfirmedMilestone(m) ? 'green-btn' : ''}`}
                        onClick={() => confirmMilestone(m.id)}
                        disabled={saving}
                      >
                        {theirConfirmedMilestone(m) ? 'Confirm to release funds' : 'Confirm milestone complete'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Conditions */}
            {deal.conditions.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <div className="card-label">Release conditions</div>
                  <div style={{fontFamily:'DM Mono',fontSize:'9px',color:'var(--text-faint)',letterSpacing:'0.06em'}}>Both must confirm all</div>
                </div>
                {deal.conditions.map((c, i) => (
                  <div key={c.id} className="condition-row">
                    <div className="cond-num">0{i+1}</div>
                    <div className="cond-body">
                      <div className="cond-text">{c.text}</div>
                      <div className="cond-confirms">
                        <div className={`confirm-chip ${c.payer_confirmed ? 'done' : 'pending'}`}>
                          <div className="chip-dot" style={{background: c.payer_confirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                          {deal.payer_handle}
                        </div>
                        <div className={`confirm-chip ${c.receiver_confirmed ? 'done' : 'pending'}`}>
                          <div className="chip-dot" style={{background: c.receiver_confirmed ? 'var(--green)' : 'var(--text-faint)'}} />
                          {deal.receiver_handle}
                        </div>
                      </div>
                    </div>
                    <div className="cond-action">
                      {myConfirmedCondition(c) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <button className="btn-confirm" onClick={() => confirmCondition(c.id)} disabled={saving}>Confirm</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

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

          {/* RIGHT COLUMN */}
          <div className="right-col">

            <div className="card">
              <div className="card-body">
                <div className="mini-label">Deal info</div>
                {[
                  ['Code',    deal.code],
                  ['Mode',    deal.mode],
                  ['Release', deal.release_type === 'milestones' ? `${deal.milestones.length} milestones` : deal.release_type === 'scheduled' ? 'Scheduled' : 'Single'],
                  ...(deal.deadline ? [['Deadline', new Date(deal.deadline).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})]] : []),
                  ['Created', new Date(deal.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})],
                ].map(([k,v]) => (
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'0.5px solid var(--border)'}}>
                    <span style={{fontFamily:'DM Sans',fontSize:'12px',color:'var(--text-secondary)'}}>{k}</span>
                    <span style={{fontFamily: k==='Code' ? 'DM Mono' : 'DM Sans',fontSize:'12px',color:'var(--text-primary)',fontWeight:500,letterSpacing: k==='Code'?'0.04em':'normal'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="mini-label">Actions</div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  <button className="action-link">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div className="action-link-body">
                      <div className="action-link-title">Download audit PDF</div>
                      <div className="action-link-desc">Full record, court-ready</div>
                    </div>
                  </button>
                  {!dispute && !disputeSent && deal.status !== 'disputed' && (
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
                <button className="btn-dispute" onClick={submitDispute} disabled={!disputeText.trim() || saving}>
                  {saving ? 'Submitting...' : 'Submit dispute'}
                </button>
                <div className="dispute-note">Funds will be frozen. A court-ready PDF of the full deal record will be generated automatically.</div>
                <button style={{background:'none',border:'none',color:'var(--text-faint)',fontSize:'11px',cursor:'pointer',padding:'0'}} onClick={() => setDispute(false)}>Cancel</button>
              </div>
            )}

            {(disputeSent || deal.status === 'disputed') && (
              <div className="dispute-sent">
                Dispute submitted. Funds are frozen. Both parties will receive the full audit PDF.
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
