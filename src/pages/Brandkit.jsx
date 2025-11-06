import React from 'react';
import { useLocation } from 'react-router-dom';

export const Brandkit = () => {
  const location = useLocation();
  const data = location.state || {};

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Your Brand Kit</h1>
      <div style={{ color: '#64748b', marginBottom: 20 }}>This is a basic Brand Kit view. You can enhance it later.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Brand Name</div>
          <div>{data.name || '—'}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tagline</div>
          <div>{data.tagline || '—'}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Primary Color</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: data.primaryColor || '#6b8cff', border: '1px solid #e5e7eb' }} />
            <code>{data.primaryColor || '#6b8cff'}</code>
          </div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Secondary Color</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: data.secondaryColor || '#16a34a', border: '1px solid #e5e7eb' }} />
            <code>{data.secondaryColor || '#16a34a'}</code>
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Logo</div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Brand Logo" style={{ maxWidth: 240, borderRadius: 12, border: '1px solid #e5e7eb' }} />
          ) : (
            <div style={{ color: '#94a3b8' }}>No logo provided</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brandkit;


