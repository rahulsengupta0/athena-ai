import React, { useEffect, useRef, useState } from 'react';

const ShapeImageFillControls = ({
  layer,
  onChange,
  imageLibrary = [],
  onStoreImage,
}) => {
  const [mode, setMode] = useState(layer.fillType || 'color');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMode(layer.fillType || 'color');
  }, [layer.fillType, layer.fillImageSrc]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    if (nextMode === 'color') {
      onChange({
        fillType: 'color',
        fillImageSrc: null,
      });
    } else {
      onChange({
        fillType: 'image',
      });
    }
  };

  const handleUploadFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const img = new window.Image();
      img.onload = () => {
        onStoreImage?.({
          src: result,
          width: img.width,
          height: img.height,
        });
        onChange({
          fillType: 'image',
          fillImageSrc: result,
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFitChange = (event) => {
    onChange({
      fillImageFit: event.target.value,
    });
  };

  const handleClearImage = () => {
    onChange({
      fillType: 'color',
      fillImageSrc: null,
    });
  };

  return (
    <div
      style={{
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: 18,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { value: 'color', label: 'Colour' },
          { value: 'image', label: 'Image fill' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleModeChange(option.value)}
            style={{
              flex: 1,
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: 12,
              padding: '8px 0',
              background: mode === option.value ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
              fontWeight: 600,
              color: mode === option.value ? '#4f46e5' : '#0f172a',
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === 'image' && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: 12,
              padding: '8px 12px',
              background: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUploadFile}
          />

          {imageLibrary.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Saved images</span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 8,
                }}
              >
                {imageLibrary.slice(0, 6).map((img) => (
                  <button
                    key={img.id}
                    onClick={() =>
                      onChange({
                        fillType: 'image',
                        fillImageSrc: img.src,
                      })
                    }
                    style={{
                      border: '1px solid rgba(148, 163, 184, 0.35)',
                      borderRadius: 10,
                      padding: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#fff',
                      height: 60,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.name || 'Saved image'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Object fit</span>
            <select
              value={layer.fillImageFit || 'cover'}
              onChange={handleFitChange}
              style={{
                borderRadius: 12,
                border: '1px solid rgba(148, 163, 184, 0.35)',
                padding: '8px 10px',
              }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </label>

          {layer.fillImageSrc && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#fff',
                borderRadius: 12,
                padding: 8,
                border: '1px solid rgba(148, 163, 184, 0.35)',
              }}
            >
              <img
                src={layer.fillImageSrc}
                alt="fill preview"
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>Current image</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {layer.fillImageSrc}
                </div>
              </div>
              <button
                onClick={handleClearImage}
                style={{
                  border: 'none',
                  background: 'rgba(248, 113, 113, 0.15)',
                  color: '#b91c1c',
                  borderRadius: 10,
                  padding: '6px 10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShapeImageFillControls;

