'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KasirPesananPage() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('semua');
  const [cart, setCart] = useState([]);
  const [tipe, setTipe] = useState('dine_in');
  const [noMeja, setNoMeja] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(d => {
      if (d.success) setMenu(d.data);
    }).catch(() => {});
  }, []);

  const filteredMenu = kategori === 'semua' ? menu : menu.filter(m => m.kategori === kategori);

  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(c => c.id === item.id);
      if (exist) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const exist = prev.find(c => c.id === id);
      if (exist.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const totalCart = cart.reduce((sum, item) => sum + (parseFloat(item.harga) * item.qty), 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    if (tipe === 'dine_in' && !noMeja) { setMessage('Pilih nomor meja'); return; }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_meja: tipe === 'dine_in' ? noMeja : null, tipe, items: cart.map(item => ({ menu_id: item.id, qty: item.qty })) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Pesanan #${data.orderId} berhasil - Rp ${parseInt(data.total).toLocaleString()}`);
        setCart([]); setNoMeja('');
      } else { setMessage(`❌ ${data.message}`); }
    } catch { setMessage('❌ Gagal memproses'); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
        <h2 style={{ fontSize: 20 }}>📋 Buat Pesanan</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['semua', 'makanan', 'minuman'].map(k => (
              <button key={k} onClick={() => setKategori(k)} className={kategori === k ? 'btn-primary' : 'btn-secondary'}
                style={{ textTransform: 'capitalize', padding: '6px 16px', fontSize: 13 }}>
                {k} ({k === 'semua' ? menu.length : menu.filter(m => m.kategori === k).length})
              </button>
            ))}
          </div>

          <div className="menu-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {filteredMenu.map(item => (
              <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
                <div className="menu-card-img" style={{ height: 100 }}>
                  <img src={item.gambar || ''} alt={item.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="menu-card-body" style={{ padding: 10 }}>
                  <h3 style={{ fontSize: 13 }}>{item.nama}</h3>
                  <div className="harga" style={{ fontSize: 13 }}>Rp {parseInt(item.harga).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {filteredMenu.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#7A6856' }}>
                Tidak ada menu
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: 24 }}>
          <h3 style={{ marginBottom: 12, fontSize: 16 }}>🛒 Pesanan</h3>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <button onClick={() => setTipe('dine_in')} className={tipe === 'dine_in' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '4px 12px', fontSize: 12, flex: 1 }}>Dine In</button>
              <button onClick={() => setTipe('take_away')} className={tipe === 'take_away' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '4px 12px', fontSize: 12, flex: 1 }}>Take Away</button>
            </div>
            {tipe === 'dine_in' && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6].map(m => (
                  <button key={m} onClick={() => setNoMeja(m.toString())} className={noMeja === m.toString() ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '4px 10px', fontSize: 12 }}>Meja {m}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#7A6856', textAlign: 'center', padding: 16, fontSize: 13 }}>Klik menu untuk menambah</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F0E6DC', fontSize: 13 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.nama}</div>
                    <div style={{ fontSize: 11, color: '#7A6856' }}>Rp {parseInt(item.harga).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: '#FF6B6B', color: 'white', border: 'none', borderRadius: 4, width: 22, height: 22, cursor: 'pointer', fontSize: 12 }}>-</button>
                    <span style={{ fontWeight: 600, width: 16, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ background: '#6BCB77', color: 'white', border: 'none', borderRadius: 4, width: 22, height: 22, cursor: 'pointer', fontSize: 12 }}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '12px 0', borderTop: '2px solid #E8D5C4', marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: '#8B5E3C' }}>Rp {totalCart.toLocaleString()}</span>
              </div>
            </div>
          )}
          {message && (
            <div style={{ marginTop: 8, padding: 8, borderRadius: 6, background: message.includes('✅') ? '#D4EDDA' : '#F8D7DA', color: message.includes('✅') ? '#155724' : '#721C24', fontSize: 12 }}>
              {message}
            </div>
          )}
          <button onClick={handleOrder} className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={loading || cart.length === 0}>
            {loading ? 'Memproses...' : `Pesan - Rp ${totalCart.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
