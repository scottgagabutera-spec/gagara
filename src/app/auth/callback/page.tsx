'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const accountType = localStorage.getItem('gagara_account_type') || 'individual';
        localStorage.removeItem('gagara_account_type');

        // Always upsert — covers both new users and the case where
        // the DB trigger created the profile before callback ran
        await supabase.from('profiles').upsert({
          id:           session.user.id,
          name:         session.user.user_metadata?.full_name
                        || session.user.email?.split('@')[0]
                        || 'User',
          account_type: accountType,
          avatar_color: '#5B4FE8',
        }, {
          onConflict: 'id',
          ignoreDuplicates: false, // always update account_type
        });

        const redirectTo = localStorage.getItem('gagara_redirect') || '/dashboard';
        localStorage.removeItem('gagara_redirect');
        router.push(redirectTo);
      } else {
        router.push('/sign-in');
      }
    };

    handle();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh', background: '#07070A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '36px', height: '36px',
          border: '2px solid rgba(245,245,247,0.08)',
          borderTopColor: '#7B70F0', borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(245,245,247,0.38)', fontSize: '13px', letterSpacing: '0.02em' }}>
          Signing you in…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
