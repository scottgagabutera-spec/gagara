const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// Remove the extra closing div that broke the build
const old = `            </div>
            </div>{/* end desktop vault-cols wrapper */}

            <div className="audit"`;

const fix = `            </div>
            {/* end desktop vault-cols */}

            <div className="audit"`;

if (c.includes(old)) {
  c = c.replace(old, fix);
  console.log('extra div removed: OK');
} else {
  console.log('pattern not found — checking alternate...');
  // Try alternate pattern
  const alt = `</div>
            </div>{/* end desktop vault-cols wrapper */}`;
  if (c.includes(alt)) {
    c = c.replace(alt, `</div>`);
    console.log('alternate fix: OK');
  } else {
    console.log('ERROR: could not find pattern. Paste the output of:');
    console.log('grep -n "vault-cols wrapper\\|end desktop" src/app/page.tsx');
    process.exit(1);
  }
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Build error fixed.');
