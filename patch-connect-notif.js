const fs = require('fs');
let c = fs.readFileSync('src/app/connect/page.tsx', 'utf8');

// After deal accept update, notify the creator
c = c.replace(
  `      const { error: updateError } = await supabase
        .from('deals')
        .update({
          [updateField]: userId,
          status: 'active',
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;

      setStage('accepted');`,
  `      const { error: updateError } = await supabase
        .from('deals')
        .update({
          [updateField]: userId,
          status: 'active',
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;

      // Notify the creator
      const creatorId = deal.payer_id && deal.payer_id !== userId
        ? deal.payer_id
        : deal.receiver_id && deal.receiver_id !== userId
        ? deal.receiver_id
        : null;

      if (creatorId) {
        await supabase.from('notifications').insert({
          user_id:   creatorId,
          deal_id:   deal.id,
          deal_code: deal.code,
          text:      \`Someone accepted your deal \${deal.code} — both parties are now connected\`,
          urgent:    false,
        });
      }

      setStage('accepted');`
);

const ok = c.includes('Someone accepted your deal');
console.log('connect notif:', ok ? 'OK' : 'MISSING');

if (ok) {
  fs.writeFileSync('src/app/connect/page.tsx', c);
  console.log('connect notifications patched');
} else {
  console.log('patch failed');
}
