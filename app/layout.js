import './globals.css';

export const metadata = {
  title: 'ERIC.CO',
  description: 'Aplikasi Manajemen Cafe Modern',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
