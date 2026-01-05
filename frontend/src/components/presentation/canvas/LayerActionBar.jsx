import React from 'react';
import { Copy, Edit2, Trash2, Sparkles, Upload } from 'lucide-react';

const iconButtonStyle = {
  border: 'none',
  background: 'transparent',
  padding: 4,
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.15s ease, color 0.15s ease',
};

const LayerActionBar = ({
  layer,
  bounds,
  onDuplicate,
  onEdit,
  onDelete,
  onEnhance,
  onUpload,
  enhancing,
  uploading,
}) => {
  if (!layer || !layer.visible || !bounds) return null;

  const handleButtonClick = (event, callback) => {
    event.stopPropagation();
    event.preventDefault();
    callback?.();
  };

  const barLeft = bounds.x + bounds.width / 2;
  const barTop = Math.max(8, bounds.y - 44);
  const isImage = layer.type === 'image';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: barLeft,
          top: barTop,
          transform: 'translate(-50%, 0)',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: '#ffffff',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: 999,
            padding: '4px 10px',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
          }}
        >
          <button
            title="Duplicate"
            style={iconButtonStyle}
            onClick={(event) => handleButtonClick(event, () => onDuplicate(layer))}
          >
            <Copy size={14} color="#0f172a" />
          </button>
          <button
            title="Edit"
            style={iconButtonStyle}
            onClick={(event) => handleButtonClick(event, () => onEdit(layer))}
          >
            <Edit2 size={14} color="#0f172a" />
          </button>
          {isImage && (
            <button
              title={uploading ? 'Uploading...' : 'Replace image'}
              style={{
                ...iconButtonStyle,
                opacity: uploading ? 0.6 : 1,
                cursor: uploading ? 'wait' : 'pointer',
              }}
              disabled={uploading}
              onClick={(event) =>
                handleButtonClick(event, () => {
                  if (!uploading) {
                    onUpload?.(layer);
                  }
                })
              }
            >
              <Upload size={14} color="#0f172a" />
            </button>
          )}
          <button
            title="Enhance"
            style={{
              ...iconButtonStyle,
              opacity: enhancing ? 0.6 : 1,
              cursor: enhancing ? 'not-allowed' : 'pointer',
            }}
            disabled={enhancing}
            onClick={(event) =>
              handleButtonClick(event, () => {
                if (!enhancing) {
                  onEnhance(layer);
                }
              })
            }
          >
            <Sparkles size={14} color="#4f46e5" />
          </button>
          <button
            title="Delete"
            style={iconButtonStyle}
            onClick={(event) => handleButtonClick(event, () => onDelete(layer))}
          >
            <Trash2 size={14} color="#dc2626" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayerActionBar;

