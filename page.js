'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DataTable from '@/components/DataTable';
import { SkeletonCard } from '@/components/Skeleton';

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [metode, setMetode] = useState('tunai');
  const [metodeNonTunai, setMetodeNonTunai] = useState('');
  const [jumlahBayar, setJumlahBayar] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) selectOrder(orderId);
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?status=pending');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {}
  };

  const selectOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setOrderItems(data.data.items || []);
        setJumlahBayar(data.data.total);
        setMessage('');
      }
    } catch {}
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;
    if (metode === 'non_tunai' && !metodeNonTunai) { setMessage('Pilih metode Non Tunai (QRIS/kartu debit/dll)'); return; }
    setLoading(true);
    setMessage('');
    const metodeFinal = metode === 'non_tunai' ? metodeNonTunai : 'tunai';
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: selectedOrder.id, metode: metodeFinal, jumlah_bayar: parseFloat(jumlahBayar) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Pembayaran berhasil!`);
        setReceiptData(data.data);
        setShowReceipt(true);
        fetchOrders();
      } else { setMessage(`❌ ${data.message}`); }
    } catch { setMessage('❌ Gagal memproses pembayaran'); }
    finally { setLoading(false); }
  };

  const kembalian = jumlahBayar && selectedOrder ? parseFloat(jumlahBayar) - parseFloat(selectedOrder.total) : 0;

  const columns = [
    { key: 'id', label: 'ID', render: (r) => `#${r.id}` },
    { key: 'tipe', label: 'Tipe', render: (r) => <span className={`badge ${r.tipe === 'dine_in' ? 'badge-info' : 'badge-warning'}`}>{r.tipe}</span> },
    { key: 'total', label: 'Total', render: (r) => `Rp ${parseInt(r.total).toLocaleString()}` },
    { key: 'createdAt', label: 'Waktu', render: (r) => <span style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</span> },
    { key: 'aksi', label: 'Aksi', render: (r) => (
      <button onClick={() => selectOrder(r.id)} className="btn-primary" style={{ padding: '4px 12px', fontSize: 12 }}>Pilih</button>
    )},
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
        <h2 style={{ fontSize: 20 }}>💳 Pembayaran</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Pesanan Perlu Dibayar</h3>
          <DataTable columns={columns} fetchUrl="/api/orders?status=pending" pageSize={10}
            emptyMessage="Tidak ada pesanan pending"
            onRowClick={(row) => selectOrder(row.id)} />
        </div>

        <div>
          {selectedOrder ? (
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>Detail Pesanan #{selectedOrder.id}</h3>
              <div style={{ marginBottom: 12, fontSize: 14 }}>
                <span className={`badge ${selectedOrder.tipe === 'dine_in' ? 'badge-info' : 'badge-warning'}`}>
                  {selectedOrder.tipe === 'dine_in' ? `Dine In - Meja ${selectedOrder.noMeja || '-'}` : 'Take Away'}
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                {orderItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F0E6DC', fontSize: 14 }}>
                    <span>{item.menuNama} x{item.qty}</span>
                    <span>Rp {parseInt(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, fontSize: 18 }}>
                  <span>Total</span>
                  <span style={{ color: '#8B5E3C' }}>Rp {parseInt(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Metode Pembayaran</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => { setMetode('tunai'); setMetodeNonTunai(''); }} className={metode === 'tunai' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 20px', fontSize: 14, flex: 1 }}>💵 Tunai</button>
                  <button onClick={() => setMetode('non_tunai')} className={metode === 'non_tunai' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 20px', fontSize: 14, flex: 1 }}>💳 Non Tunai</button>
                </div>
                {metode === 'non_tunai' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {[
                      { key: 'qris', label: 'QRIS', icon: '📱' },
                      { key: 'kartu_debit', label: 'Kartu Debit', icon: '💳' },
                      { key: 'gopay', label: 'GoPay', icon: '🟢' },
                      { key: 'ovo', label: 'OVO', icon: '🟣' },
                      { key: 'dana', label: 'DANA', icon: '🔵' },
                    ].map(sub => (
                      <button key={sub.key} onClick={() => setMetodeNonTunai(sub.key)}
                        className={metodeNonTunai === sub.key ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '6px 14px', fontSize: 12 }}>
                        {sub.icon} {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {metode === 'tunai' ? (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Jumlah Bayar</label>
                  <input type="number" className="input-field" value={jumlahBayar} onChange={(e) => setJumlahBayar(e.target.value)} min={selectedOrder.total} />
                  {jumlahBayar >= selectedOrder.total && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: '#D4EDDA', borderRadius: 8, fontSize: 14 }}>
                      Kembalian: <strong>Rp {parseInt(kembalian).toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 16, padding: '8px 12px', background: '#E3F2FD', borderRadius: 8, fontSize: 14 }}>
                  Bayar: <strong>Rp {parseInt(selectedOrder.total).toLocaleString()}</strong> (otomatis)
                </div>
              )}
              {message && (
                <div style={{ marginBottom: 12, padding: 8, borderRadius: 6, background: message.includes('✅') ? '#D4EDDA' : '#F8D7DA', color: message.includes('✅') ? '#155724' : '#721C24', fontSize: 13 }}>
                  {message}
                </div>
              )}
              <button onClick={handlePayment} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Memproses...' : `Bayar Rp ${parseInt(selectedOrder.total).toLocaleString()}`}
              </button>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: '#7A6856' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>💳</p>
              <p>Pilih pesanan untuk diproses pembayarannya</p>
            </div>
          )}
        </div>
      </div>

      {showReceipt && receiptData && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🧾</div>
              <h3>Pembayaran Berhasil</h3>
              <p style={{ color: '#7A6856', fontSize: 13 }}>ERIC.CO</p>
            </div>
            <div style={{ borderTop: '2px dashed #E8D5C4', borderBottom: '2px dashed #E8D5C4', padding: '16px 0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Total</span>
                <span style={{ fontWeight: 700 }}>Rp {parseInt(receiptData.total).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Bayar</span>
                <span>Rp {parseInt(receiptData.jumlah_bayar).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6BCB77', fontWeight: 700 }}>
                <span>Kembalian</span>
                <span>Rp {parseInt(receiptData.kembalian).toLocaleString()}</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#7A6856', fontSize: 12 }}>Terima kasih telah berbelanja!</p>
            <button className="btn-secondary" onClick={() => { setShowReceipt(false); setSelectedOrder(null); setOrderItems([]); }} style={{ width: '100%', marginTop: 12 }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
