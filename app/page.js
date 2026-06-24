'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import QRScanner from '@/components/QRScanner';
import MenuCard from '@/components/MenuCard';
import Modal from '@/components/Modal';

export default function CustomerPage() {
  const [menu, setMenu] = useState([]);
  const [kategori, setKategori] = useState('semua');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [noMeja, setNoMeja] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) setMenu(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = kategori === 'semua' ? menu : menu.filter(m => m.kategori === kategori);
  const countByKategori = { makanan: menu.filter(m => m.kategori === 'makanan').length, minuman: menu.filter(m => m.kategori === 'minuman').length };

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

  const totalCart = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  const generateQR = async (meja) => {
    try {
      const url = `${window.location.origin}/customer/pesan?meja=${meja}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 240, margin: 2, color: { dark: '#8B5E3C', light: '#FFF8F0' } });
      setQrDataUrl(dataUrl);
      setNoMeja(meja);
      setShowQR(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0' }}>
      {/* Top Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #F0E6DC', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>☕</span>
          <span style={{ color: '#8B5E3C', fontWeight: 700, fontSize: 16 }}>ERIC.CO</span>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setShowScanner(true)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            📷 Scan
          </button>
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: '#FFF8F0', border: '1.5px solid #E8D5C4', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            🛒
            {cart.length > 0 && <span style={{ background: '#FF6B6B', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{cart.reduce((s, c) => s + c.qty, 0)}</span>}
            {cart.length > 0 && <span style={{ color: '#8B5E3C', fontWeight: 700, fontSize: 13 }}>Rp {totalCart.toLocaleString()}</span>}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 80px' }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { key: 'semua', label: 'Semua', icon: '📋', count: menu.length },
            { key: 'makanan', label: 'Makanan', icon: '🍽️', count: countByKategori.makanan },
            { key: 'minuman', label: 'Minuman', icon: '☕', count: countByKategori.minuman },
          ].map(k => (
            <button key={k.key} onClick={() => setKategori(k.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 12,
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                background: kategori === k.key ? '#8B5E3C' : '#F5E6CC',
                color: kategori === k.key ? 'white' : '#7A6856',
                transition: 'all 0.2s ease',
              }}>
              <span>{k.icon}</span> {k.label}
              <span style={{
                background: kategori === k.key ? 'rgba(255,255,255,0.2)' : 'rgba(139,94,60,0.1)',
                padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700
              }}>{k.count}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 160, background: '#F0E6DC', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: 16 }}><div style={{ height: 14, width: '60%', background: '#F0E6DC', borderRadius: 4, marginBottom: 8 }} /><div style={{ height: 12, width: '40%', background: '#F0E6DC', borderRadius: 4 }} /></div>
              </div>
            ))}
          </div>
        ) : filteredMenu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#7A6856' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Tidak ada menu</p>
            <p style={{ fontSize: 14 }}>Coba pilih kategori lain</p>
          </div>
        ) : (
          <div className="menu-grid animate__animated animate__fadeIn">
            {filteredMenu.map(item => (
              <MenuCard key={item.id} item={item} onClick={addToCart} />
            ))}
          </div>
        )}

        {/* QR Section */}
        <div className="card" style={{ marginTop: 40, textAlign: 'center', padding: '24px 32px' }}>
          <h3 style={{ marginBottom: 8, color: '#3D2B1F', fontSize: 18 }}>📲 Pesan Lewat QR Code</h3>
          <p style={{ color: '#7A6856', fontSize: 14, marginBottom: 16 }}>Generate QR Code untuk setiap meja atau scan QR yang tersedia</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            {[1, 2, 3, 4, 5, 6].map(meja => (
              <button key={meja} onClick={() => generateQR(meja)}
                style={{
                  width: 48, height: 48, borderRadius: 12, border: '2px solid #E8D5C4', cursor: 'pointer',
                  background: noMeja === meja.toString() ? '#8B5E3C' : 'white',
                  color: noMeja === meja.toString() ? 'white' : '#8B5E3C',
                  fontWeight: 700, fontSize: 16, transition: 'all 0.2s ease',
                }}>
                {meja}
              </button>
            ))}
          </div>
          <button onClick={() => setShowScanner(true)} className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
            📷 Scan QR Meja
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Modal show={showQR && qrDataUrl} onClose={() => setShowQR(false)}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 4 }}>QR Code Meja {noMeja}</h3>
          <p style={{ color: '#7A6856', fontSize: 13, marginBottom: 16 }}>Arahkan kamera ke QR ini untuk memesan</p>
          <img src={qrDataUrl} alt="QR Code" style={{ margin: '0 auto 16px', display: 'block', borderRadius: 12 }} />
          <Link href={`/customer/pesan?meja=${noMeja}`}>
              <button className="btn-primary" style={{ width: '100%', marginBottom: 8 }}>Pesan Langsung</button>
          </Link>
          <button className="btn-secondary" onClick={() => setShowQR(false)} style={{ width: '100%' }}>Tutup</button>
        </div>
      </Modal>

      {/* Scanner Modal */}
      <Modal show={showScanner} onClose={() => setShowScanner(false)} maxWidth="440px">
        <h3 style={{ marginBottom: 16, textAlign: 'center' }}>📷 Scan QR Meja</h3>
        <QRScanner onScan={(url) => { setShowScanner(false); window.location.href = url; }} onClose={() => setShowScanner(false)} />
        <button className="btn-secondary" onClick={() => setShowScanner(false)} style={{ width: '100%', marginTop: 12 }}>Tutup</button>
      </Modal>

      {/* Cart Modal */}
      <Modal show={showCart} onClose={() => setShowCart(false)} maxWidth="420px">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>🛒 Keranjang</h3>
          {cart.length > 0 && <span style={{ fontSize: 13, color: '#7A6856' }}>{cart.reduce((s, c) => s + c.qty, 0)} item</span>}
        </div>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#7A6856' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
            <p style={{ fontWeight: 600 }}>Keranjang kosong</p>
            <p style={{ fontSize: 13 }}>Klik menu untuk menambah</p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: 320, overflowY: 'auto', margin: '0 -8px', padding: '0 8px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0E6DC' }}>
                  <img src={item.gambar || `/images/menu/${item.kategori === 'makanan' ? 'nasi-goreng' : 'kopi-hitam'}.svg`}
                    alt={item.nama} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.nama}</div>
                    <div style={{ fontSize: 13, color: '#8B5E3C', fontWeight: 700 }}>Rp {parseInt(item.harga).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: '#FF6B6B', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: '#6BCB77', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid #E8D5C4', marginTop: 8, fontSize: 18, fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: '#8B5E3C' }}>Rp {totalCart.toLocaleString()}</span>
            </div>
            <Link href={`/customer/pesan?items=${encodeURIComponent(JSON.stringify(cart.map(c => ({ menu_id: c.id, qty: c.qty, nama: c.nama, harga: c.harga }))))}`}
              style={{ textDecoration: 'none', display: 'block' }}>
              <button className="btn-primary" style={{ width: '100%', padding: 12 }} disabled={cart.length === 0}>
                🚀 Pesan Sekarang
              </button>
            </Link>
          </>
        )}
        <button className="btn-secondary" onClick={() => setShowCart(false)} style={{ width: '100%', marginTop: 8 }}>Tutup</button>
      </Modal>
    </div>
  );
}
