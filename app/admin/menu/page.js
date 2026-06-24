'use client';
import { useState, useEffect, useRef } from 'react';
import DataTable from '@/components/DataTable';

export default function AdminMenuPage() {
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ nama: '', kategori: 'makanan', harga: '', deskripsi: '', gambar: '', status: 'tersedia' });
  const fileRef = useRef(null);

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) setMenu(data.data);
    } catch {}
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ nama: '', kategori: 'makanan', harga: '', deskripsi: '', gambar: '', status: 'tersedia' });
    setShowForm(true);
    setMessage('');
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ nama: item.nama, kategori: item.kategori, harga: item.harga.toString(), deskripsi: item.deskripsi || '', gambar: item.gambar || '', status: item.status });
    setShowForm(true);
    setMessage('');
  };

  const handleSave = async () => {
    if (!form.nama || !form.harga) { setMessage('Nama dan harga wajib diisi'); return; }
    setLoading(true);
    setMessage('');
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
      });
      const data = await res.json();
      setMessage(data.success ? `✅ Menu berhasil ${editing ? 'diupdate' : 'ditambah'}` : `❌ ${data.message}`);
      if (data.success) { setShowForm(false); fetchMenu(); }
    } catch { setMessage('❌ Gagal menyimpan'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setForm({ ...form, gambar: data.url });
      else setMessage('❌ ' + data.message);
    } catch { setMessage('❌ Gagal upload gambar'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch {}
  };

  const handlePrint = async () => {
    let items = menu;
    if (items.length === 0) {
      try {
        const res = await fetch('/api/menu?limit=1000');
        const data = await res.json();
        if (data.success) items = data.data;
      } catch {}
    }
    const baseUrl = window.location.origin;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Katalog Menu - ERIC.CO</title>
      <style>body{font-family:'Segoe UI',sans-serif;padding:40px;color:#3D2B1F}
      h1{text-align:center;color:#8B5E3C;margin-bottom:4px}.sub{text-align:center;color:#7A6856;margin-bottom:32px}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      .card{border:1px solid #E8D5C4;border-radius:8px;padding:16px;page-break-inside:avoid}
      .card h3{margin:0 0 4px;font-size:16px}.card .cat{font-size:12px;color:#7A6856}
      .card img{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px}
      .price{font-size:18px;color:#8B5E3C;font-weight:700;margin-top:8px}
      .footer{text-align:center;margin-top:32px;color:#7A6856;font-size:12px}
      @media print{.no-print{display:none}}</style></head><body>
      <h1>☕ ERIC.CO</h1><p class="sub">Katalog Menu</p><div class="grid">
      ${items.map(item => `
        <div class="card">
          ${item.gambar ? `<img src="${item.gambar.startsWith('http') ? item.gambar : baseUrl + item.gambar}" alt="${item.nama}" />` : '<div style="height:120px;background:#F0E6DC;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:40px">☕</div>'}
          <h3>${item.nama}</h3>
          <div class="cat">${item.kategori}</div>
          <p style="font-size:13px;color:#7A6856;margin:4px 0">${item.deskripsi || ''}</p>
          <div class="price">Rp ${parseInt(item.harga).toLocaleString()}</div>
        </div>`).join('')}
      </div><p class="footer">Dicetak: ${new Date().toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
      <script>window.print();window.close();</script></body></html>`);
    printWindow.document.close();
  };

  const columns = [
    { key: 'gambar', label: 'Gambar', render: (r) => (
      r.gambar ? <img src={r.gambar} alt={r.nama} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
        : <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F0E6DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽️</div>
    )},
    { key: 'nama', label: 'Nama', sortable: true, render: (r) => <span style={{ fontWeight: 600 }}>{r.nama}</span> },
    { key: 'kategori', label: 'Kategori', render: (r) => <span className={`badge ${r.kategori === 'makanan' ? 'badge-info' : 'badge-success'}`}>{r.kategori}</span> },
    { key: 'harga', label: 'Harga', sortable: true, render: (r) => `Rp ${parseInt(r.harga).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => <span className={`badge ${r.status === 'tersedia' ? 'badge-success' : 'badge-danger'}`}>{r.status}</span> },
    { key: 'aksi', label: 'Aksi', render: (r) => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => openEdit(r)} className="btn-primary" style={{ padding: '4px 12px', fontSize: 12 }}>Edit</button>
        <button onClick={() => handleDelete(r.id)} className="btn-danger" style={{ padding: '4px 12px', fontSize: 12 }}>Hapus</button>
      </div>
    )},
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="navbar-top">
        <h2 style={{ fontSize: 20 }}>🍽️ Kelola Menu</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handlePrint} className="btn-secondary" style={{ fontSize: 13 }}>🖨️ Cetak Katalog</button>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13 }}>+ Tambah Menu</button>
        </div>
      </div>

      {message && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: message.includes('✅') ? '#D4EDDA' : '#F8D7DA', color: message.includes('✅') ? '#155724' : '#721C24', fontSize: 14 }}>
          {message}
        </div>
      )}

      <div className="card">
        <DataTable columns={columns} fetchUrl="/api/menu" pageSize={10} searchField="nama" emptyMessage="Belum ada menu" />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit Menu' : 'Tambah Menu'}</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Nama Menu</label>
              <input type="text" className="input-field" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama menu" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Kategori</label>
              <select className="input-field" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                <option value="makanan">Makanan</option><option value="minuman">Minuman</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Harga (Rp)</label>
              <input type="number" className="input-field" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} placeholder="0" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Deskripsi</label>
              <textarea className="input-field" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi menu" rows={3} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Gambar</label>
              <input type="file" ref={fileRef} accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} className="input-field" style={{ padding: 8 }} />
              {uploading && <p style={{ fontSize: 13, color: '#7A6856', marginTop: 4 }}>Mengupload...</p>}
              {form.gambar && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={form.gambar} alt="Preview" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                  <input type="text" className="input-field" value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} placeholder="Atau masukkan URL" style={{ flex: 1 }} />
                </div>
              )}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="tersedia">Tersedia</option><option value="habis">Habis</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Menyimpan...' : (editing ? 'Update' : 'Simpan')}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
