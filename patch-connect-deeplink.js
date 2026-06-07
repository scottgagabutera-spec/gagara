const fs = require('fs');
let c = fs.readFileSync('src/app/connect/page.tsx', 'utf8');

// After session check useEffect, add URL code reader
c = c.replace(
  `  // Get current session (optional — not required to view, required to accept)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        supabase
          .from('profiles')
          .select('handle, name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserHandle(data.handle || data.name);
          });
      }
    });`,
  `  // Read code from URL on load (handles redirect back after sign in)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      const formatted = urlCode.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{3})(.{4})(.{4})$/, '$1-$2-$3');
      setCode(formatted);
      // Auto-lookup if code looks complete
      if (formatted.length === 12) {
        setTimeout(() => {
          setStage('loading');
        }, 300);
      }
    }
  }, []);

  // Get current session (optional — not required to view, required to accept)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        supabase
          .from('profiles')
          .select('handle, name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserHandle(data.handle || data.name);
          });
      }
    });`
);

// The auto-lookup needs to trigger the real lookup function
// Replace the setTimeout stage change with actual lookup trigger
// We need to use a ref pattern — simpler: just auto-trigger lookup when code+stage align
// Add a useEffect that watches for code being set and stage being loading
c = c.replace(
  `  // Read code from URL on load (handles redirect back after sign in)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      const formatted = urlCode.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{3})(.{4})(.{4})$/, '$1-$2-$3');
      setCode(formatted);
      // Auto-lookup if code looks complete
      if (formatted.length === 12) {
        setTimeout(() => {
          setStage('loading');
        }, 300);
      }
    }
  }, []);`,
  `  // Read code from URL on load (handles redirect back after sign in)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      const formatted = urlCode.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{3})(.{4})(.{4})$/, '$1-$2-$3');
      setCode(formatted);
    }
  }, []);`
);

// Now add a useEffect that auto-looks up when code is set from URL
c = c.replace(
  `  const formatCode = (raw: string) => {`,
  `  // Auto-lookup when code arrives from URL redirect
  useEffect(() => {
    if (code.length === 12 && stage === 'entry') {
      lookup();
    }
  }, [code]);

  const formatCode = (raw: string) => {`
);

const ok1 = c.includes('urlCode = params.get');
const ok2 = c.includes('Auto-lookup when code arrives');
console.log('url code reader:', ok1 ? 'OK' : 'MISSING');
console.log('auto lookup:', ok2 ? 'OK' : 'MISSING');

if (ok1 && ok2) {
  fs.writeFileSync('src/app/connect/page.tsx', c);
  console.log('connect deeplink patched');
} else {
  console.log('patch failed');
}
