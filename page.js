'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    document.title = 'ERIC.CO - Premium Cafe Experience';
    fetch('/api/menu').then(r => r.json()).then(d => {
      if (d.success) setMenu(d.data.slice(0, 4));
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F0' }}>
      <nav style={{ background: 'rgba(26,15,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, color: '#C9975E' }}>☕</span>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>ERIC.CO</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/customer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Menu</Link>
            <Link href="/customer" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', fontSize: 13, background: '#C9975E', color: '#1A0F0A' }}>Pesan Sekarang</Link>
            <Link href="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '10px 24px', fontSize: 13, color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.15)' }}>Masuk</Link>
          </div>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #1A0F0A 0%, #2C1810 40%, #4A3424 100%)', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,151,94,0.08) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative' }}>
          <div className="animate__animated animate__fadeInLeft">
            <span style={{ background: 'rgba(201,151,94,0.15)', color: '#C9975E', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>PREMIUM CAFE EXPERIENCE</span>
            <h1 style={{ fontSize: 56, color: 'white', margin: '24px 0 20px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px' }}>
              Where Every Sip <br/><span style={{ color: '#C9975E' }}>Tells a Story</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              Pesan makanan dan minuman favorit Anda secara digital. Cepat, mudah, dan nyaman. Tersedia Dine In dan Take Away.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/customer" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 36px', fontSize: 15, background: '#C9975E', color: '#1A0F0A', borderRadius: 12, fontWeight: 700 }}>
                🍽️ Lihat Menu
              </Link>
              <Link href="/customer?scan=1" className="btn-outline" style={{ textDecoration: 'none', padding: '16px 36px', fontSize: 15, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12 }}>
                📷 Scan QR
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div><strong style={{ fontSize: 28, color: '#C9975E', display: 'block', letterSpacing: '-1px' }}>12+</strong><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Menu Variasi</span></div>
              <div><strong style={{ fontSize: 28, color: '#C9975E', display: 'block', letterSpacing: '-1px' }}>100+</strong><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Pelanggan</span></div>
              <div><strong style={{ fontSize: 28, color: '#C9975E', display: 'block', letterSpacing: '-1px' }}>5★</strong><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Rating</span></div>
            </div>
          </div>
          <div className="animate__animated animate__fadeInRight" style={{ position: 'relative' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(201,151,94,0.1) 0%, rgba(201,151,94,0.05) 100%)', borderRadius: 24, padding: 48, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', border: '1px solid rgba(201,151,94,0.15)' }}>
              <span style={{ fontSize: 72 }}>☕</span>
              <span style={{ fontSize: 72 }}>🍚</span>
              <span style={{ fontSize: 72 }}>🥐</span>
              <span style={{ fontSize: 72 }}>🍜</span>
            </div>
            <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#C9975E', borderRadius: 16, padding: '16px 24px', color: '#1A0F0A', fontWeight: 700, fontSize: 14, boxShadow: '0 8px 32px rgba(201,151,94,0.3)' }}>
              ⚡ Pesan Online Saja!
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: '#C9975E', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Mengapa ERIC.CO</span>
          <h2 style={{ fontSize: 36, color: '#1A0F0A', marginTop: 12, fontWeight: 800, letterSpacing: '-1px' }}>
            The Perfect <span style={{ color: '#C9975E' }}>Experience</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: '🍽️', title: 'Pesan Mudah', desc: 'Lihat menu lengkap dengan gambar dan pesan langsung dari meja Anda.', color: 'rgba(201,151,94,0.1)' },
            { icon: '💳', title: 'Bayar Fleksibel', desc: 'Tunai atau non-tunai, hitung kembalian otomatis.', color: 'rgba(76,175,80,0.1)' },
            { icon: '📊', title: 'Dashboard Real-time', desc: 'Pantau penjualan dengan grafik interaktif dan filter tanggal.', color: 'rgba(66,165,245,0.1)' },
            { icon: '📱', title: 'QR Code Meja', desc: 'Scan QR Code meja untuk pesan tanpa antri.', color: 'rgba(255,167,38,0.1)' },
            { icon: '🔐', title: 'Aman & Terpercaya', desc: 'Login aman dengan enkripsi bcrypt untuk setiap role.', color: 'rgba(201,151,94,0.1)' },
            { icon: '🖨️', title: 'Cetak Katalog', desc: 'Cetak katalog menu kapan saja dengan satu klik.', color: 'rgba(201,151,94,0.1)' },
          ].map((item, i) => (
            <div key={i} className="card animate__animated animate__fadeInUp" style={{ textAlign: 'center', padding: 36, animationDelay: `${i * 0.08}s`, border: '1px solid var(--border)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>{item.icon}</div>
              <h3 style={{ color: '#1A0F0A', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: '#7A6B5F', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {menu.length > 0 && (
        <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <span style={{ color: '#C9975E', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Menu Pilihan</span>
              <h2 style={{ fontSize: 28, color: '#1A0F0A', fontWeight: 800, letterSpacing: '-0.5px' }}>Signature <span style={{ color: '#C9975E' }}>Dishes</span></h2>
            </div>
            <Link href="/customer" style={{ color: '#C9975E', textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
              Lihat Semua →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {menu.map(item => (
              <Link key={item.id} href="/customer" style={{ textDecoration: 'none' }}>
                <div className="menu-card">
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={item.gambar || ''} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 18 }}>
                    <span style={{ fontSize: 10, color: '#C9975E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>{item.kategori}</span>
                    <h3 style={{ color: '#1A0F0A', margin: '6px 0 4px', fontSize: 17, fontWeight: 700 }}>{item.nama}</h3>
                    <div style={{ color: '#C9975E', fontWeight: 700, fontSize: 18 }}>Rp {parseInt(item.harga).toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ background: 'linear-gradient(135deg, #1A0F0A 0%, #2C1810 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <span style={{ color: '#C9975E', fontSize: 48, display: 'block', marginBottom: 16 }}>☕</span>
          <h2 style={{ color: 'white', fontSize: 36, fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>Siap Memesan?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Klik tombol di bawah untuk melihat menu lengkap dan mulai pesan sekarang!
          </p>
          <Link href="/customer" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 44px', fontSize: 16, background: '#C9975E', color: '#1A0F0A', borderRadius: 12, fontWeight: 700 }}>
            🚀 Mulai Pesan
          </Link>
        </div>
      </section>

      <footer style={{ background: '#1A0F0A', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ color: '#C9975E', fontSize: 20 }}>☕</span>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>ERIC.CO</h3>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)' }}>Aplikasi manajemen cafe modern untuk pemesanan digital, pembayaran, dan laporan real-time.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Fitur</h4>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,0.4)' }}>
              <span>Pesan Online</span>
              <span>QR Code Meja</span>
              <span>Dashboard</span>
              <span>Cetak Katalog</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Kontak</h4>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,0.4)' }}>
              <span>📧 info@eric.co.id</span>
              <span>📞 (021) 1234-5678</span>
              <span>📍 Jakarta, Indonesia</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Jam Operasional</h4>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
              <span>Senin - Jumat: 08:00 - 22:00</span>
              <span>Sabtu: 09:00 - 23:00</span>
              <span>Minggu: 10:00 - 21:00</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © 2026 ERIC.CO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}