'use client';

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {Array(cols).fill(0).map((_, i) => (
              <th key={i}><div className="skeleton" style={{ height: 16, width: '60%' }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, r) => (
            <tr key={r}>
              {Array(cols).fill(0).map((_, c) => (
                <td key={c}><div className="skeleton" style={{ height: 14, width: `${40 + Math.random() * 40}%` }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: 18, width: 160, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 250, width: '100%' }} />
    </div>
  );
}

export function SkeletonMenuGrid({ count = 6 }) {
  return (
    <div className="menu-grid">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="menu-card">
          <div className="skeleton" style={{ height: 180, width: '100%', borderRadius: 0 }} />
          <div className="menu-card-body">
            <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
