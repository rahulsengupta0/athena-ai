import React from 'react';

const ImageLibrary = ({ images = [], onInsertImage, onApplyToShape }) => {
  if (!images.length) return null;

  return (
    <div
      style={{
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: 18,
        padding: 14,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Saved images</div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{images.length}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
          gap: 8,
          maxHeight: 220,
          overflowY: 'auto',
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <button
              onClick={() => onInsertImage?.(img)}
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
                cursor: 'pointer',
                width: '100%',
                height: 70,
                overflow: 'hidden',
              }}
            >
              <img
                src={img.src}
                alt={img.name || 'Saved image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
            {onApplyToShape && (
              <button
                onClick={() => onApplyToShape(img)}
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(148, 163, 184, 0.35)',
                  background: '#fff',
                  padding: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                Fill shape
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLibrary;




















