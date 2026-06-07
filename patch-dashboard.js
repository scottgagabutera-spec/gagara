const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Make user-card a link to /profile
c = c.replace(
  `<div className="user-card">`,
  `<a href="/profile" className="user-card" style={{textDecoration:'none'}}>`
);
c = c.replace(
  `</div>\n            <button className="sign-out-btn"`,
  `</a>\n            <button className="sign-out-btn"`
);

// Add hover style to user-card
c = c.replace(
  `.user-card { display:flex; align-items:center; gap:10px; padding:10px; border-radius:var(--r-md); margin-bottom:8px; }`,
  `.user-card { display:flex; align-items:center; gap:10px; padding:10px; border-radius:var(--r-md); margin-bottom:8px; transition:background 0.15s; cursor:pointer; } .user-card:hover { background:var(--surface2); }`
);

const ok1 = c.includes('href="/profile"');
const ok2 = c.includes('user-card:hover');
console.log('profile link:', ok1 ? 'OK' : 'MISSING');
console.log('hover style:', ok2 ? 'OK' : 'MISSING');

if (ok1) {
  fs.writeFileSync('src/app/dashboard/page.tsx', c);
  console.log('dashboard patched');
} else {
  console.log('patch failed — check manually');
}
