'use client';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <h3 style={{ margin: '16px 0', color: '#D03030' }}>Terjadi Kesalahan</h3>
          <p style={{ color: '#7A6856', marginBottom: 16, fontSize: 14 }}>{this.state.error?.message || 'Silakan coba refresh halaman'}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="btn-primary">Refresh Halaman</button>
        </div>
      );
    }
    return this.props.children;
  }
}