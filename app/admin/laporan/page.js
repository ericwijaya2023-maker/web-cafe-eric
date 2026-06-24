'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Flatpickr from 'react-flatpickr';
import DataTable from '@/components/DataTable';
import { SkeletonCard, SkeletonChart } from '@/components/Skeleton';

const COLORS = ['#8B5E3C', '#D4A574', '#A67B5B', '#F5E6CC', '#6BCB77', '#FFD93D'];

export default function LaporanPage() {
  const [stats, setStats] = useState(null);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [viewMode, setViewMode] = useState('pesanan');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); fetchPayments(); }, []);

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
      if (data.success) { setStats(data.data); setOrdersByDay(data.data.ordersByDay || []); }
    } catch {} finally { setLoading(false); }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch {}
  };

  const chartData = ordersByDay.map(item => ({
    tanggal: item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' }) : '-',
    pesanan: parseInt(item.jumlah),
    pendapatan: parseInt(item.pendapatan),
  }));

  const metodeLabels = { tunai: 'Tunai', qris: 'QRIS', kartu_debit: 'Kartu Debit', gopay: 'GoPay', ovo: 'OVO', dana: 'DANA' };
  const metodeCount = {};
  payments.forEach(p => { const label = metodeLabels[p.metode] || p.metode; metodeCount[label] = (metodeCount[label] || 0) + 1; });
  const paymentByMethod = Object.entries(metodeCount).map(([name, value]) => ({ name, value }));

  const totalPendapatan = payments.reduce((sum, p) => sum + parseFloat(p.jumlahBayar || 0), 0);

  const paymentColumns = [
    { key: 'id', label: 'ID', render: (r) => `#${r.id}` },
    { key: 'orderId', label: 'Order', render: (r) => `#${r.orderId}` },
    { key: 'metode', label: 'Metode', render: (r) => <span className={`badge ${r.metode === 'tunai' ? 'badge-success' : 'badge-info'}`}>{r.metode}</span> },
    { key: 'total', label: 'Total', render: (r) => `Rp ${parseInt(r.total || 0).toLocaleString()}` },
    { key: 'jumlahBayar', label: 'Bayar', render: (r) => `Rp ${parseInt(r.jumlahBayar).toLocaleString()}` },
    { key: 'kembalian', label: 'Kembalian', render: (r) => `Rp ${parseInt(r.kembalian).toLocaleString()}` },
    { key: 'createdAt', label: 'Waktu', render: (r) => <span style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</span> },
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
        <h2 style={{ fontSize: 20 }}>📈 Laporan</h2>
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
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3CD' }}>📋</div>
              <div className="stat-info"><h3>{stats?.totalOrders || 0}</h3><p>Total Pesanan</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D4EDDA' }}>💰</div>
              <div className="stat-info"><h3>Rp {parseInt(totalPendapatan).toLocaleString()}</h3><p>Total Pendapatan</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D1ECF1' }}>💳</div>
              <div className="stat-info"><h3>{payments.length}</h3><p>Total Transaksi</p></div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'pesanan', label: '📊 Grafik Pesanan' },
          { key: 'pendapatan', label: '💰 Grafik Pendapatan' },
          { key: 'metode', label: '💳 Metode Pembayaran' },
        ].map(btn => (
          <button key={btn.key} onClick={() => setViewMode(btn.key)}
            className={viewMode === btn.key ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 20px', fontSize: 14 }}>
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? <SkeletonChart /> : (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>
            {viewMode === 'pesanan' ? 'Grafik Pesanan Harian' : viewMode === 'pendapatan' ? 'Grafik Pendapatan Harian' : 'Metode Pembayaran'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {viewMode === 'pesanan' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Bar dataKey="pesanan" fill="#8B5E3C" radius={[4, 4, 0, 0]} name="Pesanan" />
              </BarChart>
            ) : viewMode === 'pendapatan' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Bar dataKey="pendapatan" fill="#D4A574" radius={[4, 4, 0, 0]} name="Pendapatan" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={paymentByMethod} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} fill="#8884d8" dataKey="value">
                  {paymentByMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Riwayat Pembayaran</h3>
        <DataTable columns={paymentColumns} fetchUrl="/api/payments" pageSize={10} emptyMessage="Belum ada pembayaran" />
      </div>
    </div>
  );
}
