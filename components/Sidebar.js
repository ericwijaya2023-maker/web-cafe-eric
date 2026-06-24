'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const metisMenu = {
  admin: [
    { label: 'Utama', items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
      { href: '/admin/menu', label: 'Kelola Menu', icon: '🍽️' },
      { href: '/admin/laporan', label: 'Laporan', icon: '📈' },
    ]},
  ],
  kasir: [
    { label: 'Utama', items: [
      { href: '/kasir', label: 'Dashboard', icon: '📊' },
    ]},
    { label: 'Transaksi', items: [
      { href: '/kasir/pesanan', label: 'Pesanan', icon: '📋' },
      { href: '/kasir/pembayaran', label: 'Pembayaran', icon: '💳' },
    ]},
  ],
};

export default function Sidebar({ role, user, userLabel }) {
  const pathname = usePathname();
  const router = useRouter();
  const groups = metisMenu[role] || metisMenu.admin;
  const [expanded, setExpanded] = useState(groups.map((_, i) => i === 0));

  const toggleGroup = (idx) => {
    setExpanded(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="sidebar animate__animated animate__fadeInLeft">
      <div className="sidebar-logo">
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>☕ ERIC.CO</h2>
        <p style={{ fontSize: 11, opacity: 0.8 }}>{userLabel}: {user?.nama}</p>
      </div>
      <ul className="metismenu">
        {groups.map((group, gi) => (
          <li key={gi} className="metismenu-group">
            <div className="metismenu-toggle" onClick={() => toggleGroup(gi)}>
              <span>{group.label}</span>
              <span className="metismenu-arrow">{expanded[gi] ? '▾' : '▸'}</span>
            </div>
            <ul className={`metismenu-sub ${expanded[gi] ? 'open' : ''}`}>
              {group.items.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                    <span>{item.icon}</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div style={{
        padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.15)',
        position: 'absolute', bottom: 0, width: '100%',
      }}>
        <button onClick={handleLogout} className="btn-logout">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
