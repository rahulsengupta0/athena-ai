import React from 'react';
import { FiMonitor, FiSmartphone, FiMaximize } from 'react-icons/fi';
import { PRESENTATION_LAYOUTS } from './layouts';

const ICON_MAP = {
  desktop: <FiMonitor size={22} />,
  phone: <FiSmartphone size={22} />,
  classic: <FiMaximize size={22} />,
};

const LayoutPicker = ({ onSelect }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '48px 24px 64px',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 14px',
            borderRadius: '999px',
            background: 'rgba(15, 23, 42, 0.08)',
            color: '#111827',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '18px',
          }}
        >
          🎯 Choose your canvas
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(2rem, 3.6vw, 2.85rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.15,
          }}
        >
          Start a beautiful presentation
        </h1>
        <p
          style={{
            margin: '14px 0 0',
            maxWidth: '640px',
            fontSize: '1.05rem',
            color: '#475569',
            lineHeight: 1.6,
          }}
        >
          Pick a layout that fits your story. These presets match the most popular presentation formats
          across devices. You can always customise the design once you're inside the editor.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '22px',
          width: '100%',
        }}
      >
        {PRESENTATION_LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '28px 26px',
              borderRadius: '24px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              background: '#ffffff',
              boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              position: 'relative',
              isolation: 'isolate',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 18px 48px rgba(15, 23, 42, 0.08)';
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '0',
                background: `linear-gradient(135deg, ${layout.accent}22, transparent 65%)`,
                zIndex: -1,
              }}
            />

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: `${layout.accent}15`,
                color: layout.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ICON_MAP[layout.icon]}
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: `${layout.accent}1A`,
                  color: layout.accent,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  marginBottom: '10px',
                }}
              >
                {layout.aspectLabel}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.25,
                }}
              >
                {layout.name}
              </h2>
            </div>

            <p
              style={{
                margin: '6px 0 0',
                fontSize: '0.98rem',
                color: '#475569',
                lineHeight: 1.55,
              }}
            >
              {layout.description}
            </p>

            <div
              style={{
                marginTop: 'auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              <span style={{ opacity: 0.72 }}>
                {layout.width} × {layout.height}px
              </span>
              <span
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  lineHeight: 1,
                }}
              >
                Use layout
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutPicker;

