const fs = require('fs');
let c = fs.readFileSync('src/app/new-deal/page.tsx', 'utf8');

// After useState declarations, add localStorage load effect
// Find the line where userId state is declared
c = c.replace(
  `  const [userId,  setUserId]  = useState<string | null>(null);`,
  `  const [userId,  setUserId]  = useState<string | null>(null);

  // Restore saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gagara_newdeal_draft');
      if (saved) {
        const { step: s, deal: d } = JSON.parse(saved);
        if (s && s < 5) { setStep(s); setDeal(d); }
      }
    } catch {}
  }, []);

  // Save progress whenever step or deal changes
  useEffect(() => {
    if (step >= 5) {
      localStorage.removeItem('gagara_newdeal_draft');
    } else {
      try {
        localStorage.setItem('gagara_newdeal_draft', JSON.stringify({ step, deal }));
      } catch {}
    }
  }, [step, deal]);`
);

// Clear draft on successful deal creation (after setCode(newCode))
c = c.replace(
  `        setCode(newCode);
        setStep(s => s + 1);`,
  `        setCode(newCode);
        localStorage.removeItem('gagara_newdeal_draft');
        setStep(s => s + 1);`
);

const ok1 = c.includes('gagara_newdeal_draft');
const ok2 = c.includes('Restore saved progress');
console.log('draft key:', ok1 ? 'OK' : 'MISSING');
console.log('restore effect:', ok2 ? 'OK' : 'MISSING');

if (ok1 && ok2) {
  fs.writeFileSync('src/app/new-deal/page.tsx', c);
  console.log('new-deal persistence patched');
} else {
  console.log('patch failed');
}
