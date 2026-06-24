'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.success && (d.user.role === 'admin' || d.user.role === 'developer')) setUser(d.user);
      else router.push('/login');
    }).catch(() => router.push('/login'));
  }, []);

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFF8F0' }}>
      <div className="loading-spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
          <Sidebar role={user.role} user={user} userLabel={user.role === 'developer' ? 'Developer' : 'Admin'} />
        </div>
        <div className="main-content">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-toggle no-print"
            style={{ display: 'none', background: '#8B5E3C', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 18, cursor: 'pointer', marginBottom: 12 }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
          {children}
        </div>
        <style>{`
          @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); position: fixed; z-index: 200; transition: transform 0.3s ease; }
            .sidebar.mobile-open { transform: translateX(0); }
            .main-content { margin-left: 0 !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
