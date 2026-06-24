export default function MenuCard({ item, onClick, compact }) {
  const size = compact ? { height: 100, bodyPadding: 10, titleSize: 13, priceSize: 13 } : { height: 180, bodyPadding: 16, titleSize: 16, priceSize: 15 };

  return (
    <div className="menu-card" onClick={() => onClick?.(item)}>
      <div style={{ height: size.height, overflow: 'hidden' }}>
        <img src={item.gambar || `/images/menu/${item.kategori === 'makanan' ? 'nasi-goreng' : 'kopi-hitam'}.svg`}
          alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="menu-card-body" style={{ padding: size.bodyPadding }}>
        <h3 style={{ fontSize: size.titleSize, margin: '0 0 4px' }}>{item.nama}</h3>
        <p style={{ fontSize: 13, color: '#7A6856', margin: '4px 0', display: compact ? 'none' : 'block' }}>{item.deskripsi}</p>
        <div className="harga" style={{ fontSize: size.priceSize }}>Rp {parseInt(item.harga).toLocaleString()}</div>
        {item.status === 'habis' && <span className="badge badge-danger" style={{ marginTop: 4 }}>Habis</span>}
      </div>
    </div>
  );
}
