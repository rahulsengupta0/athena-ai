import React from 'react';

const SaveExportModal = ({
  open,
  onClose,
  exportFormat,
  setExportFormat,
  exportQuality,
  setExportQuality,
  includeProjectFile,
  setIncludeProjectFile,
  isExporting,
  onDownload,
  onSaveWorksheet
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={() => !isExporting && onClose()}
    >
      <div
        style={{
          width: 420,
          maxWidth: '90%',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
          padding: 16
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Export design</div>
          <button
            onClick={() => !isExporting && onClose()}
            style={{ border: 'none', background: 'transparent', cursor: isExporting ? 'not-allowed' : 'pointer', fontSize: 16 }}
            disabled={isExporting}
            title="Close"
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {exportFormat === 'jpeg' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, color: '#374151' }}>Quality</label>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(exportQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={exportQuality}
                onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
            <input
              type="checkbox"
              checked={includeProjectFile}
              onChange={(e) => setIncludeProjectFile(e.target.checked)}
            />
            Also download project file (.json)
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <button
                onClick={onSaveWorksheet}
                disabled={isExporting}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: 'white',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  fontSize: 13
                }}
                title="Save worksheet (.json) to a chosen location"
              >
                Save worksheet to location
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onClose}
                disabled={isExporting}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: 'white',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  fontSize: 13
                }}
              >
                Cancel
              </button>
              <button
                onClick={onDownload}
                disabled={isExporting}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #2563eb',
                  borderRadius: 8,
                  background: '#2563eb',
                  color: 'white',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  minWidth: 110
                }}
                title="Download"
              >
                {isExporting ? 'Preparing…' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveExportModal;


