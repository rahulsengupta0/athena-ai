import React, { useState, useMemo } from 'react';
import EffectSlider from './EffectSlider';
import { normalizeShadow } from '../utils/effectDefaults';

const ShadowControls = ({ value, onChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shadow = useMemo(() => normalizeShadow(value), [value]);

  const handleShadowChange = (patch) => {
    onChange({
      ...shadow,
      ...patch,
    });
  };

  const toggleEnabled = () => {
    handleShadowChange({ enabled: !shadow.enabled });
  };

  return (
    <div
      style={{
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: 16,
        padding: '12px',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 600,
            color: '#0f172a',
            flex: 1,
            textAlign: 'left',
          }}
        >
          <span>Shadow</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{isOpen ? 'Hide' : 'Show'}</span>
        </button>
        {typeof onReset === 'function' && (
          <button
            onClick={onReset}
            style={{
              border: 'none',
              background: 'rgba(15, 23, 42, 0.08)',
              color: '#0f172a',
              borderRadius: 10,
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={shadow.enabled} onChange={toggleEnabled} />
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>Enable shadow</span>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Shadow colour</span>
            <input
              type="color"
              value={shadow.color}
              onChange={(event) => handleShadowChange({ color: event.target.value })}
              style={{ width: '100%', height: 40, borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.35)' }}
              disabled={!shadow.enabled}
            />
          </label>

          <EffectSlider
            label="Opacity"
            min={0}
            max={1}
            step={0.05}
            value={shadow.opacity}
            onChange={(val) => handleShadowChange({ opacity: val })}
            disabled={!shadow.enabled}
          />

          <EffectSlider
            label="Blur"
            min={0}
            max={40}
            step={1}
            value={shadow.blur}
            onChange={(val) => handleShadowChange({ blur: val })}
            disabled={!shadow.enabled}
          />

          <EffectSlider
            label="Offset X"
            min={-100}
            max={100}
            step={1}
            value={shadow.offsetX}
            onChange={(val) => handleShadowChange({ offsetX: val })}
            disabled={!shadow.enabled}
          />

          <EffectSlider
            label="Offset Y"
            min={-100}
            max={100}
            step={1}
            value={shadow.offsetY}
            onChange={(val) => handleShadowChange({ offsetY: val })}
            disabled={!shadow.enabled}
          />
        </>
      )}
    </div>
  );
};

export default ShadowControls;

