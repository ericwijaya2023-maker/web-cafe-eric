'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/DataTable';
import { SkeletonCard } from '@/components/Skeleton';

export default function KasirDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => {
      if (d.success) setStats(d.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'noMeja', label: 'Meja', render: (r) => `#${r.id} ${r.noMeja ? `(Meja ${r.noMeja})` : ''}` },
    { key: 'tipe', label: 'Tipe', render: (r) => (
      <span className={`badge ${r.tipe === 'dine_in' ? 'badge-info' : 'badge-warning'}`}>{r.tipe === 'dine_in' ? 'Dine In' : 'Take Away'}</span>
    )},
    { key: 'total', label: 'Total', render: (r) => `Rp ${parseInt(r.total).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => (
      <span className={`badge ${r.status === 'dibayar' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{r.status}</span>
    )},
    { key: 'createdAt', label: 'Waktu', render: (r) => <span style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</span> },
    { key: 'aksi', label: 'Aksi', render: (r) => (
      <Link href={`/kasir/pembayaran?order_id=${r.id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: 12 }}>Bayar</Link>
    )},
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
        <h2 style={{ fontSize: 20, color: '#3D2B1F' }}>Dashboard Kasir</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/kasir/pesanan" className="btn-primary" style={{ textDecoration: 'none', fontSize: 13 }}>+ Pesanan Baru</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {loading ? (<><SkeletonCard /><SkeletonCard /><SkeletonCard /></>) : (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3CD' }}>📋</div>
              <div className="stat-info"><h3>{stats?.totalOrders || 0}</h3><p>Pesanan Hari Ini</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D4EDDA' }}>💰</div>
              <div className="stat-info"><h3>Rp {parseInt(stats?.totalRevenue || 0).toLocaleString()}</h3><p>Pendapatan</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D1ECF1' }}>🍽️</div>
              <div className="stat-info"><h3>{stats?.totalMenu || 0}</h3><p>Menu Tersedia</p></div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Pesanan Terbaru</h3>
        <DataTable columns={columns} fetchUrl="/api/orders" pageSize={5} emptyMessage="Belum ada pesanan" />
      </div>
    </div>
  );
}
