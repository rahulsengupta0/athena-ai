import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const ZoomControls = ({ zoom, onZoomChange, onFitToScreen, onZoomTo100, compact = false }) => {
  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3); // Max 300%
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1); // Min 10%
    onZoomChange(newZoom);
  };

  // Compact style for header bar
  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
          style={{
            border: '1px solid rgba(15, 23, 42, 0.1)',
            background: zoom <= 0.1 ? 'rgba(15, 23, 42, 0.02)' : 'rgba(15, 23, 42, 0.04)',
            color: zoom <= 0.1 ? '#94a3b8' : '#0f172a',
            borderRadius: 10,
            padding: '6px 8px',
            cursor: zoom <= 0.1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: zoom <= 0.1 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={onZoomTo100}
          style={{
            border: '1px solid rgba(15, 23, 42, 0.1)',
            background: 'rgba(15, 23, 42, 0.04)',
            color: '#0f172a',
            borderRadius: 10,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            minWidth: '50px',
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
          title="Zoom to 100%"
        >
          {zoomPercentage}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          style={{
            border: '1px solid rgba(15, 23, 42, 0.1)',
            background: zoom >= 3 ? 'rgba(15, 23, 42, 0.02)' : 'rgba(15, 23, 42, 0.04)',
            color: zoom >= 3 ? '#94a3b8' : '#0f172a',
            borderRadius: 10,
            padding: '6px 8px',
            cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: zoom >= 3 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={onFitToScreen}
          style={{
            border: '1px solid rgba(15, 23, 42, 0.1)',
            background: 'rgba(15, 23, 42, 0.04)',
            color: '#0f172a',
            borderRadius: 10,
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          title="Fit to Screen"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    );
  }

  // Full style for canvas area (legacy, kept for backward compatibility)
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px',
        zIndex: 10,
      }}
    >
      <button
        onClick={handleZoomOut}
        disabled={zoom <= 0.1}
        style={{
          border: 'none',
          background: 'transparent',
          color: zoom <= 0.1 ? '#cbd5e1' : '#475569',
          padding: '6px 8px',
          borderRadius: '8px',
          cursor: zoom <= 0.1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (zoom > 0.1) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>

      <button
        onClick={onZoomTo100}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#475569',
          padding: '6px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
          minWidth: '60px',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title="Zoom to 100%"
      >
        {zoomPercentage}%
      </button>

      <button
        onClick={handleZoomIn}
        disabled={zoom >= 3}
        style={{
          border: 'none',
          background: 'transparent',
          color: zoom >= 3 ? '#cbd5e1' : '#475569',
          padding: '6px 8px',
          borderRadius: '8px',
          cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (zoom < 3) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>

      <div
        style={{
          width: '1px',
          height: '24px',
          background: 'rgba(148, 163, 184, 0.3)',
          margin: '0 4px',
        }}
      />

      <button
        onClick={onFitToScreen}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#475569',
          padding: '6px 8px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title="Fit to Screen"
      >
        <Maximize2 size={18} />
      </button>
    </div>
  );
};

export default ZoomControls;

