'use client';
import { useEffect, useRef, useState } from 'react';

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner = null;

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        scanner = new Html5Qrcode('qr-reader');
        setScanning(true);

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            scanner.stop();
            setScanning(false);
            onScan?.(decodedText);
          },
          () => {}
        );
      } catch (err) {
        setError('Kamera tidak tersedia atau izin ditolak');
      }
    };

    initScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}></div>
      {scanning && <p style={{ textAlign: 'center', color: '#7A6856', marginTop: 12, fontSize: 14 }}>Arahkan kamera ke QR Code meja...</p>}
      {error && <p style={{ textAlign: 'center', color: '#FF6B6B', marginTop: 12, fontSize: 14 }}>{error}</p>}
    </div>
  );
}
