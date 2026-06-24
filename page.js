'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Flatpickr from 'react-flatpickr';
import DataTable from '@/components/DataTable';
import { SkeletonCard, SkeletonChart } from '@/components/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (dateRange.length === 2) {
      const tglAwal = dateRange[0].toISOString().split('T')[0];
      const tglAkhir = dateRange[1].toISOString().split('T')[0];
      fetchDashboard(tglAwal, tglAkhir);
    }
  }, [dateRange]);

  const fetchDashboard = async (tglAwal, tglAkhir) => {
    setLoading(true);
    try {
      let url = '/api/dashboard';
      if (tglAwal && tglAkhir) url += `?tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        setOrdersByDay(data.data.ordersByDay || []);
      }
    } catch {} finally { setLoading(false); }
  };

  const chartData = ordersByDay.map(item => ({
    tanggal: item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' }) : '-',
    pesanan: parseInt(item.jumlah),
    pendapatan: parseInt(item.pendapatan),
  }));

  const columns = [
    { key: 'id', label: 'ID', render: (r) => `#${r.id}` },
    { key: 'noMeja', label: 'Meja', render: (r) => r.noMeja || '-' },
    { key: 'tipe', label: 'Tipe', render: (r) => <span className={`badge ${r.tipe === 'dine_in' ? 'badge-info' : 'badge-warning'}`}>{r.tipe}</span> },
    { key: 'total', label: 'Total', render: (r) => `Rp ${parseInt(r.total).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => (
      <span className={`badge ${r.status === 'dibayar' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{r.status}</span>
    )},
    { key: 'kasirNama', label: 'Kasir', render: (r) => r.kasirNama || '-' },
    { key: 'createdAt', label: 'Waktu', render: (r) => <span style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</span> },
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
          <h2 style={{ fontSize: 20 }}>📊 Dashboard</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Flatpickr
            options={{ mode: 'range', dateFormat: 'Y-m-d' }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder="Filter tanggal..."
            className="input-field"
            style={{ width: 240, cursor: 'pointer' }}
          />
          {dateRange.length === 2 && (
            <button onClick={() => { setDateRange([]); fetchDashboard(); }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Reset</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3CD' }}>📋</div>
              <div className="stat-info"><h3>{stats?.totalOrders || 0}</h3><p>Total Pesanan</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D4EDDA' }}>💰</div>
              <div className="stat-info"><h3>Rp {parseInt(stats?.totalRevenue || 0).toLocaleString()}</h3><p>Total Pendapatan</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D1ECF1' }}>🍽️</div>
              <div className="stat-info"><h3>{stats?.totalMenu || 0}</h3><p>Menu Tersedia</p></div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <SkeletonChart /><SkeletonChart />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>Pesanan Harian</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="pesanan" fill="#8B5E3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>Pendapatan Harian</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="pendapatan" stroke="#D4A574" strokeWidth={2} dot={{ fill: '#D4A574', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Pesanan Terbaru</h3>
        <DataTable columns={columns} fetchUrl="/api/orders" pageSize={5} />
      </div>
    </div>
  );
}
