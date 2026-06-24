'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PesanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState([]);
  const [tipe, setTipe] = useState('dine_in');
  const [noMeja, setNoMeja] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const meja = searchParams.get('meja');
    if (meja) {
      setNoMeja(meja);
      setTipe('dine_in');
    }

    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        setCartItems(JSON.parse(decodeURIComponent(itemsParam)));
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  const total = cartItems.reduce((sum, item) => sum + item.harga * item.qty, 0);

  const removeItem = (menuId) => {
    setCartItems(prev => prev.filter(item => item.menu_id !== menuId));
  };

  const updateQty = (menuId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.menu_id === menuId) {
        const newQty = item.qty + delta;
        return newQty <= 0 ? null : { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      setMessage('Keranjang kosong');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          no_meja: tipe === 'dine_in' ? noMeja : null,
          tipe,
          items: cartItems.map(item => ({ menu_id: item.menu_id, qty: item.qty })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Pesanan #${data.orderId} berhasil - Rp ${parseInt(data.total).toLocaleString()}`);
        setCartItems([]);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Gagal memesan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24, color: '#3D2B1F' }}>Konfirmasi Pesanan</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Tipe Pesanan</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setTipe('dine_in')} className={tipe === 'dine_in' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 20px', fontSize: 14 }}>Dine In</button>
          <button onClick={() => setTipe('take_away')} className={tipe === 'take_away' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 20px', fontSize: 14 }}>Take Away</button>
        </div>
      </div>

      {tipe === 'dine_in' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Nomor Meja</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map(m => (
              <button key={m} onClick={() => setNoMeja(m.toString())} className={noMeja === m.toString() ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px', minWidth: 48 }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Pesanan Kamu</h3>
        {cartItems.length === 0 ? (
          <p style={{ color: '#7A6856', textAlign: 'center', padding: 16 }}>Belum ada item</p>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item.menu_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0E6DC' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.nama}</div>
                  <div style={{ fontSize: 12, color: '#7A6856' }}>Rp {parseInt(item.harga).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(item.menu_id, -1)} style={{ background: '#FF6B6B', color: 'white', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer' }}>-</button>
                  <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.menu_id, 1)} style={{ background: '#6BCB77', color: 'white', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeItem(item.menu_id)} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 18 }}>&times;</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: '#8B5E3C' }}>Rp {total.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {message && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: message.includes('✅') ? '#D4EDDA' : '#F8D7DA', color: message.includes('✅') ? '#155724' : '#721C24', fontSize: 14 }}>
          {message}
        </div>
      )}

      <button onClick={handleOrder} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 14 }} disabled={loading || cartItems.length === 0}>
        {loading ? 'Memproses...' : 'Pesan Sekarang'}
      </button>
    </div>
  );
}

export default function PesanPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #F0E6DC', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/customer" style={{ textDecoration: 'none', color: '#8B5E3C', fontWeight: 700, fontSize: 18 }}>☕ ERIC.CO</Link>
        <Link href="/customer" style={{ color: '#7A6856', textDecoration: 'none', fontSize: 14 }}>&larr; Kembali</Link>
      </div>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: '#7A6856' }}>Loading...</div>}>
        <PesanForm />
      </Suspense>
    </div>
  );
}
