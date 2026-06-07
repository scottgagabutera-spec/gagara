const fs = require('fs');
let c = fs.readFileSync('src/app/deal/[id]/page.tsx', 'utf8');

// After milestone update, notify the other party
c = c.replace(
  `    await supabase.from('deals').update({
      milestone_confirms: current,
      audit_log: newAudit,
      status: newStatus,
    }).eq('id', deal.id);`,
  `    await supabase.from('deals').update({
      milestone_confirms: current,
      audit_log: newAudit,
      status: newStatus,
    }).eq('id', deal.id);

    // Notify the other party
    const otherPartyId = myRole === 'payer' ? deal.receiver_id : deal.payer_id;
    if (otherPartyId) {
      const myHandle = myRole === 'payer' ? deal.payer_handle : deal.receiver_handle;
      const notifText = bothDone
        ? \`\${myHandle} confirmed a milestone on \${deal.code} — funds released\`
        : \`\${myHandle} confirmed a milestone on \${deal.code} — your confirmation needed\`;
      await supabase.from('notifications').insert({
        user_id:   otherPartyId,
        deal_id:   deal.id,
        deal_code: deal.code,
        text:      notifText,
        urgent:    !bothDone,
      });
    }`
);

// After condition confirm, notify the other party
c = c.replace(
  `    await supabase.from('deals').update({
      condition_confirms: current,
      audit_log: newAudit,
    }).eq('id', deal.id);`,
  `    await supabase.from('deals').update({
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
        text:      \`\${myHandle2} confirmed a condition on \${deal.code}\`,
        urgent:    false,
      });
    }`
);

// After dispute, notify the other party
c = c.replace(
  `    await supabase.from('deals').update({
      status: 'disputed',
      dispute_reason: disputeText,
      audit_log: newAudit,
    }).eq('id', deal.id);`,
  `    await supabase.from('deals').update({
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
        text:      \`\${myHandle3} raised a dispute on \${deal.code} — funds are frozen\`,
        urgent:    true,
      });
    }`
);

const ok = c.includes('Notify the other party');
console.log('notif inserts:', ok ? 'OK' : 'MISSING');

if (ok) {
  fs.writeFileSync('src/app/deal/[id]/page.tsx', c);
  console.log('deal page notifications patched');
} else {
  console.log('patch failed');
}
