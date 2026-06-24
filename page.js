'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInput }),
      });
      const data = await res.json();
      if (data.success) {
        const role = data.user.role;
        if (role === 'admin' || role === 'developer') router.push('/admin');
        else if (role === 'kasir') router.push('/kasir');
        else router.push('/');
      } else {
        setError(data.message);
      }
    } catch { setError('Terjadi kesalahan koneksi'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: 'linear-gradient(135deg, #8B5E3C 0%, #A67B5B 50%, #D4A574 100%)',
        padding: 40, display: 'none',
      }} className="login-brand">
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>☕</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>ERIC.CO</h1>
          <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 320, lineHeight: 1.6 }}>
            Sistem manajemen cafe modern. Kelola pesanan, menu, pembayaran, dan laporan dalam satu platform.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FFF8F0', padding: 24 }}>
        <div className="animate__animated animate__fadeIn" style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 8px 32px rgba(139,94,60,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 40 }}>☕</span>
            <h1 style={{ color: '#8B5E3C', fontSize: 24, fontWeight: 800, margin: '8px 0 4px' }}>Selamat Datang</h1>
            <p style={{ color: '#7A6856', fontSize: 14 }}>Masuk untuk mengelola sistem</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#3D2B1F' }}>
                Login ID <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔑</span>
                <input type="text" className="input-field" placeholder="username(!@#$%)password"
                  value={loginInput} onChange={(e) => setLoginInput(e.target.value)} required
                  style={{ paddingLeft: 42, fontSize: 14 }} />
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#7A6856', fontSize: 11 }}>Format: username(!@#$%)password</small>
                <button type="button" onClick={() => setShowHint(!showHint)}
                  style={{ background: 'none', border: 'none', color: '#8B5E3C', cursor: 'pointer', fontSize: 11, fontWeight: 600, textDecoration: 'underline' }}>
                  {showHint ? 'Sembunyikan' : 'Lihat contoh'}
                </button>
              </div>
              {showHint && (
                <div style={{ marginTop: 8, padding: '10px 14px', background: '#FFF8F0', borderRadius: 8, fontSize: 12, color: '#7A6856' }}>
                  <div style={{ fontWeight: 700, color: '#8B5E3C', marginBottom: 4 }}>Contoh Login:</div>
                  <code style={{ display: 'block', padding: '2px 0' }}>admin(!@#$%)password123</code>
                  <code style={{ display: 'block', padding: '2px 0' }}>kasir1(!@#$%)password123</code>
                  <code style={{ display: 'block', padding: '2px 0' }}>developer(!@#$%)password123</code>
                </div>
              )}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#D03030', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={loading}>
              {loading ? <span className="animate__animated animate__spin" style={{ display: 'inline-block' }}>⏳</span> : '🔐'}
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: '#7A6856' }}>
            Sesi akan berakhir otomatis setiap pukul 00:00
          </div>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Link href="/" style={{ color: '#7A6856', textDecoration: 'none', fontSize: 13 }}>← Kembali ke Beranda</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-brand { display: flex !important; }
        }
      `}</style>
    </div>
  );
}