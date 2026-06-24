'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { SkeletonTable } from './Skeleton';

export default function DataTable({
  columns, fetchUrl, pageSize = 10, searchField,
  onRowClick, emptyMessage = 'Tidak ada data',
}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const separator = fetchUrl.includes('?') ? '&' : '?';
      let url = `${fetchUrl}${separator}page=${page}&limit=${pageSize}`;
      if (sort) url += `&sort=${sort.field}&dir=${sort.dir}`;
      if (search && searchField) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setTotal(json.pagination?.total || json.data.length);
      } else {
        setError(json.message || 'Gagal memuat data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, page, pageSize, sort, search, searchField]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSort = (field) => {
    setSort(prev => prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' });
    setPage(1);
  };

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', background: '#FFF0F0', borderRadius: 12, border: '1px solid #FFD0D0' }}>
        <p style={{ color: '#D03030', fontSize: 14 }}>⚠️ {error}</p>
        <button onClick={fetchData} className="btn-secondary" style={{ marginTop: 12, padding: '6px 16px', fontSize: 13 }}>Coba Lagi</button>
      </div>
    );
  }

  return (
    <div>
      {searchField && (
        <div style={{ marginBottom: 16 }}>
          <input
            className="input-field" placeholder={`Cari ${searchField}...`}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 300, padding: '8px 14px', fontSize: 13 }}
          />
        </div>
      )}
      <div className="table-container">
        {loading ? <SkeletonTable rows={pageSize > 10 ? 5 : pageSize} cols={columns.length} />
        : data.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#7A6856', fontSize: 14 }}>{emptyMessage}</div>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : {}}>
                    {col.label} {sort?.field === col.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: 'pointer' } : {}}>
                  {columns.map(col => (
                    <td key={col.key} style={col.style}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#7A6856' }}>
            Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} dari {total}
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, opacity: page <= 1 ? 0.5 : 1 }}>← Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid #E8D5C4',
                    background: page === pageNum ? '#8B5E3C' : 'white',
                    color: page === pageNum ? 'white' : '#3D2B1F', cursor: 'pointer', fontSize: 12,
                  }}>{pageNum}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, opacity: page >= totalPages ? 0.5 : 1 }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
