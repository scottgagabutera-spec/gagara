const fs = require('fs');
let c = fs.readFileSync('src/app/new-deal/page.tsx', 'utf8');

// Replace canNext step 2 validation to include amount limits
c = c.replace(
  `if (step === 2) return !!deal.amount && !!deal.description;`,
  `if (step === 2) {
      if (!deal.amount || !deal.description) return false;
      const amt = parseFloat(deal.amount);
      if (deal.mode === 'personal'   && (amt < 1      || amt > 2000))  return false;
      if (deal.mode === 'business'   && (amt < 200    || amt > 50000)) return false;
      if (deal.mode === 'enterprise' && amt < 10000)                   return false;
      return true;
    }`
);

// Replace mode hint to show error when out of range
c = c.replace(
  `{deal.mode && <div className="mode-hint"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{deal.mode.charAt(0).toUpperCase()+deal.mode.slice(1)} mode limit: {modeLimit}</div>}`,
  `{deal.mode && (() => {
                    const amt = parseFloat(deal.amount || '0');
                    const outOfRange =
                      (deal.mode === 'personal'   && deal.amount && (amt < 1      || amt > 2000))  ||
                      (deal.mode === 'business'   && deal.amount && (amt < 200    || amt > 50000)) ||
                      (deal.mode === 'enterprise' && deal.amount && amt < 10000);
                    return (
                      <div className="mode-hint" style={{background: outOfRange ? 'rgba(224,82,82,0.08)' : undefined, borderColor: outOfRange ? 'rgba(224,82,82,0.2)' : undefined, color: outOfRange ? 'var(--red)' : undefined}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {outOfRange ? \`Amount out of range for \${deal.mode} mode — limit is \${modeLimit}\` : \`\${deal.mode.charAt(0).toUpperCase()+deal.mode.slice(1)} mode limit: \${modeLimit}\`}
                      </div>
                    );
                  })()}`
);

const ok1 = c.includes('amt < 1');
const ok2 = c.includes('outOfRange');
console.log('amount validation:', ok1 ? 'OK' : 'MISSING');
console.log('inline error hint:', ok2 ? 'OK' : 'MISSING');

if (ok1 && ok2) {
  fs.writeFileSync('src/app/new-deal/page.tsx', c);
  console.log('new-deal patched successfully');
} else {
  console.log('patch failed — file not changed');
}
