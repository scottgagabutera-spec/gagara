const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Add notifications state after notifOpen state
c = c.replace(
  `  const [notifOpen, setNotifOpen] = useState(false);`,
  `  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]           = useState<{id:string;text:string;time:string;urgent:boolean;read:boolean;deal_id:string|null;deal_code:string|null}[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);`
);

// 2. Load notifications in the init useEffect, after deals load
c = c.replace(
  `      if (dealData) setDeals(dealData);`,
  `      if (dealData) setDeals(dealData);

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
      }`
);

// 3. Add fmtAgo helper after signOut function
c = c.replace(
  `  const signOut = async () => {`,
  `  const fmtAgo = (iso: string) => {
    const ms = Date.now() - new Date(iso).getTime();
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return \`\${d}d ago\`;
    if (h > 0) return \`\${h}h ago\`;
    if (m > 0) return \`\${m}m ago\`;
    return 'just now';
  };

  const markAllRead = async () => {
    if (!profile?.id) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', profile.id).eq('read', false);
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  const signOut = async () => {`
);

// 4. Replace notif-dot to use real unread count
c = c.replace(
  `{DEMO_MODE && <span className="notif-dot" aria-hidden="true" />}`,
  `{unreadCount > 0 && <span className="notif-dot" aria-hidden="true" />}`
);

// 5. Replace notification panel content to use real data
c = c.replace(
  `          {DEMO_MODE ? (
            SAMPLE.notifications.map(n => (
              <div key={n.id} style={{padding:'14px 20px',borderBottom:'0.5px solid var(--border)',display:'flex',gap:'12px',alignItems:'flex-start',cursor:'pointer'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:n.urgent?'var(--gold)':'var(--text-faint)',flexShrink:0,marginTop:'4px'}} />
                <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'12px',color:'var(--text-body)',lineHeight:1.5,flex:1}}>{n.text}</div>
                <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'var(--text-faint)',whiteSpace:'nowrap',flexShrink:0,marginTop:'2px'}}>{n.time}</div>
              </div>
            ))
          ) : (
            <div className="notif-empty">No notifications yet</div>
          )}`,
  `          {notifs.length > 0 ? (
            <>
              <div style={{padding:'8px 20px',borderBottom:'0.5px solid var(--border)',display:'flex',justifyContent:'flex-end'}}>
                <button onClick={markAllRead} style={{background:'none',border:'none',fontFamily:'DM Sans,sans-serif',fontSize:'11px',color:'var(--text-faint)',cursor:'pointer',padding:'4px 0'}}>
                  Mark all read
                </button>
              </div>
              {notifs.map(n => (
                <div key={n.id}
                  onClick={() => { if (n.deal_id) { setNotifOpen(false); router.push(\`/deal/\${n.deal_id}\`); } }}
                  style={{padding:'14px 20px',borderBottom:'0.5px solid var(--border)',display:'flex',gap:'12px',alignItems:'flex-start',cursor:n.deal_id?'pointer':'default',background:n.read?'transparent':'rgba(91,79,232,0.04)'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:n.urgent?'var(--gold)':n.read?'var(--text-faint)':'var(--indigo-l)',flexShrink:0,marginTop:'4px'}} />
                  <div style={{fontFamily:'DM Sans,sans-serif',fontSize:'12px',color:'var(--text-body)',lineHeight:1.5,flex:1}}>{n.text}</div>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'9px',color:'var(--text-faint)',whiteSpace:'nowrap',flexShrink:0,marginTop:'2px'}}>{n.time}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="notif-empty">No notifications yet</div>
          )}`
);

const ok1 = c.includes('setNotifs');
const ok2 = c.includes('markAllRead');
const ok3 = c.includes('unreadCount > 0');
const ok4 = c.includes('fmtAgo');
console.log('notifs state:', ok1 ? 'OK' : 'MISSING');
console.log('markAllRead:', ok2 ? 'OK' : 'MISSING');
console.log('unread dot:', ok3 ? 'OK' : 'MISSING');
console.log('fmtAgo:', ok4 ? 'OK' : 'MISSING');

if (ok1 && ok2 && ok3 && ok4) {
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log('dashboard notifications patched');
} else {
  console.log('patch failed');
}
